import { defineConfig } from "astro/config";
import { localBooking } from "./scripts/local-booking.mjs";
import { localMcp } from "./scripts/local-mcp.mjs";
import vercel from "./vercel.json" with { type: "json" };

export default defineConfig({
  site: process.env.SITE_URL || "https://alextione.it",
  trailingSlash: "ignore",
  redirects: Object.fromEntries(
    vercel.redirects.map(({ source, destination }) => [source, destination]),
  ),
  devToolbar: { enabled: false },
  vite: {
    server: {
      fs: {
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/.local/**"],
      },
    },
    plugins: [localBooking, localMcp],
  },
});
