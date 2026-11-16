export const VINTED = "https://www.vinted.it/member/50988651-alextione";

export type ShopProduct = {
  title: string;
  image: string;
  prices?: { size: string; price: string }[];
  paperNote?: string;
  vintedUrl: string;
};

export type ShopCategory = {
  title: string;
  subtitle: string;
  products: ShopProduct[];
};

export type ShopPageData = {
  fanzine: {
    title: string;
    description: string;
    image: string;
    vintedUrl: string;
  };
  categories: ShopCategory[];
};

export const shopPageData: ShopPageData = {
  fanzine: {
    title: "Fanzine Religione Monoteistica",
    description: "\u201CMonotheistic Religion\u201D definitely is a provocative title, since Naples isn\u2019t a monotheistic city at all, but quite the opposite. Although, when it comes to football, in the hearts of Neapolitans there\u2019s only one god: Diego Armando Maradona.",
    image: "/images/archive/book-2.webp",
    vintedUrl: VINTED
  },
  categories: [
    {
      title: "Print Photography",
      subtitle: "For orders outside of Europe, please contact me directly. Frame is not included.",
      products: [
        { title: "Curva B Napoli", image: "/images/archive/curva-b.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Presente, Passato & Futuro", image: "/images/archive/passato-presente-e-futuro.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "La Banda De Fierro", image: "/images/archive/la-banda-de-fierro.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Scudetto & San Gennaro", image: "/images/archive/san-gennaro-e-scudetto.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Tre", image: "/images/archive/numero-tre.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Quattro", image: "/images/archive/4.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Barbonciro", image: "/images/archive/barbonciro.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "La Mano di D10", image: "/images/archive/e-stata-la-mano-di-d10.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Meccanico", image: "/images/archive/meccanico.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Macelleria", image: "/images/archive/macelleria-qs.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Via Anticaglia", image: "/images/archive/via-anticaglia.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Tattoo 10", image: "/images/archive/tattoo-10.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Dios Humano", image: "/images/archive/dios-humano.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Para Siempre Diego", image: "/images/archive/para-siempre-diego.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "La Storia", image: "/images/archive/la-storia.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Grazie Diego", image: "/images/archive/grazie-diego.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Garage NA", image: "/images/archive/garage.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Fruttivendolo", image: "/images/archive/fruttivendolo-qs.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Edicola Sanit\u00E0", image: "/images/archive/edicola-sanita.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED },
        { title: "Condottiero", image: "/images/archive/condottiero.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: VINTED }
      ]
    },
    {
      title: "Poster",
      subtitle: "For orders outside of Europe, please contact me directly. Frame is not included.",
      products: [
        { title: "Religione Monoteistica", image: "/images/archive/poster-religione-monoteistica.webp", vintedUrl: VINTED },
        { title: "Boca", image: "/images/archive/poster-boca.webp", vintedUrl: VINTED },
        { title: "Argentina 1994", image: "/images/archive/argentina-1994.webp", vintedUrl: VINTED }
      ]
    },
    {
      title: "Pins",
      subtitle: "For orders outside of Europe, please contact me directly.",
      products: [
        { title: "10 Boca", image: "/images/archive/boca-10-scaled.webp", vintedUrl: VINTED },
        { title: "La Storia", image: "/images/archive/la-storia-scaled.webp", vintedUrl: VINTED },
        { title: "10 Buitoni Napoli 86/87", image: "/images/archive/napoli-buitoni-scaled.webp", vintedUrl: VINTED },
        { title: "10 Mars Napoli 90/91", image: "/images/archive/napoli-mars-1990-91-scaled.webp", vintedUrl: VINTED },
        { title: "Argentina Italia 90", image: "/images/archive/argentina-italia-90-scaled.webp", vintedUrl: VINTED },
        { title: "Argentina USA 94", image: "/images/archive/argentina-usa-94-scaled.webp", vintedUrl: VINTED }
      ]
    }
  ]
};

export type ReligioneSection = {
  id: string;
  title: string;
  image: string;
  paragraphs: string[];
};

export const religionePage = {
  seo: {
    title: "Religione Monoteistica — Maradona Project by Alex Tione",
    description: "A photographic project documenting the spontaneous gestures of love, tributes and urban art dedicated to Diego Armando Maradona. The never-ending romance between Naples and Maradona."
  },
  hero: {
    kicker: "Photographic Project",
    title: "Religione",
    titleAccent: "Monoteistica",
    intro: "Religione Monoteistica is a photographic project that was born in 2018 with the intention of documenting all the spontaneous gestures of love, tributes and urban art dedicated to the Pibe de Oro. As a testament of the never-ending romance between Naples and Maradona.",
    body: "After more than 30 years, newspapers and vintage photographs of Maradona can be found in local shops, garages, pizzerias and on the city\u2019s walls. I considered it essential to immortalise these memories as part of Naples\u2019 football history and culture.",
    insight: "Religione Monoteistica is at the same time also a sociological and anthropological insight into the city of Naples. People\u2019s eyes shine when they recall their memories of the Argentinian number 10. Who gave the city something more important than any trophy: the conviction that Naples can win, against anyone.",
    provocative: "The title of this project is definitely provocative as Naples isn\u2019t a monotheistic city at all. In fact it\u2019s quite the opposite, but football-wise in the hearts of Neapolitans there is only one D10S: Diego Armando Maradona."
  },
  image: "/images/archive/img-3061.webp",
  sections: [
    {
      id: "napoli",
      title: "Napoli 2018 \u2014 In Progress",
      image: "/images/archive/alextionemaradonna.webp",
      paragraphs: [
        "On December 12, 2018, I made a promise to myself: to tell one of the most beautiful love stories that the game of football has ever given to the world, Diego Maradona and Naples.",
        "I wasn\u2019t lucky enough to see El Pibe de Oro run on the pitch, but I did have the chance to witness and feel what Diego left in the hearts of the people.",
        "The most beautiful part of this photographic project was interacting with those who lived through those glorious football years, listening to their memories, and catching the emotions that shone through their eyes.",
        "Testifying to the unbreakable bond between Naples and Diego are the tributes and spontaneous gestures of love, which even today \u2014 more than 30 years later \u2014 can be found in shops, garages, pizzerias, and on the walls of the city.",
        "I felt it was essential to capture all of this, as it is an integral part of both the city\u2019s history and its football culture \u2014 and more.",
        "In recent years, Religione Monoteistica has been, and still is, the driving force of my days \u2014 an incredible journey, full of life, rich with stories and people who have enriched me.",
        "A journey into the heart of Parthenope, who, like a good mother, guided me all along the way, leading me to the creation of my first independent publication.",
        "On April 7, 2023, I released the fanzine Religione Monoteistica, a photo book collecting the spontaneous tributes that Neapolitans have dedicated to Maradona."
      ]
    },
    {
      id: "argentina",
      title: "Argentina 2024",
      image: "/images/archive/28ottobre2024alextione-2-scaled.webp",
      paragraphs: [
        "Since October 2024, the project has continued in Argentina, to document the love for Diego Maradona in his homeland."
      ]
    },
    {
      id: "diego-indelebile",
      title: "Diego Indelebile (In Progress)",
      image: "/images/archive/bronx2024-scaled.webp",
      paragraphs: [
        "\u201CDiego Indelebile\u201D is a photographic spin-off project of the broader Religione Monoteistica, which celebrates the immortality of Diego Armando Maradona through tattoos dedicated to him.",
        "Since 2018, Monotheistic Religion has documented the spontaneous love and every form of tribute to Maradona. Among these, tattoos dedicated to El Pibe represent one of the purest expressions of this unbreakable bond between the people and the Argentine legend.",
        "Maradona was not only an extraordinary footballer, but also a cultural icon, a symbol of hope, and an example of resilience. The tattoos in his honor reflect all of this\u2014and much more.",
        "The idea behind Diego Indelebile is to capture not only the images of the tattoos, but also the stories, emotions, and personal experiences of those who chose to pay tribute to the great champion in an indelible way.",
        "In the context of Diego Indelebile, every tattoo dedicated to Maradona becomes a symbol of belonging, devotion, and remembrance.",
        "They are not just expressions of admiration for his sporting achievements, but also acts of gratitude for what he represented: a people\u2019s hero, a symbol of social redemption, and an icon of cultural identity.",
        "Diego Indelebile captures this cultural dimension, showing how Maradona continues to live on in the hearts\u2014and on the skin\u2014of his fans."
      ]
    }
  ] as ReligioneSection[],
  ctaFanzine: {
    label: "Buy the Fanzine",
    href: VINTED
  }
};

export const siteContent = {
  seo: {
    title: "Alessandro Tione — Tour Guide & Photographer in Naples",
    description:
      "Licensed tour guide and photographer based in Naples. Walking tours through hidden alleys, street art, Maradona tributes, and authentic Neapolitan street food. Book your private tour or explore fine-art photography inspired by the soul of Napoli.",
    image: "/images/hero-alex.webp"
  },
  hero: {
    name: "Alessandro Tione",
    primaryCta: { label: "Book a Tour", href: "/tours/" },
    secondaryCta: { label: "See Portfolio", href: "/photo-art/" },
    image: "/images/hero-alex.webp"
  },
  maradonaProject: {
    title: "Religione Monoteistica",
    intro:
      "Born on December 12, 2018, this project captures the lasting devotion of Neapolitans to their football icon. Though I never saw Maradona play, I witnessed his legacy through the emotions and stories of those who lived his golden years.",
    body: "His image still adorns shops, workshops, pizzerias, and murals across the city — a testament to his enduring presence. On April 7, 2023, I released Religione Monoteistica, a photographic fanzine showcasing these spontaneous tributes.",
    argentina:
      "In 2024, the project took me to Argentina, where I collected new stories from those who knew Diego, further deepening this journey.",
    ctaPrimary: {
      label: "Explore the Project",
      href: "/religione-monoteistica"
    },
    ctaSecondary: {
      label: "Buy the Fanzine",
      href: VINTED
    }
  },
  shop: {
    intro:
      "Bring Naples home. Curated products and fine-art pieces from my projects and photography.",

  },
  aboutMe: {
    title: "I'm Alex, Licensed Tour Guide and Photographer based in Naples",
    paragraphs: [
      "Born in Naples and shaped by years abroad, I returned with a wider perspective and a deep urge to tell this city's story in a fresh way.",
      "As a local guide and photographer, I combine history, urban culture, and human connection to create experiences that feel personal and real.",
      "My mission is to show Naples with honesty: beauty, complexity, and soul, without stereotypes."
    ],
    highlights: [
      "Working languages: Italian, English, Spanish",
      "Licensed tour guide in Campania",
      "Tours and photoshoots available year-round"
    ],
    guideCard: {
      label: "View Official Guide Card",
      href: "https://www.regione.campania.it/regione/it/cittadini/turismo/professioni-turistiche/guida-turistica?lastName=tione&firstName=alessandro"
    }
  },
  footer: {
    tagline: "Naples is calling. Will you answer?",
    email: "alessandrotione@escapevision.it",
    phone: "+39 380 1476310",
    projectLinks: [
      { label: "Photo Portfolio", href: "/photo-art" },
      { label: "Maradona Project", href: "/religione-monoteistica" },
      { label: "Merch Shop", href: "/shop" }
    ],
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/alextione/" },
      { label: "LinkedIn", href: "http://linkedin.com/in/alessandro-tione-935838147" },
      { label: "X / Twitter", href: "https://x.com/tionealessandro" }
    ]
  }
} as const;
