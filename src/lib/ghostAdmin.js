import { createHmac } from "node:crypto";

// Ghost Admin API client for the blog MCP server.
// An article is two Ghost posts: English (internal tag #en, slug "x") and Italian (#it, slug "x-it").

const LANGS = ["en", "it"];
const ghostSlug = (slug, lang) => (lang === "it" ? slug + "-it" : slug);
const b64 = (value) => Buffer.from(value).toString("base64url");

export class GhostError extends Error {}

export function slugify(title) {
  return title.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/, "");
}

export function ghostAdmin({ url, key, fetch: request = fetch }) {
  const [id, secret] = (key || "").split(":");
  if (!url || !id || !secret) throw new GhostError("Ghost is not configured on the server.");

  // Admin API tokens are short-lived JWTs signed with the integration secret.
  function token() {
    const now = Math.floor(Date.now() / 1000);
    const head = b64(JSON.stringify({ alg: "HS256", typ: "JWT", kid: id }));
    const body = b64(JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" }));
    const sign = createHmac("sha256", Buffer.from(secret, "hex")).update(head + "." + body).digest("base64url");
    return `${head}.${body}.${sign}`;
  }

  async function call(method, path, body, query = {}) {
    const api = new URL("/ghost/api/admin/" + path, url);
    api.search = new URLSearchParams(query).toString();
    const form = body instanceof FormData;
    const response = await request(api, {
      method,
      signal: AbortSignal.timeout(25000),
      headers: {
        Authorization: "Ghost " + token(),
        "Accept-Version": "v6.0",
        ...(body && !form ? { "Content-Type": "application/json" } : {}),
      },
      body: form ? body : body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 404) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = data.errors?.[0];
      throw new GhostError(`Ghost refused the request (${response.status}): ${[error?.message, error?.context].filter(Boolean).join(" ") || "unknown error"}`);
    }
    return data;
  }

  const read = async (slug, lang) =>
    (await call("GET", `posts/slug/${ghostSlug(slug, lang)}/`, null, { formats: "html", include: "tags" }))?.posts[0];

  // Markdown goes in as a Ghost markdown card; HTML is converted by Ghost itself.
  function fields(text, lang, shared, existing) {
    const post = {};
    if (text?.title != null) post.title = text.title;
    if (text?.excerpt != null) post.custom_excerpt = text.excerpt || null;
    if (text?.meta_title != null) post.meta_title = text.meta_title || null;
    if (text?.meta_description != null) post.meta_description = text.meta_description || null;
    if (text?.image_alt != null) post.feature_image_alt = text.image_alt || null;
    if (text?.markdown != null)
      post.lexical = JSON.stringify({ root: { type: "root", version: 1, format: "", indent: 0, direction: null,
        children: [{ type: "markdown", version: 1, markdown: text.markdown }] } });
    else if (text?.html != null) post.html = text.html;
    if (shared.feature_image !== undefined) post.feature_image = shared.feature_image || null;
    if (shared.tags || !existing)
      post.tags = [{ name: "#" + lang }, ...(shared.tags ?? existing?.tags?.filter((tag) => tag.visibility === "public").map((tag) => tag.name) ?? []).map((name) => ({ name }))];
    return post;
  }
  const source = (text) => (text?.markdown == null && text?.html != null ? { source: "html" } : {});

  function summary(slug, posts) {
    const [en, it] = posts;
    const live = posts.every((post) => post?.status === "published");
    return {
      slug,
      live_on_site: live,
      note: live ? `Published. It appears at /blog/${slug}/ and /it/blog/${slug}/ after the site rebuilds (a few minutes).`
        : "Not on the site: both the English and the Italian version must be published.",
      en: en && { title: en.title, status: en.status, updated_at: en.updated_at },
      it: it && { title: it.title, status: it.status, updated_at: it.updated_at },
      edit_in_ghost: posts.filter(Boolean).map((post) => new URL(`/ghost/#/editor/post/${post.id}`, url).href),
    };
  }

  return {
    async list({ status = "all", limit = 30 } = {}) {
      const data = await call("GET", "posts/", null, {
        include: "tags", limit: String(Math.min(Math.max(limit, 1), 100) * 2), order: "updated_at desc",
        fields: "id,slug,title,status,updated_at,published_at",
      });
      const pairs = new Map();
      for (const post of data.posts) {
        const lang = LANGS.find((code) => post.tags?.some((tag) => tag.slug === "hash-" + code));
        if (!lang) continue;
        const slug = lang === "it" ? post.slug.replace(/-it$/, "") : post.slug;
        const pair = pairs.get(slug) || [];
        pair[LANGS.indexOf(lang)] = post;
        pairs.set(slug, pair);
      }
      return [...pairs].map(([slug, pair]) => summary(slug, [pair[0], pair[1]]))
        .filter((post) => status === "all" || (status === "published") === post.live_on_site);
    },

    async get(slug) {
      const posts = await Promise.all(LANGS.map((lang) => read(slug, lang)));
      if (!posts.some(Boolean)) throw new GhostError(`No article with slug "${slug}".`);
      const text = (post) => post && { title: post.title, excerpt: post.custom_excerpt, html: post.html,
        meta_title: post.meta_title, meta_description: post.meta_description, image_alt: post.feature_image_alt };
      const any = posts.find(Boolean);
      return { ...summary(slug, posts), feature_image: any.feature_image,
        tags: any.tags.filter((tag) => tag.visibility === "public").map((tag) => tag.name),
        en: { ...summary(slug, posts).en, ...text(posts[0]) }, it: { ...summary(slug, posts).it, ...text(posts[1]) } };
    },

    async create({ slug, en, it, tags, feature_image }, publish) {
      slug = slugify(slug || en.title);
      if (!slug) throw new GhostError("Could not derive a slug from the English title; pass `slug`.");
      if ((await Promise.all(LANGS.map((lang) => read(slug, lang)))).some(Boolean))
        throw new GhostError(`An article with slug "${slug}" already exists. Use update_post or choose another slug.`);
      const posts = [];
      for (const [lang, text] of [["en", en], ["it", it]]) {
        const data = await call("POST", "posts/", { posts: [{
          ...fields(text, lang, { tags: tags || [], feature_image }), slug: ghostSlug(slug, lang), status: publish ? "published" : "draft",
        }] }, source(text));
        posts.push(data.posts[0]);
      }
      return summary(slug, posts);
    },

    async update({ slug, en, it, tags, feature_image }) {
      const posts = [];
      for (const [lang, text] of [["en", en], ["it", it]]) {
        const existing = await read(slug, lang);
        if (!existing) throw new GhostError(`The ${lang === "en" ? "English" : "Italian"} version of "${slug}" does not exist.`);
        const changes = fields(text, lang, { tags, feature_image }, existing);
        posts.push(Object.keys(changes).length
          ? (await call("PUT", `posts/${existing.id}/`, { posts: [{ ...changes, updated_at: existing.updated_at }] }, source(text))).posts[0]
          : existing);
      }
      return summary(slug, posts);
    },

    async setStatus(slug, status) {
      const existing = await Promise.all(LANGS.map((lang) => read(slug, lang)));
      if (existing.some((post) => !post)) throw new GhostError(`"${slug}" needs both an English and an Italian version before its status can change.`);
      const posts = [];
      for (const post of existing)
        posts.push(post.status === status ? post
          : (await call("PUT", `posts/${post.id}/`, { posts: [{ status, updated_at: post.updated_at }] })).posts[0]);
      return summary(slug, posts);
    },

    async upload(bytes, filename, type) {
      const form = new FormData();
      form.set("file", new Blob([bytes], { type }), filename);
      form.set("purpose", "image");
      const data = await call("POST", "images/upload/", form);
      return { url: data.images[0].url };
    },
  };
}
