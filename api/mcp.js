import { createHash, timingSafeEqual } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { ghostAdmin, GhostError } from "../src/lib/ghostAdmin.js";

// MCP server (Streamable HTTP, stateless) that lets language models write the blog.
// Models never see the Ghost key: each one has its own bearer token, listed by SHA-256 in BLOG_MCP_TOKENS.
// Without the `publish` right a token can only create and edit drafts. Nothing here can delete.

const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX_BODY = 4_000_000;
const MAX_IMAGE = 10_000_000;

const text = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 255 },
    markdown: { type: "string", description: "Article body in Markdown. Do not repeat the title as a heading. Use either `markdown` or `html`." },
    html: { type: "string", description: "Article body in HTML, as an alternative to `markdown`." },
    excerpt: { type: "string", maxLength: 300, description: "One or two sentences shown on the blog index and under the title." },
    meta_title: { type: "string", maxLength: 300 },
    meta_description: { type: "string", maxLength: 500, description: "Search-result description, about 150 characters." },
    image_alt: { type: "string", maxLength: 125, description: "Alternative text for the cover image, in this language." },
  },
};
const required = { ...text, required: ["title"] };
const shared = {
  tags: { type: "array", items: { type: "string", maxLength: 60 }, maxItems: 10, description: "Public topic tags, same for both languages, e.g. [\"Maradona\", \"Street food\"]." },
  feature_image: { type: "string", description: "Cover image URL. Upload the picture with upload_image first and pass the URL it returns." },
};
const slug = { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", maxLength: 80, description: "Article slug as returned by list_posts, e.g. \"maradona-murals\"." };

const TOOLS = [
  { name: "list_posts", description: "List blog articles with their status in English and Italian, most recently edited first.",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      status: { type: "string", enum: ["all", "published", "draft"], default: "all" },
      limit: { type: "integer", minimum: 1, maximum: 100, default: 30 } } } },
  { name: "get_post", description: "Read one article: both language versions as HTML, tags, cover image and status.",
    inputSchema: { type: "object", additionalProperties: false, required: ["slug"], properties: { slug } } },
  { name: "create_post", description: "Create a new article as a draft. Every article needs an English and an Italian version, written natively in each language. Returns the slug and links to the drafts in Ghost. Set `publish` only if your token is allowed to publish.",
    inputSchema: { type: "object", additionalProperties: false, required: ["en", "it"], properties: {
      en: required, it: required, ...shared,
      slug: { ...slug, description: "Optional URL slug in English; derived from the English title when omitted." },
      publish: { type: "boolean", default: false } } } },
  { name: "update_post", description: "Change an existing article. Send only the fields to change; a body sent for a language replaces that language's whole text. Published articles change on the live site.",
    inputSchema: { type: "object", additionalProperties: false, required: ["slug"], properties: { slug, en: text, it: text, ...shared } } },
  { name: "publish_post", description: "Publish both language versions of an article. Requires a token with the publish right.",
    inputSchema: { type: "object", additionalProperties: false, required: ["slug"], properties: { slug } } },
  { name: "unpublish_post", description: "Return a published article to draft, removing it from the site. Requires a token with the publish right.",
    inputSchema: { type: "object", additionalProperties: false, required: ["slug"], properties: { slug } } },
  { name: "upload_image", description: "Upload a JPEG, PNG, WebP or GIF to the blog and get its URL for `feature_image` or for use inside an article. Pass either a public https `url` to copy from, or `data` as base64 (up to about 2.5 MB).",
    inputSchema: { type: "object", additionalProperties: false, properties: {
      url: { type: "string", format: "uri" }, data: { type: "string" },
      filename: { type: "string", maxLength: 100, description: "Descriptive file name, e.g. \"quartieri-spagnoli-mural.jpg\"." } } } },
];

