# Alessandro Tione

Run `npm ci` and `npm run dev` to edit the site locally. For a production build, use `npm run build` followed by `npm run preview`.

## Content

The six walks, prices, photographs and English and Italian descriptions live in `src/data/tours.json`. English uses the original WordPress paths. Italian adds `/it/`. Old links are listed in `vercel.json`.

## Enquiries

Development and local preview save requests to `.local/requests/`, excluded from Git. The form identifies a local submission in its confirmation.

On Vercel, the `/api/booking` function sends the enquiry through Resend. Set `RESEND_API_KEY`, `BOOKING_FROM_EMAIL` (a verified sender) and `BOOKING_TO_EMAIL` (Alex’s inbox) in the project environment. Replying to the notification addresses the visitor directly. The form reports success only after the mail provider accepts the request.

Book requests from `/book/` and `/it/book/` use the same inbox. The notification includes the requested timing, number of copies, delivery method and the reader’s email or WhatsApp number for Alex’s reply.

## Sharing and search

The public Vercel release uses `https://alextione.vercel.app` for canonical URLs, language alternates, social previews, structured data and the sitemap. Set `SITE_URL` to the final domain and rebuild when that domain starts serving this site. English and Italian sharing cards are 1200 × 630 JPEGs in `public/share/`.
