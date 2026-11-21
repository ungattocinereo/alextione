import { conditions, locale, tours, tourPath } from "./site";
import { siteContent } from "../data/siteContent";
import type { GuestReview } from "./reviews";

export const bookLaunch = "2026-12-12T18:00:00+01:00";

export function structuredData(site: URL, path: string, title: string, description: string, image: string, reviews: GuestReview[] = []) {
  const { base, lang, t, url } = locale(path);
  const absolute = (p: string) => new URL(p, site).href;
  const page = absolute(path);
  const author = { "@id": absolute("/about/#alessandro-tione") };
  const website = { "@id": absolute("/#website") };
  const graph: Record<string, unknown>[] = [
    { ...author, "@type": "Person", name: "Alessandro Tione", alternateName: "Alex Tione",
      url: absolute(url("/about/")), image: absolute("/images/hero-alex.webp"),
      jobTitle: [t("Tour guide", "Guida turistica"), t("Photographer", "Fotografo")],
      homeLocation: { "@type": "Place", name: "Napoli, Italia" },
      sameAs: siteContent.footer.socialLinks.map(link => link.href) },
    { ...website, "@type": "WebSite", url: site.href, name: "Alex Tione", publisher: author, inLanguage: ["it", "en"] },
  ];
  const tour = tours.find(item => tourPath(item) === base);
  let primary: Record<string, unknown> | undefined;
  if (tour) {
    primary = { "@id": page + "#walk", "@type": "Service", name: tour[lang].title,
      serviceType: t("Guided walking tour", "Visita guidata a piedi"), description: tour[lang].intro,
      provider: author, areaServed: { "@type": "City", name: "Napoli" },
      offers: { "@type": "Offer", price: conditions.price, priceCurrency: "EUR", url: page } };
    // Only reviews that guests submitted for this walk and Alex approved are marked up.
    const own = reviews.filter(review => review.tour === tour.slug);
    const rated = own.filter(review => review.rating);
    if (own.length) primary.review = own.map(review => ({ "@type": "Review",
      author: { "@type": "Person", name: review.name }, datePublished: review.date,
      reviewBody: review.text,
      reviewRating: review.rating ? { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 } : undefined }));
    if (rated.length) primary.aggregateRating = { "@type": "AggregateRating", bestRating: 5, worstRating: 1, ratingCount: rated.length,
      ratingValue: Math.round(rated.reduce((sum, review) => sum + review.rating!, 0) / rated.length * 10) / 10 };
  } else if (base === "/book/") {
    primary = { "@id": absolute("/book/#photobook"), "@type": "Book", name: "Religione Monoteistica",
      author, numberOfPages: 216, image: absolute("/book/cover.webp"), url: page };
    graph.push({ "@type": "PublicationEvent", "@id": absolute("/book/#presentation"), name: t("Book launch — Religione Monoteistica", "Presentazione di Religione Monoteistica"),
      startDate: bookLaunch, location: { "@type": "Place", name: "Magazzini Fotografici",
        address: { "@type": "PostalAddress", addressLocality: "Napoli", addressCountry: "IT" } },
      performer: author, workFeatured: { "@id": primary["@id"] }, url: page + "#presentation" });
  } else if (base === "/tours/") {
    primary = { "@type": "ItemList", "@id": page + "#walks", itemListElement: tours.map((item, i) => ({
      "@type": "ListItem", position: i + 1, name: item[lang].title, url: absolute(url(tourPath(item))),
    })) };
  }
  if (primary) graph.push(primary);
  const pageTypes: Record<string,string> = { "/about/": "AboutPage", "/tours/": "CollectionPage", "/photo-art/": "CollectionPage", "/shop/": "CollectionPage" };
  graph.push({ "@type": pageTypes[base] || "WebPage", "@id": page + "#page", url: page,
    name: title, description, inLanguage: lang, isPartOf: website, publisher: author, image,
    mainEntity: primary ? { "@id": primary["@id"] } : base === "/about/" ? author : undefined });
  return { "@context": "https://schema.org", "@graph": graph };
}