const INSTRUCTIONS = "Blog of Alessandro Tione, tour guide and photographer in Naples (alextione.it/blog). " +
  "Each article exists in English and Italian under one slug; write both versions natively rather than translating word for word. " +
  "Articles are created as drafts and appear on the site only after both versions are published; the site rebuilds a few minutes after publishing. " +
  "Nothing can be deleted through this server.";

function clients() {
  try { return JSON.parse(process.env.BLOG_MCP_TOKENS || "{}"); } catch { return {}; }
}

/** Finds the client whose stored SHA-256 matches the presented bearer token. */
export function authenticate(header, known = clients()) {
  const presented = /^Bearer\s+(\S+)$/i.exec(header || "")?.[1];
  if (!presented) return null;
  const hash = createHash("sha256").update(presented).digest();
  let found = null;
  for (const [name, client] of Object.entries(known)) {
    const stored = Buffer.from(String(client.sha256 || ""), "hex");
    if (stored.length === hash.length && timingSafeEqual(stored, hash)) found = { name, publish: client.publish === true };
  }
  return found;
}

const privateAddress = (ip) =>
  /^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(ip) ||
  /^(::1?$|f[cd]|fe80|::ffff:)/i.test(ip);

async function fetchImage(address) {
  let target;
  try { target = new URL(address); } catch { throw new GhostError("`url` is not a valid URL."); }
  if (target.protocol !== "https:") throw new GhostError("Only https image URLs are accepted.");
  const addresses = isIP(target.hostname) ? [{ address: target.hostname }] : await lookup(target.hostname, { all: true }).catch(() => []);
  if (!addresses.length || addresses.some((entry) => privateAddress(entry.address))) throw new GhostError("That image host is not reachable.");
  const response = await fetch(target, { redirect: "error", signal: AbortSignal.timeout(15000) }).catch(() => null);
  if (!response?.ok) throw new GhostError("Could not download the image from that URL.");
  if (Number(response.headers.get("content-length")) > MAX_IMAGE) throw new GhostError("The image is larger than 10 MB.");
  const bytes = Buffer.from(await response.arrayBuffer());
  return { bytes, type: (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase(), name: target.pathname.split("/").pop() };
}

function sniff(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP") return "image/webp";
  if (bytes.subarray(0, 4).toString() === "GIF8") return "image/gif";
}

function checkText(lang, value, mustHaveBody) {
  if (!value) return;
  if (value.markdown != null && value.html != null) throw new GhostError(`${lang}: send either markdown or html, not both.`);
  if (value.title != null && !value.title.trim()) throw new GhostError(`${lang}: the title is empty.`);
  if (mustHaveBody && !(value.markdown || value.html)?.trim()) throw new GhostError(`${lang}: the article body is missing (markdown or html).`);
  if (value.excerpt?.length > 300) throw new GhostError(`${lang}: the excerpt is longer than 300 characters.`);
}

async function callTool(name, input, client, ghost) {
  const needPublish = () => {
    if (!client.publish) throw new GhostError("This token may only create and edit drafts. Ask Alex to publish the article in Ghost.");
  };
  switch (name) {
    case "list_posts": return ghost.list(input);
    case "get_post": return ghost.get(input.slug);
    case "create_post":
      checkText("en", input.en, true);
      checkText("it", input.it, true);
      if (input.publish) needPublish();
      return ghost.create(input, input.publish === true);
    case "update_post": {
      checkText("en", input.en);
      checkText("it", input.it);
      // Editing a published article changes the live site, so it needs the same right as publishing.
      if ((await ghost.get(input.slug)).live_on_site) needPublish();
      return ghost.update(input);
    }
    case "publish_post": needPublish(); return ghost.setStatus(input.slug, "published");
    case "unpublish_post": needPublish(); return ghost.setStatus(input.slug, "draft");
    case "upload_image": {
      if (Boolean(input.url) === Boolean(input.data)) throw new GhostError("Pass exactly one of `url` or `data`.");
      const image = input.url ? await fetchImage(input.url) : { bytes: Buffer.from(input.data.replace(/^data:[^,]*,/, ""), "base64") };
      const type = sniff(image.bytes);
      if (!type) throw new GhostError("The file is not a JPEG, PNG, WebP or GIF image.");
      if (image.bytes.length > MAX_IMAGE) throw new GhostError("The image is larger than 10 MB.");
      const base = (input.filename || image.name || "image").replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80).toLowerCase() || "image";
      return ghost.upload(image.bytes, `${base}.${IMAGE_TYPES[type]}`, type);
    }
    default: throw new GhostError(`Unknown tool "${name}".`);
  }
}

