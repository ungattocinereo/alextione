import { conditions, locale, tours, tourPath } from "./site";
import { siteContent } from "../data/siteContent";

export const bookLaunch = "2026-12-12T18:00:00+01:00";

export function structuredData(site: URL, path: string, title: string, description: string, image: string) {
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
