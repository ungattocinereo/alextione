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
