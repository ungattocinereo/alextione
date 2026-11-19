import type { Language } from "./site";

// Blog posts live in a headless Ghost. Every article is a pair of Ghost posts:
// the English one (internal tag #en, slug "x") and the Italian one (internal tag #it, slug "x-it").
// The site mirrors every page in both languages, so an article appears only when both are published.

export interface PostText {
  title: string;
  excerpt: string;
  html: string;
  metaTitle?: string;
  metaDescription?: string;
  imageAlt?: string;
}
export interface Post {
  slug: string;
  path: string;
  published: string;
  updated: string;
  image?: string;
  minutes: number;
  tags: string[];
  en: PostText;
  it: PostText;
}

interface GhostTag { name: string; slug: string; visibility: string }
interface GhostPost {
  slug: string; title: string; html: string | null; excerpt: string | null; custom_excerpt: string | null;
  feature_image: string | null; feature_image_alt: string | null; published_at: string; updated_at: string;
  reading_time: number; meta_title: string | null; meta_description: string | null; tags?: GhostTag[];
}

// .env files reach the build through import.meta.env, Vercel settings through the process environment.
const system: Record<string, string | undefined> = (globalThis as any).process?.env ?? {};
const env = (name: string) => import.meta.env[name] || system[name] || "";

const text = (post: GhostPost): PostText => ({
  title: post.title,
  excerpt: (post.custom_excerpt || post.excerpt || "").trim(),
  html: post.html || "",
  metaTitle: post.meta_title || undefined,
  metaDescription: post.meta_description || undefined,
  imageAlt: post.feature_image_alt || undefined,
});

export function pairPosts(posts: GhostPost[]): Post[] {
  const language = (post: GhostPost): Language | undefined =>
    post.tags?.some((tag) => tag.slug === "hash-it") ? "it"
      : post.tags?.some((tag) => tag.slug === "hash-en") ? "en" : undefined;
  const pairs = new Map<string, Partial<Record<Language, GhostPost>>>();
  for (const post of posts) {
    const lang = language(post);
    if (!lang) continue;
    const slug = lang === "it" ? post.slug.replace(/-it$/, "") : post.slug;
    pairs.set(slug, { ...pairs.get(slug), [lang]: post });
  }
  return [...pairs]
    .flatMap(([slug, { en, it }]) => en && it ? [{
      slug,
      path: `/blog/${slug}/`,
      published: en.published_at,
      updated: en.updated_at > it.updated_at ? en.updated_at : it.updated_at,
      image: en.feature_image || it.feature_image || undefined,
      minutes: Math.max(1, en.reading_time || 1),
      tags: (en.tags || []).filter((tag) => tag.visibility === "public").map((tag) => tag.name),
      en: text(en),
      it: text(it),
    }] : [])
    .sort((a, b) => b.published.localeCompare(a.published));
}

let cache: Promise<Post[]> | undefined;

/** Published articles, newest first. Without Ghost settings the blog is simply empty. */
export function getPosts(): Promise<Post[]> {
  return (cache ??= load());
}

async function load(): Promise<Post[]> {
  const url = env("GHOST_URL");
  const key = env("GHOST_CONTENT_KEY");
  if (!url || !key) return [];
  const posts: GhostPost[] = [];
  for (let page = 1; page; ) {
    const api = new URL("/ghost/api/content/posts/", url);
    api.search = new URLSearchParams({ key, include: "tags", formats: "html", limit: "100", page: String(page) }).toString();
    const response = await fetch(api, { headers: { "Accept-Version": "v6.0" }, signal: AbortSignal.timeout(20000) });
    // A failed fetch must fail the build: publishing a site with the blog silently missing would unpublish every article.
    if (!response.ok) throw new Error(`Ghost Content API answered ${response.status}`);
    const data = await response.json();
    posts.push(...data.posts);
    page = data.meta?.pagination?.next || 0;
  }
  return pairPosts(posts);
}

export const postDate = (iso: string, lang: Language) =>
  new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome" }).format(new Date(iso));
