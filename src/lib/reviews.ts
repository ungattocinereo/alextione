import { configuredStore, fileStore, localReviews } from "./reviewStore.js";

export interface GuestReview {
  name: string;
  tour: string;
  rating: number | null;
  text: string;
  language: "en" | "it";
  date: string;
}

let build: Promise<GuestReview[]> | undefined;

async function load(): Promise<GuestReview[]> {
  // On Vercel the build reads Upstash; a failed read fails the build rather than publishing pages without reviews.
  const store = configuredStore() ?? fileStore(localReviews);
  const reviews: Record<string, any>[] = await store.approved();
  return reviews
    .map(({ name, tour, rating, text, language, confirmedAt }) => ({
      name, tour, rating: rating ?? null, text, language, date: String(confirmedAt).slice(0, 10),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Reviews approved by Alex. The dev server reads them on every request so a fresh approval shows at once.
export function approvedReviews() {
  if (import.meta.env.DEV) return load();
  return (build ??= load());
}
