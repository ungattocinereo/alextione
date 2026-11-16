import { isIP } from "node:net";

const site = "https://alextione.it";
const unavailable = "Unavailable";

function pageUrl(value) {
  if (typeof value !== "string" || !value || value.length > 2048) return "";
  try {
    const url = new URL(value, site);
    if (url.origin !== site || url.username || url.password) return "";
    return url.origin + url.pathname;
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function table(rows, small = false) {
  const style = small ? "font-size:12px;line-height:18px;color:#495868" : "font-size:15px;line-height:22px;color:#192f40";
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;${style}">
    ${rows.map(([label, value]) => {
      const content = label === "Form URL" && value !== unavailable
        ? `<a href="${escapeHtml(value)}" style="color:#155878">${escapeHtml(value)}</a>`
        : escapeHtml(value);
      return `<tr><th scope="row" align="left" valign="top" width="28%" style="padding:4px 8px 4px 0;font-weight:bold">${label}</th>
        <td valign="top" style="padding:4px 0;overflow-wrap:anywhere;word-break:break-word">${content}</td></tr>`;
    }).join("")}
  </table>`;
}

export function bookingEmail(data, title, body, headers) {
  const details = [
    ["Name", data.name],
    data.email ? ["Email", data.email] : ["WhatsApp", data.phone],
    ["Form language", data.language === "it" ? "Italian" : "English"],
  ];
  if (data.kind === "book") {
    details.push(
      ["Copies", data.copies],
      ["Requested by", data.timing === "asap" ? "As soon as possible" : [data.date, data.time].filter(Boolean).join(" ")],
      ["Delivery", data.delivery === "pickup" ? "Pick up in Naples" : "Shipping to " + data.destination],
    );
  } else if (data.tour) {
    details.push(["Preferred date", data.date], ["Guests", data.guests]);
  }

  const ip = (headers["x-vercel-forwarded-for"] || headers["x-forwarded-for"] || "").split(",")[0].trim();
  const tech = [
    ["Page Title", typeof body.pageTitle === "string" && body.pageTitle.trim().slice(0, 250) || unavailable],
    ["Form URL", pageUrl(body.pagePath) || pageUrl(headers.referer) || unavailable],
    ["IP Address", isIP(ip) ? ip : unavailable],
    ["User Agent", headers["user-agent"]?.slice(0, 1024) || unavailable],
  ];
  const textRows = rows => rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const message = data.message || "";
  return {
    subject: `⚽️ ${data.name} · ${title} · alextione.it`,
    text: [
      "Website enquiry from alextione.it", title, textRows(details),
      message && "Message\n" + message, "Technical Info\n" + textRows(tech),
    ].filter(Boolean).join("\n\n"),
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#f3f6f7;color:#192f40;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:580px;margin:16px auto;background:#fff;border:1px solid #d6dfe3;border-top:4px solid #175e7b">
        <div style="padding:24px">
          <p style="margin:0 0 8px;color:#155878;font-size:13px;font-weight:bold">Website enquiry from alextione.it</p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:30px">${escapeHtml(title)}</h1>
          ${table(details)}
          ${message ? `<h2 style="margin:22px 0 6px;font-size:16px">Message</h2>
            <p style="margin:0;font-size:16px;line-height:24px;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r\n?|\n/g, "<br>")}</p>` : ""}
        </div>
        <div style="padding:16px 24px;background:#f5f7f8;border-top:1px solid #d6dfe3">
          <h2 style="margin:0 0 6px;font-size:13px;line-height:18px;color:#394d5d">Technical Info</h2>
          ${table(tech, true)}
        </div>
      </div></body></html>`,
  };
}
