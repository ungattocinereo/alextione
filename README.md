# Alessandro Tione

Run `npm ci` and `npm run dev` to edit the site locally. For a production build, use `npm run build` followed by `npm run preview`.

## Content

The six walks, prices, photographs and English and Italian descriptions live in `src/data/tours.json`. English uses the original WordPress paths. Italian adds `/it/`. Old links are listed in `vercel.json`.

## Enquiries

Development and local preview save requests to `.local/requests/`, excluded from Git. The form identifies a local submission in its confirmation.

On Vercel, the `/api/booking` function sends the enquiry through Mailgun EU for `alextione.it`. Set `MAILGUN_API_KEY` to a domain sending key in the Vercel environment and redeploy. Set `BOOKING_TO_EMAIL` to Alex’s inbox and `BOOKING_COPY_EMAIL` for a separate administrator copy. Mailgun addresses each message individually. The sender defaults to `website@alextione.it` and can be overridden with `BOOKING_FROM_EMAIL`. The sender name identifies the visitor and the site. Reply-To uses the visitor’s email when supplied. Technical Info reports the approximate IP country and the browser’s language and time zone. Use the message ID in the function log to verify a delivered event in Mailgun. The form reports success only after the mail provider accepts the request.

Book requests from `/book/` and `/it/book/` use the same inbox. The notification includes the requested timing, number of copies, delivery method and the reader’s email or WhatsApp number for Alex’s reply.

## Guest reviews

Tour pages have a “Leave a review” button, and a tour link ending in `#review` opens the form directly. The `/api/reviews` function stores the review, emails the guest a confirmation link valid for seven days, then emails Alex approve and reject links once the guest confirms. Only approved reviews are shown. They are read at build time (`src/lib/reviews.ts`), so approving or removing one calls a deploy hook to rebuild the site. The reject link in Alex’s email also removes a review that is already published.

Reviews are stored in Upstash Redis. Install the Upstash integration from the Vercel Marketplace on the project so `KV_REST_API_URL` and `KV_REST_API_TOKEN` are available to both the build and the function. Create a deploy hook for the production branch and set it as `REVIEWS_DEPLOY_HOOK_URL`. Moderation emails go to `BOOKING_TO_EMAIL` unless `REVIEWS_TO_EMAIL` is set. Links in emails use `SITE_URL`, defaulting to `https://alextione.it`.

Development and local preview keep reviews in `.local/reviews/` and write the emails to `.local/mail/` instead of sending them. Open the links in those files to walk through confirmation and approval.

## Sharing and search

The public Vercel release uses `https://alextione.it` for canonical URLs, language alternates, social previews, structured data and the sitemap. Override `SITE_URL` at build time if the primary domain changes. English and Italian sharing cards are 1200 × 630 JPEGs in `public/share/`.
