import catalog from "../data/tours.json";

export type Language = "en" | "it";
export const { tours, conditions } = catalog;
export type Tour = (typeof tours)[number];
export const tourPath = (tour: Tour) => `/tour/${tour.slug}/`;

export function locale(path: string) {
  const lang: Language = /^\/it(?:\/|$)/.test(path) ? "it" : "en";
  const base = path.replace(/^\/it(?=\/|$)/, "") || "/";
  const url = (path: string) => (lang === "it" ? "/it" : "") + path;
  const t = (en: string, it: string) => (lang === "it" ? it : en);
  const price = new Intl.NumberFormat(lang === "en" ? "en-IE" : "it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(conditions.price);
  const duration = `${conditions.hours} ${t("hours", "ore")}`;
  return { lang, base, url, t, price, duration };
}
