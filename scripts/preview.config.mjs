import { defineConfig } from "vite";
import { localBooking } from "./local-booking.mjs";

export default defineConfig({ appType: "mpa", plugins: [localBooking] });
