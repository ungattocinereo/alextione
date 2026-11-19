# Alessandro Tione

Run `npm ci` and `npm run dev` to edit the site locally. For a production build, use `npm run build` followed by `npm run preview`.

## Content

The six walks, prices, photographs and English and Italian descriptions live in `src/data/tours.json`. English uses the original WordPress paths. Italian adds `/it/`. Old links are listed in `vercel.json`.

## Enquiries

Development and local preview save requests to `.local/requests/`, excluded from Git. The form identifies a local submission in its confirmation.

On Vercel, the `/api/booking` function sends the enquiry through Mailgun EU for `alextione.it`. Set `MAILGUN_API_KEY` to a domain sending key in the Vercel environment and redeploy. Set `BOOKING_TO_EMAIL` to Alex’s inbox and `BOOKING_COPY_EMAIL` for a separate administrator copy. Mailgun addresses each message individually. The sender defaults to `website@alextione.it` and can be overridden with `BOOKING_FROM_EMAIL`. The sender name identifies the visitor and the site. Reply-To uses the visitor’s email when supplied. Technical Info reports the approximate IP country and the browser’s language and time zone. Use the message ID in the function log to verify a delivered event in Mailgun. The form reports success only after the mail provider accepts the request.

Book requests from `/book/` and `/it/book/` use the same inbox. The notification includes the requested timing, number of copies, delivery method and the reader’s email or WhatsApp number for Alex’s reply.

## Sharing and search

The public Vercel release uses `https://alextione.it` for canonical URLs, language alternates, social previews, structured data and the sitemap. Override `SITE_URL` at build time if the primary domain changes. English and Italian sharing cards are 1200 × 630 JPEGs in `public/share/`.

## Blog

Articles live in a headless Ghost at `https://ghost.alextione.it` and are rendered by this site at `/blog/` and `/it/blog/` during the build. Set `GHOST_URL` and `GHOST_CONTENT_KEY` (the Content API key of the Ghost custom integration) for the build; without them the blog is empty and stays out of the menu.

Every article is a pair of Ghost posts: the English one carries the internal tag `#en` and the slug `my-article`, the Italian one carries `#it` and the slug `my-article-it`. An article appears on the site only when both are published, because every page here exists in both languages. A Ghost webhook calls a Vercel deploy hook, so the site rebuilds a few minutes after an article is published, edited or unpublished.

### Writing with language models

`/api/mcp/` is an MCP server (Streamable HTTP) for models that write the blog. It needs `GHOST_URL`, `GHOST_ADMIN_KEY` (the Admin API key of the same integration) and `BLOG_MCP_TOKENS` in the Vercel environment. Models never receive the Ghost key. Each one gets its own bearer token:

```bash
node scripts/blog-token.mjs claude            # drafts only
node scripts/blog-token.mjs editor --publish  # may also publish and edit live articles
```

The script prints the token once and the entry to merge into the `BLOG_MCP_TOKENS` JSON object, which stores only SHA-256 hashes. Remove an entry and redeploy to revoke a token. The tools are `list_posts`, `get_post`, `create_post`, `update_post`, `publish_post`, `unpublish_post` and `upload_image`; nothing can be deleted through the server. Connect a client with the URL `https://alextione.it/api/mcp/` and the header `Authorization: Bearer <token>`.
