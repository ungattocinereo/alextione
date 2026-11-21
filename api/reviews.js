import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

import catalog from "../src/data/tours.json" with { type: "json" };
import { confirmationEmail, escapeHtml, moderationEmail } from "../src/lib/reviewEmail.js";
import { configuredStore } from "../src/lib/reviewStore.js";

// Guest reviews: the guest submits, confirms through a link sent to their email,
// and Alex approves or rejects from his notification before anything is published.

const tours = new Map(catalog.tours.map((tour) => [tour.slug, tour]));
const singleAddress = /^[^\s@,;:<>"\\\p{Cc}]+@[^\s@,;:<>"\\\p{Cc}]+\.[^\s@,;:<>"\\\p{Cc}]+$/u;
const week = 7 * 24 * 60 * 60;
const hash = (value) => createHash("sha256").update(value).digest("hex").slice(0, 32);
const secret = () => randomBytes(24).toString("hex");
const sameSecret = (a, b) =>
  typeof a === "string" && typeof b === "string" && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

function readReview(body) {
  if (!body || typeof body !== "object") return null;
  // Hidden honeypot field: real visitors leave it empty. Bots get a fake success and nothing is stored.
  if (body.website) return { spam: true };
  const text = (value, max) => (typeof value === "string" && value.length <= max ? value.trim() : "");
  const name = text(body.name, 100);
  const email = text(body.email, 254);
  const review = text(body.review, 2000);
  const rating = body.rating == null || body.rating === "" ? null : Number(body.rating);
  if (
    body.consent !== "yes" || !["en", "it"].includes(body.language) || !tours.has(body.tour) ||
    !name || /[\r\n]/.test(name) || !singleAddress.test(email) || review.length < 20 ||
    (rating !== null && ![1, 2, 3, 4, 5].includes(rating))
  ) return null;
  return { name, email, tour: body.tour, rating, text: review, language: body.language };
}

async function mailgun({ to, subject, text, html, fromName, replyTo }) {
  const { MAILGUN_API_KEY, BOOKING_FROM_EMAIL = "website@alextione.it" } = process.env;
  if (!MAILGUN_API_KEY) throw new Error("Review email configuration required");
  const sender = (BOOKING_FROM_EMAIL.match(/<([^<>]+)>\s*$/)?.[1] || BOOKING_FROM_EMAIL).trim();
  if (!singleAddress.test(sender)) throw new Error("Invalid review sender address");
  const form = new FormData();
  form.set("from", `"${fromName.replace(/[\p{Cc}\u202a-\u202e\u2066-\u2069]/gu, "").replace(/["\\]/g, "\\$&")}" <${sender}>`);
  form.set("to", to);
  if (replyTo) form.set("h:Reply-To", replyTo);
  form.set("subject", subject);
  form.set("text", text);
  form.set("html", html);
  form.set("o:tracking", "no");
  const response = await fetch("https://api.eu.mailgun.net/v3/alextione.it/messages", {
    method: "POST",
    signal: AbortSignal.timeout(12000),
    headers: { Authorization: `Basic ${Buffer.from("api:" + MAILGUN_API_KEY).toString("base64")}` },
    body: form,
  });
  if (!response.ok) {
    console.error("Mailgun rejected review email", response.status);
    throw new Error("Email delivery failed");
  }
  console.info("Mailgun accepted review email", (await response.json()).id);
}

// The approved list is baked into the static pages, so publishing or removing a review rebuilds the site.
async function rebuild() {
  const hook = process.env.REVIEWS_DEPLOY_HOOK_URL;
  if (!hook) return false;
  try {
    return (await fetch(hook, { method: "POST", signal: AbortSignal.timeout(8000) })).ok;
  } catch {
    return false;
  }
}

function page(res, status, lang, title, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)} · Alex Tione</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#faf8f5;color:#07375d;font:1rem/1.6 system-ui,sans-serif}
main{box-sizing:border-box;width:min(560px,100% - 2rem);margin:1rem;padding:clamp(1.4rem,5vw,2.3rem);background:#fff;border:1px solid #bfd9ea;border-radius:10px}
h1{margin:0 0 1rem;font-size:clamp(1.7rem,6vw,2.3rem);line-height:1.1}p{margin:0 0 1rem;overflow-wrap:anywhere}
blockquote{margin:0 0 1.2rem;padding:.8rem 1rem;border-left:4px solid #0066cc;background:#e7f5ff;overflow-wrap:anywhere}
a{color:#0066cc}button{min-height:48px;padding:.7rem 1.2rem;border:0;border-radius:5px;background:#0066cc;color:#fff;font:600 1rem/1.4 system-ui,sans-serif;cursor:pointer}
button.reject{background:#8e3027}small{color:#495868}</style></head><body><main><h1>${escapeHtml(title)}</h1>${body}</main></body></html>`);
}

const home = (origin, lang) => `<p><a href="${origin}${lang === "it" ? "/it" : ""}/tours/">${lang === "it" ? "Torna ai tour" : "Back to the tours"} →</a></p>`;

function invalidLink(res, lang) {
  return lang === "it"
    ? page(res, 404, "it", "Link non più valido", "<p>Questo link è scaduto oppure è già stato usato per eliminare la recensione.</p>")
    : page(res, 404, "en", "This link is no longer valid", "<p>It has expired, or the review has already been removed.</p>");
}

// "id.token" from a link → the stored review, only if the token matches.
async function locate(store, value, tokenField) {
  const [id, token] = typeof value === "string" ? value.split(".") : [];
  if (!/^[a-f0-9]{32}$/.test(id || "") || !/^[a-f0-9]{48}$/.test(token || "")) return null;
  const review = await store.get(id);
  return review && sameSecret(review[tokenField], token) ? review : null;
}

async function submit(req, res, body, { store, send, origin, preview }) {
  const reply = (code, data) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };
  const data = readReview(body);
  if (!data) return reply(422, { ok: false });
  if (data.spam) return reply(200, { ok: true, preview });
  const ip = (req.headers["x-vercel-forwarded-for"] || req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (isIP(ip) && (await store.count(hash(ip), 3600)) > 5) return reply(429, { ok: false });
  // One unconfirmed review per address, so the form can't be used to flood someone's inbox.
  const lock = hash(data.email.toLowerCase());
  if (!(await store.claim(lock, week))) return reply(200, { ok: true, preview, pending: true });
  const review = {
    id: randomBytes(16).toString("hex"), status: "pending", ...data,
    createdAt: new Date().toISOString(), confirmToken: secret(), adminToken: secret(),
  };
  try {
    await store.put(review, week);
    const link = `${origin}/api/reviews/?confirm=${review.id}.${review.confirmToken}`;
    await send({
      to: review.email, fromName: "Alex Tione · alextione.it",
      ...confirmationEmail(review, tours.get(review.tour)[review.language].title, link),
    });
  } catch (error) {
    await Promise.allSettled([store.remove(review.id), store.release(lock)]);
    throw error;
  }
  reply(200, { ok: true, preview });
}

async function confirm(res, value, { store, send, origin, owner }) {
  const review = await locate(store, value, "confirmToken");
  if (!review) return invalidLink(res, "en");
  const lang = review.language;
  if (review.status === "pending") {
    if (!owner) throw new Error("Review recipient required");
    const link = (decision) => `${origin}/api/reviews/?moderate=${review.id}.${review.adminToken}&decision=${decision}`;
    await send({
      to: owner, fromName: review.name + " · recensione su alextione.it", replyTo: review.email,
      ...moderationEmail(review, tours.get(review.tour).it.title, link("approve"), link("reject")),
    });
    await store.put({ ...review, status: "confirmed", confirmedAt: new Date().toISOString() });
    await store.release(hash(review.email.toLowerCase()));
  }
  return lang === "it"
    ? page(res, 200, "it", "Grazie, recensione confermata", "<p>Alex la leggerà e la pubblicherà sul sito appena possibile.</p>" + home(origin, "it"))
    : page(res, 200, "en", "Thank you, your review is confirmed", "<p>Alex will read it and publish it on the site as soon as he can.</p>" + home(origin, "en"));
}

async function moderate(req, res, value, decision, { store }) {
  const review = await locate(store, value, "adminToken");
  if (!review || review.status === "pending" || !["approve", "reject"].includes(decision)) return invalidLink(res, "it");
  const approve = decision === "approve";
  const published = review.status === "approved";
  const quote = `<blockquote><strong>${escapeHtml(review.name)}</strong> · ${escapeHtml(tours.get(review.tour).it.title)}${review.rating ? ` · ${review.rating}/5` : ""}<br>${escapeHtml(review.text).replace(/\r\n?|\n/g, "<br>")}</blockquote>`;
  if (approve && published) return page(res, 200, "it", "Recensione già pubblicata", quote + "<p>Non serve fare altro.</p>");
  // Opening the link only shows this page; the decision needs the button. Mail scanners that open links can't approve anything.
  if (req.method !== "POST") {
    const action = `/api/reviews/?moderate=${review.id}.${review.adminToken}&decision=${decision}`;
    return page(res, 200, "it", approve ? "Pubblicare questa recensione?" : published ? "Togliere questa recensione dal sito?" : "Rifiutare questa recensione?",
      `${quote}<form method="post" action="${action}"><button${approve ? "" : ' class="reject"'}>${approve ? "Sì, approva e pubblica" : "Sì, elimina la recensione"}</button></form>
      <p><small>${approve ? "Sarà visibile sul sito dopo un paio di minuti." : "La recensione verrà cancellata definitivamente."}</small></p>`);
  }
  if (approve) {
    // The address was only needed to verify the guest; it is not kept with the published review.
    const { email, confirmToken, ...kept } = review;
    await store.put({ ...kept, status: "approved", approvedAt: new Date().toISOString() });
  } else {
    await store.remove(review.id);
  }
  const rebuilt = approve || published ? await rebuild() : true;
  const delay = rebuilt ? "Il sito si aggiorna in un paio di minuti." : "Il sito si aggiornerà alla prossima pubblicazione.";
  return approve
    ? page(res, 200, "it", "Recensione approvata", quote + `<p>${delay}</p>`)
    : page(res, 200, "it", "Recensione eliminata", `<p>${published ? delay : "Non verrà pubblicata."}</p>`);
}

export async function handleReviews(req, res, local) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  const query = new URL(req.url, "http://localhost").searchParams;
  const context = local ? { ...local, preview: true } : {
    store: configuredStore(), send: mailgun, preview: false,
    origin: (process.env.SITE_URL || "https://alextione.it").replace(/\/$/, ""),
    owner: process.env.REVIEWS_TO_EMAIL || process.env.BOOKING_TO_EMAIL,
  };
  const link = query.get("confirm") || query.get("moderate");
  const fail = (code) => {
    if (link) return page(res, code, "en", "Something went wrong", "<p>Please try this link again in a few minutes. · Riprova tra qualche minuto.</p>");
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false }));
  };
  if (!["GET", "POST"].includes(req.method) || (req.method === "GET" && !link)) {
    res.setHeader("Allow", "GET, POST");
    return fail(405);
  }
  try {
    if (!context.store) throw new Error("Review store configuration required");
    if (query.has("confirm")) return await confirm(res, query.get("confirm"), context);
    if (query.has("moderate")) return await moderate(req, res, query.get("moderate"), query.get("decision"), context);
    if (!req.headers["content-type"]?.startsWith("application/json")) return fail(415);
    let body = req.body;
    try {
      if (body == null) {
        const parts = [];
        let bytes = 0;
        for await (const part of req) {
          bytes += Buffer.byteLength(part);
          if (bytes > 20000) return fail(413);
          parts.push(Buffer.from(part));
        }
        body = Buffer.concat(parts).toString("utf8");
      }
      if (typeof body === "string") body = JSON.parse(body);
    } catch {
      return fail(400);
    }
    await submit(req, res, body, context);
  } catch (error) {
    console.error("Review request failed:", error.message);
    fail(503);
  }
}

export default function reviews(req, res) {
  return handleReviews(req, res);
}