async function answer(message, client, ghost) {
  const { id, method, params = {} } = message;
  const result = (value) => ({ jsonrpc: "2.0", id, result: value });
  if (message.jsonrpc !== "2.0" || typeof method !== "string")
    return { jsonrpc: "2.0", id: id ?? null, error: { code: -32600, message: "Invalid request" } };
  if (id === undefined) return null; // notifications need no answer
  switch (method) {
    case "initialize":
      return result({
        protocolVersion: PROTOCOLS.includes(params.protocolVersion) ? params.protocolVersion : PROTOCOLS[0],
        capabilities: { tools: {} },
        serverInfo: { name: "alextione-blog", title: "Alex Tione blog", version: "1.0.0" },
        instructions: INSTRUCTIONS + (client.publish ? " This token may publish." : " This token may only work with drafts; Alex publishes them."),
      });
    case "ping": return result({});
    case "tools/list": return result({ tools: TOOLS });
    case "tools/call": {
      if (!TOOLS.some((tool) => tool.name === params.name))
        return { jsonrpc: "2.0", id, error: { code: -32602, message: `Unknown tool: ${params.name}` } };
      try {
        const output = await callTool(params.name, params.arguments || {}, client, ghost());
        console.info("blog-mcp", client.name, params.name, output?.slug || "");
        return result({ content: [{ type: "text", text: JSON.stringify(output, null, 2) }] });
      } catch (error) {
        if (!(error instanceof GhostError)) console.error("blog-mcp", client.name, params.name, error);
        const reason = error instanceof GhostError ? error.message : "The blog server failed unexpectedly. Try again later.";
        return result({ content: [{ type: "text", text: reason }], isError: true });
      }
    }
    default: return { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } };
  }
}

export async function handleMcp(req, res, options = {}) {
  res.setHeader("Cache-Control", "no-store");
  const reply = (code, data) => {
    res.statusCode = code;
    if (data === undefined) return res.end();
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(405, { jsonrpc: "2.0", id: null, error: { code: -32000, message: "Use POST." } });
  }
  const client = authenticate(req.headers.authorization, options.clients);
  if (!client) {
    res.setHeader("WWW-Authenticate", 'Bearer realm="alextione-blog"');
    return reply(401, { jsonrpc: "2.0", id: null, error: { code: -32001, message: "A valid bearer token is required." } });
  }
  let body = req.body;
  try {
    if (body == null) {
      const parts = [];
      let bytes = 0;
      for await (const part of req) {
        bytes += part.length;
        if (bytes > MAX_BODY) return reply(413, { jsonrpc: "2.0", id: null, error: { code: -32000, message: "Request too large." } });
        parts.push(Buffer.from(part));
      }
      body = Buffer.concat(parts).toString("utf8");
    }
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    return reply(400, { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
  let admin;
  const ghost = () => (admin ??= options.ghost || ghostAdmin({ url: process.env.GHOST_URL, key: process.env.GHOST_ADMIN_KEY }));
  const messages = Array.isArray(body) ? body : [body];
  const answers = [];
  for (const message of messages) {
    const response = await answer(message ?? {}, client, ghost);
    if (response) answers.push(response);
  }
  if (!answers.length) return reply(202);
  reply(200, Array.isArray(body) ? answers : answers[0]);
}

export default function mcp(req, res) {
  return handleMcp(req, res);
}
