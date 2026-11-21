import catalog from "../src/data/tours.json" with { type: "json" };

import { bookingEmail } from "../src/lib/bookingEmail.js";

const tours = new Map(catalog.tours.map((tour) => [tour.slug, tour]));
const clean = (s, max) =>
  typeof s === "string" && s.length <= max ? s.trim() : "";
const singleAddress = /^[^\s@,;:<>"\\\p{Cc}]+@[^\s@,;:<>"\\\p{Cc}]+\.[^\s@,;:<>"\\\p{Cc}]+$/u;

function validDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const day = new Date(date + "T12:00:00Z");
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome" }).format(new Date());
  return Number.isFinite(day.valueOf()) && day.toISOString().slice(0, 10) === date && date >= today;
}

function readBook(body) {
  const { language, timing, delivery, contact } = body;
  const name = clean(body.name, 100);
  const copies = Number(body.copies);
  if (!["number", "string"].includes(typeof body.copies)) return null;
  if (
    body.consent !== "yes" || !["en", "it"].includes(language) ||
    !name || /[\r\n]/.test(name) || !Number.isSafeInteger(copies) || copies < 1 ||
    !["asap", "date"].includes(timing) || !["pickup", "shipping"].includes(delivery) ||
    !["email", "whatsapp"].includes(contact)
  ) return null;

  const data = { kind: "book", language, name, timing, copies, delivery, contact };
  if (timing === "date") {
    if (!validDate(body.date)) return null;
    if (body.time && (typeof body.time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time))) return null;
    data.date = body.date;
    data.time = body.time || "";
  }
  if (delivery === "shipping") {
    data.destination = clean(body.destination, 160);
    if (!data.destination) return null;
  }
  if (contact === "email") {
    data.email = clean(body.email, 254);
    if (!singleAddress.test(data.email)) return null;
  } else {
    data.phone = clean(body.phone, 30);
    if (!/^\+?[\d ()-]+$/.test(data.phone) || !/^\d{6,15}$/.test(data.phone.replace(/\D/g, ""))) return null;
  }
  return data;
}

// Brands and people inviting Alex to collaborate: needs a name, a message and an email or a phone number.
function readCollaboration(body) {
  // Hidden honeypot field: real visitors leave it empty. Bots get a fake success and nothing is sent.
  if (body.website) return { kind: "spam" };
  const { language } = body;
  const name = clean(body.name, 100);
  const message = clean(body.message, 3000);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 30);
  if (
    body.consent !== "yes" || !["en", "it"].includes(language) ||
    !name || /[\r\n]/.test(name) || !message ||
    typeof body.message !== "string" || body.message.length > 3000
  ) return null;
  if (!email && !phone) return null;
  const data = { kind: "collaboration", language, name, message };
  if (email) {
    if (!singleAddress.test(email)) return null;
    data.email = email;
  }
  if (phone) {
    if (!/^\+?[\d ()-]+$/.test(phone) || !/^\d{6,15}$/.test(phone.replace(/\D/g, ""))) return null;
    data.phone = phone;
  }
  return data;
}

function readRequest(body) {
  if (!body || typeof body !== "object") return null;
  if (body.kind === "book") return readBook(body);
  if (body.kind === "collaboration") return readCollaboration(body);
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const message = clean(body.message, 3000);
  const { tour, language } = body;
  if (
    body.consent !== "yes" ||
    !name ||
    /[\r\n]/.test(name) ||
    !singleAddress.test(email)
  )
    return null;
  if (
    typeof body.message !== "string" ||
    body.message.length > 3000 ||
    !["en", "it"].includes(language)
  )
    return null;
  if (tour === "")
    return message ? { name, email, message, language, tour } : null;
  if (!tours.has(tour)) return null;
  const guests = Number(body.guests);
  const date = clean(body.date, 10);
  if (
    !Number.isInteger(guests) ||
    guests < catalog.conditions.minGuests ||
    guests > 999 ||
    !validDate(date)
  )
    return null;
  return { name, email, message, language, tour, guests, date };
}

async function deliver(data, body, headers) {
  const {
    MAILGUN_API_KEY,
    BOOKING_FROM_EMAIL = "website@alextione.it",
    BOOKING_TO_EMAIL,
    BOOKING_COPY_EMAIL,
  } = process.env;
  if (!MAILGUN_API_KEY || !BOOKING_TO_EMAIL) throw new Error("Booking email configuration required");
  const title = data.kind === "book" ? "Richiesta del libro · Religione Monoteistica"
    : data.kind === "collaboration" ? "Richiesta di collaborazione"
    : tours.get(data.tour)?.it.title || "Richiesta di informazioni";
  const email = bookingEmail(data, title, body, headers);
  const form = new FormData();
  const senderAddress = (BOOKING_FROM_EMAIL.match(/<([^<>]+)>\s*$/)?.[1] || BOOKING_FROM_EMAIL).trim();
  if (!singleAddress.test(senderAddress)) throw new Error("Invalid booking sender address");
  const senderName = data.name.replace(/[\p{Cc}\u202a-\u202e\u2066-\u2069]/gu, "").replace(/["\\]/g, "\\$&");
  form.set("from", '"' + senderName + ' · dal sito alextione.it" <' + senderAddress + '>');
  form.append("to", BOOKING_TO_EMAIL);
  if (BOOKING_COPY_EMAIL && BOOKING_COPY_EMAIL !== BOOKING_TO_EMAIL) {
    form.append("to", BOOKING_COPY_EMAIL);
    // Mailgun uses recipient variables to build a separate To header for each delivery.
    form.set("recipient-variables", JSON.stringify({
      [BOOKING_TO_EMAIL]: {},
      [BOOKING_COPY_EMAIL]: {},
    }));
  }
  if (data.email) form.set("h:Reply-To", data.email);
  form.set("subject", email.subject);
  form.set("text", email.text);
  form.set("html", email.html);
  form.set("o:tracking", "no");

  const response = await fetch("https://api.eu.mailgun.net/v3/alextione.it/messages", {
    method: "POST",
    signal: AbortSignal.timeout(12000),
    headers: {
      Authorization: `Basic ${Buffer.from("api:" + MAILGUN_API_KEY).toString("base64")}`,
    },
    body: form,
  });
  if (!response.ok) {
    console.error("Mailgun rejected booking notification", response.status);
    throw new Error("Email delivery failed");
  }
  const { id } = await response.json();
  if (!id) throw new Error("Mailgun did not return a message ID");
  console.info("Mailgun accepted booking notification", id);
}

export async function handleBooking(req, res, localInbox) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  const reply = (code, data) => {
    res.statusCode = code;
    res.end(JSON.stringify(data));
  };
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(405, { ok: false });
  }
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return reply(415, { ok: false });
  let body = req.body;
  try {
    if (body == null) {
      const parts = [];
      let bytes = 0;
      for await (const part of req) {
        bytes += Buffer.byteLength(part);
        if (bytes > 20000) return reply(413, { ok: false });
        parts.push(Buffer.from(part));
      }
      body = Buffer.concat(parts).toString("utf8");
    }
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    return reply(400, { ok: false });
  }
  const data = readRequest(body);
  if (!data) return reply(422, { ok: false });
  if (data.kind === "spam") return reply(200, { ok: true, preview: Boolean(localInbox) });
  try {
    if (localInbox) await localInbox(data);
    else await deliver(data, body, req.headers);
    reply(200, { ok: true, preview: Boolean(localInbox) });
  } catch {
    reply(503, { ok: false });
  }
}

export default function booking(req, res) {
  return handleBooking(req, res);
}
