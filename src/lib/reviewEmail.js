const contact = "alessandrotione@escapevision.it";

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

const paragraphs = (text) => escapeHtml(text).replace(/\r\n?|\n/g, "<br>");
const stars = (rating) => (rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "");

function frame(lang, heading, body) {
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#f3f6f7;color:#192f40;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:580px;margin:16px auto;background:#fff;border:1px solid #d6dfe3"><div style="padding:24px">
      <p style="margin:0 0 8px;color:#155878;font-size:13px;font-weight:bold">alextione.it</p>
      <h1 style="margin:0 0 18px;font-size:26px;line-height:32px">${escapeHtml(heading)}</h1>
      ${body}
    </div></div></body></html>`;
}

const button = (href, label, background) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:4px;background:${background};color:#fff;font-size:16px;font-weight:bold;text-decoration:none">${escapeHtml(label)}</a>`;
const quote = (review) =>
  `<blockquote style="margin:18px 0;padding:12px 16px;border-left:4px solid #0066cc;background:#f5f7f8;font-size:16px;line-height:24px;overflow-wrap:anywhere">${review.rating ? `<span style="color:#b7791f">${stars(review.rating)}</span><br>` : ""}${paragraphs(review.text)}</blockquote>`;

// Sent to the guest: the review counts only after they open this link.
export function confirmationEmail(review, tourTitle, link) {
  const it = review.language === "it";
  const copy = it
    ? {
        subject: "Conferma la tua recensione · alextione.it",
        heading: "Conferma la tua recensione",
        hello: `Ciao ${review.name},`,
        intro: `grazie per aver scritto una recensione su “${tourTitle}”. Per confermare che sei stato tu a inviarla, apri questo link entro 7 giorni:`,
        action: "Conferma la recensione",
        after: "Dopo la conferma Alex la leggerà e la pubblicherà sul sito. Il tuo indirizzo email non sarà mostrato.",
        ignore: `Non hai scritto tu questa recensione? Ignora questo messaggio: senza conferma verrà cancellata. Per parlare con Alex scrivi a ${contact}.`,
        yours: "La tua recensione",
      }
    : {
        subject: "Confirm your review · alextione.it",
        heading: "Confirm your review",
        hello: `Hi ${review.name},`,
        intro: `thank you for reviewing “${tourTitle}”. To confirm it was you who sent it, open this link within 7 days:`,
        action: "Confirm my review",
        after: "Once confirmed, Alex will read it and publish it on the site. Your email address will not be shown.",
        ignore: `Didn’t write this review? Ignore this message: without confirmation it will be deleted. To reach Alex, write to ${contact}.`,
        yours: "Your review",
      };
  return {
    subject: copy.subject,
    text: [copy.hello, copy.intro, link, copy.after, copy.yours + ":\n" + [stars(review.rating), review.text].filter(Boolean).join("\n"), copy.ignore].join("\n\n"),
    html: frame(review.language, copy.heading, `
      <p style="margin:0 0 14px;font-size:16px;line-height:24px">${escapeHtml(copy.hello)}<br>${escapeHtml(copy.intro)}</p>
      <p style="margin:0 0 6px">${button(link, copy.action, "#0066cc")}</p>
      <p style="margin:0;font-size:15px;line-height:22px">${escapeHtml(copy.after)}</p>
      ${quote(review)}
      <p style="margin:0;color:#495868;font-size:13px;line-height:19px">${escapeHtml(copy.ignore)}</p>`),
  };
}

// Sent to Alex once the guest has confirmed: he decides whether it goes on the site.
export function moderationEmail(review, tourTitle, approveLink, rejectLink) {
  const rows = [
    ["Nome", review.name],
    ["Email (non pubblicata)", review.email],
    ["Tour", tourTitle],
    ["Voto", review.rating ? `${stars(review.rating)} (${review.rating}/5)` : "Nessun voto"],
    ["Lingua del modulo", review.language === "it" ? "Italiano" : "Inglese"],
  ];
  const note = "L’ospite ha confermato il suo indirizzo email. La recensione compare sul sito solo se la approvi; dopo l’approvazione il sito si aggiorna in un paio di minuti. Conserva questo messaggio: con “Rifiuta” puoi anche togliere in seguito una recensione già pubblicata.";
  return {
    subject: `⭐️ ${review.name} · Nuova recensione da approvare · alextione.it`,
    text: [
      "Nuova recensione da approvare", rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      "Recensione\n" + review.text, "Approva e pubblica: " + approveLink, "Rifiuta ed elimina: " + rejectLink, note,
    ].join("\n\n"),
    html: frame("it", "Nuova recensione da approvare", `
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;font-size:15px;line-height:22px;color:#192f40">
        ${rows.map(([label, value]) => `<tr><th scope="row" align="left" valign="top" width="34%" style="padding:4px 8px 4px 0;font-weight:bold">${label}</th>
          <td valign="top" style="padding:4px 0;overflow-wrap:anywhere;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("")}
      </table>
      ${quote({ text: review.text })}
      <p style="margin:0 0 6px">${button(approveLink, "Approva e pubblica", "#1f7a3d")}${button(rejectLink, "Rifiuta", "#8e3027")}</p>
      <p style="margin:0;color:#495868;font-size:13px;line-height:19px">${escapeHtml(note)}</p>`),
  };
}
