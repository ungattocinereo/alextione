import { tours, tourPath } from "../lib/site";
import { getPosts } from "../lib/ghost";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ site }) => {
  const paths = [
    "/",
    "/tours/",
    "/about/",
    "/photo-art/",
    "/shop/",
    "/book/",
    "/privacy/",
    "/cookies/",
    "/legal/",
    "/religione-monoteistica/",
    ...tours.map(tourPath),
    "/blog/",
    ...(await getPosts()).map((post) => post.path),
  ];
  const urls = ["", "/it"].flatMap((prefix) =>
    paths.map(
      (path) => {
        const href = (language: string) => new URL(language + path, site).href;
        return `<url><loc>${href(prefix)}</loc><xhtml:link rel="alternate" hreflang="en" href="${href("")}"/><xhtml:link rel="alternate" hreflang="it" href="${href("/it")}"/><xhtml:link rel="alternate" hreflang="x-default" href="${href("")}"/></url>`;
      },
    ),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
