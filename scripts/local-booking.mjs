import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { handleBooking } from "../api/booking.js";

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
}

export const localBooking = {
  name: "local-booking",
  configureServer: previewBooking,
  configurePreviewServer: previewBooking,
};
