import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { handleBooking } from "../api/booking.js";
import { handleReviews } from "../api/reviews.js";
import { fileStore, localReviews } from "../src/lib/reviewStore.js";

function previewBooking(server) {
  server.middlewares.use("/api/booking", (req, res) =>
    handleBooking(req, res, async (data) => {
      await mkdir(".local/requests", { recursive: true, mode: 0o700 });
      await writeFile(
        `.local/requests/${randomUUID()}.json`,
        JSON.stringify(data, null, 2),
        { mode: 0o600 },
      );
    }),
  );
  // Reviews are kept in .local/reviews/ and their emails are written to .local/mail/ instead of being sent.
  server.middlewares.use("/api/reviews", (req, res) =>
    handleReviews(req, res, {
      store: fileStore(localReviews),
      origin: "http://" + req.headers.host,
      owner: "owner@example.test",
      async send(mail) {
        await mkdir(".local/mail", { recursive: true, mode: 0o700 });
        await writeFile(
          `.local/mail/${Date.now()}-${randomUUID().slice(0, 8)}.json`,
          JSON.stringify(mail, null, 2),
          { mode: 0o600 },
        );
      },
    }),
  );
}

export const localBooking = {
  name: "local-booking",
  configureServer: previewBooking,
  configurePreviewServer: previewBooking,
};
