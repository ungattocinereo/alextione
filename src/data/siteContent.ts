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
    image: "https://alextione.it/wp-content/uploads/2025/04/book-2.jpg",
    vintedUrl: "https://www.vinted.it/member/50988651-alextione"
  },
  categories: [
    {
      title: "Print Photography",
      subtitle: "For orders outside of Europe, please contact me directly. Frame is not included.",
      products: [
        { title: "Curva B Napoli", image: "https://alextione.it/wp-content/uploads/2025/05/Curva-B.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Presente, Passato & Futuro", image: "https://alextione.it/wp-content/uploads/2025/05/Passato-Presente-e-Futuro.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "La Banda De Fierro", image: "https://alextione.it/wp-content/uploads/2025/04/La-Banda-de-Fierro.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Scudetto & San Gennaro", image: "https://alextione.it/wp-content/uploads/2025/04/San-Gennaro-e-Scudetto.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Tre", image: "https://alextione.it/wp-content/uploads/2025/04/numero-tre.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Quattro", image: "https://alextione.it/wp-content/uploads/2025/05/4.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Barbonciro", image: "https://alextione.it/wp-content/uploads/2025/05/BarbonCiro.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "La Mano di D10", image: "https://alextione.it/wp-content/uploads/2025/04/E-stata-la-mano-di-D10.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Meccanico", image: "https://alextione.it/wp-content/uploads/2025/04/Meccanico-.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Macelleria", image: "https://alextione.it/wp-content/uploads/2025/04/Macelleria-QS.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Via Anticaglia", image: "https://alextione.it/wp-content/uploads/2025/04/Via-Anticaglia.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Tattoo 10", image: "https://alextione.it/wp-content/uploads/2025/04/Tattoo-10.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Dios Humano", image: "https://alextione.it/wp-content/uploads/2025/04/Dios-Humano.gif", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Para Siempre Diego", image: "https://alextione.it/wp-content/uploads/2025/04/Para-Siempre-Diego.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "La Storia", image: "https://alextione.it/wp-content/uploads/2025/04/La-Storia.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Grazie Diego", image: "https://alextione.it/wp-content/uploads/2025/04/Grazie-Diego.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Garage NA", image: "https://alextione.it/wp-content/uploads/2025/04/Garage.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Fruttivendolo", image: "https://alextione.it/wp-content/uploads/2025/04/Fruttivendolo-QS.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Edicola Sanit\u00E0", image: "https://alextione.it/wp-content/uploads/2025/04/Edicola-Sanita.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Condottiero", image: "https://alextione.it/wp-content/uploads/2025/04/Condottiero.webp", paperNote: "The print will be made on semi-gloss 250g/m\u00B2 paper.", prices: [{ size: "20x30cm", price: "25\u20AC" }, { size: "30x40cm", price: "35\u20AC" }, { size: "50x70cm", price: "45\u20AC" }], vintedUrl: "https://www.vinted.it/member/50988651-alextione" }
      ]
    },
    {
      title: "Poster",
      subtitle: "For orders outside of Europe, please contact me directly. Frame is not included.",
      products: [
        { title: "Religione Monoteistica", image: "https://alextione.it/wp-content/uploads/2025/04/Poster-Religione-Monoteistica.webp", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Boca", image: "https://alextione.it/wp-content/uploads/2025/04/Poster-Boca.webp", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Argentina 1994", image: "https://alextione.it/wp-content/uploads/2025/04/Argentina-1994.webp", vintedUrl: "https://www.vinted.it/member/50988651-alextione" }
      ]
    },
    {
      title: "Pins",
      subtitle: "For orders outside of Europe, please contact me directly.",
      products: [
        { title: "10 Boca", image: "https://alextione.it/wp-content/uploads/2025/04/BOCA-10-scaled.gif", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "La Storia", image: "https://alextione.it/wp-content/uploads/2025/04/La-Storia-scaled.gif", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "10 Buitoni Napoli 86/87", image: "https://alextione.it/wp-content/uploads/2025/04/Napoli-Buitoni-scaled.gif", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "10 Mars Napoli 90/91", image: "https://alextione.it/wp-content/uploads/2025/04/Napoli-Mars-1990-91-scaled.gif", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Argentina Italia 90", image: "https://alextione.it/wp-content/uploads/2025/04/Argentina-Italia-90-scaled.gif", vintedUrl: "https://www.vinted.it/member/50988651-alextione" },
        { title: "Argentina USA 94", image: "https://alextione.it/wp-content/uploads/2025/04/Argentina-USA-94-scaled.gif", vintedUrl: "https://www.vinted.it/member/50988651-alextione" }
      ]
    }
  ]
};

export type Tour = {
  title: string;
  duration: string;
  description: string;
  bookingUrl: string;
  image: string;
};

export type TourDetail = {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  language: string;
  minGroup: string;
  start: string;
  image: string;
  paragraphs: string[];
  bookingUrl: string;
};

export const tourDetails: TourDetail[] = [
  {
    slug: "rione-sanita-tour",
    title: "Rione Sanit\u00e0 Tour",
    subtitle: "The Rione Sanit\u00e0 is a hidden gem of Naples, a historic neighborhood nestled between the city\u2019s hills, rich in history, art, and traditions",
    duration: "2 hours",
    price: "\u20ac39,50",
    language: "Italiano / English",
    minGroup: "2 people",
    start: "Daily in the morning or afternoon",
    image: "/tours/rione-sanita.jpg",
    paragraphs: [
      "Famous for its catacombs and as the birthplace of the legendary Tot\u00f2, this place tells a story of past struggles and a recent revival, blending culture and vibrancy.",
      "With my tour, I will guide you through the lesser-known alleys of Rione Sanit\u00e0, far from the usual tourist routes. You\u2019ll discover hidden corners, admire the vibrant street art that colors the walls, visit historical sites and noble palaces that tell the story of a strong identity, and, with a bit of luck, meet the locals who bring this neighborhood to life.",
      "Don\u2019t miss this special experience in the beating heart of Naples. Book your tour now and join me in exploring the hidden treasures of Rione Sanit\u00e0\u2014an adventure that will truly surprise you!"
    ],
    bookingUrl: "https://alextione.it/tour/rione-sanita-tour/"
  },
  {
    slug: "highlights-tour",
    title: "Highlights Tour",
    subtitle: "Naples is a city that enchants\u2014a tapestry of history, culture, and vibrancy that reveals itself step by step.",
    duration: "2 hours",
    price: "\u20ac39,50",
    language: "Italiano / English",
    minGroup: "2 people",
    start: "Daily in the morning or afternoon",
    image: "/tours/highlights.webp",
    paragraphs: [
      "With my Highlights Tour, I will take you on a journey to explore Naples\u2019 most stunning landmarks. From the ancient heart of Neapolis to the grandeur of Royal Naples, in an experience that captures the city\u2019s authentic soul.",
      "We\u2019ll begin our journey in the historic center, the ancient Neapolis, wandering through its narrow streets and discovering the hidden treasures of this UNESCO World Heritage site. From there, we\u2019ll head to the lively Spanish Quarters, a maze of vibrant alleys filled with colors, street art, and authentic local stories. We\u2019ll also explore the bustling Pignasecca market, where the scents, sounds, and flavors of Naples come together.",
      "Our final stop will take us to Royal Naples, where we\u2019ll admire the grand Galleria Umberto I, the world-renowned Teatro San Carlo, the Royal Palace, and the iconic Piazza del Plebiscito. Book your Highlights Tour now and join me to discover Naples as you\u2019ve never seen it before!"
    ],
    bookingUrl: "https://alextione.it/tour/highlights-tour/"
  },
  {
    slug: "quartieri-spagnoli-tour",
    title: "Quartieri Spagnoli Tour",
    subtitle: "The Spanish Quarters of Naples are a mosaic of life, history, and color\u2014a maze of narrow streets beside the bustling Via Toledo.",
    duration: "2 hours",
    price: "\u20ac39,50",
    language: "Italiano / English",
    minGroup: "2 people",
    start: "Daily in the morning or afternoon",
    image: "/tours/quartieri-spagnoli.webp",
    paragraphs: [
      "It is a neighborhood that pulses with authenticity, where street art, the aromas of traditional cuisine, and a history of struggle and rebirth come together to tell a powerful story.",
      "With my tour, I will take you through the lesser-known alleys, away from the usual tourist routes. Together, we will explore hidden gems, admire breathtaking viewpoints, discover historical sites, and, with a bit of luck, meet the locals who make this neighborhood so special.",
      "Don\u2019t miss the chance to experience a different side of Naples, right in its true heart. Book your tour now and join me in uncovering the secrets of the Spanish Quarters\u2014an unforgettable journey awaits!"
    ],
    bookingUrl: "https://alextione.it/tour/quartieri-spagnoli-tour/"
  },
  {
    slug: "street-food-tour",
    title: "Street Food Tour",
    subtitle: "The food in Naples speaks and tells the stories of the city.",
    duration: "2 hours",
    price: "\u20ac39,50",
    language: "Italiano / English",
    minGroup: "2 people",
    start: "Daily in the morning or afternoon",
    image: "/tours/street-food.webp",
    paragraphs: [
      "Parthenopean culinary tradition is a tasty journey of ancient and modern recipes. We Neapolitans spend a lot of time on the street, for many it is their office, and it is natural for us to eat on the street ready-made food that you can find in the windows of pizzerias or pastry shops.",
      "Frittatine di pasta, pizza a portafoglio, fried pizza, crocch\u00e8, arancini, and scagliuozzi are just a few of the masterpieces of Neapolitan street food \u2014 true explosions of flavor that everyone should try at least once in their life.",
      "And if you\u2019re more into sweets than savory, Naples has you covered. Its rich pastry tradition offers delights like the sfogliatella, the rum-soaked bab\u00e0, a slice of pastiera, the flourless caprese cake, and so much more. Join me on a walk through the heart of Naples to discover the incredible flavors of Neapolitan tradition!"
    ],
    bookingUrl: "https://alextione.it/tour/street-food-tour/"
  },
  {
    slug: "street-art-tour",
    title: "Street Art Tour",
    subtitle: "Street art is deeply embedded in the urban fabric of Naples and its neighborhoods.",
    duration: "2 hours",
    price: "\u20ac39,50",
    language: "Italiano / English",
    minGroup: "2 people",
    start: "Daily in the morning or afternoon",
    image: "/tours/street-art.webp",
    paragraphs: [
      "Taking on many forms\u2014from classic murals to posters, as well as numerous wall writings and stickers. Since the 1980s, Naples has been one of the favorite destinations for street art, with early works by French artists Blek le Rat and Ernest Pignon-Ernest.",
      "A special mention goes to the British artist Banksy, who, back in 2005, chose Naples as the location for his first works in Italy. Over the years, the city has welcomed a continuous flow of artists from around the world, turning both its historic center and its outskirts into an open-air canvas for creative expression.",
      "Join me on a journey through the evolution of street art in Naples, from its early days to the present, as we explore its most iconic works and hidden gems!"
    ],
    bookingUrl: "https://alextione.it/tour/street-art-tour/"
  },
  {
    slug: "maradona-tour",
    title: "Maradona Tour",
    subtitle: "Immerse yourself in a fascinating visual journey to uncover the unbreakable bond between Naples and Maradona.",
    duration: "2 hours",
    price: "\u20ac39,50",
    language: "Italiano / English",
    minGroup: "2 people",
    start: "Daily in the morning or afternoon",
    image: "/tours/maradona.webp",
    paragraphs: [
      "Naples is the capital of Italian football culture, a city that lives and breathes the sport in all its nuances. Between 1984 and 1991, it was home to one of the greatest players of all time: Diego Armando Maradona.",
      "As a testament to the almost sacred status of Diego, tributes and spontaneous gestures of love can be found in shops, workshops, pizzerias, and on the very walls of the city. Neapolitans have dedicated murals, shrines, and hidden altars across the streets of Naples to Maradona.",
      "During this 2-hour tour, we will walk through the Historic Center, Forcella, and Quartieri Spagnoli, exploring the most iconic places of Maradonismo and discovering why, after more than 40 years, Diego\u2019s memory still lives on in the hearts of Neapolitans."
    ],
    bookingUrl: "https://alextione.it/tour/maradona-tour/"
  }
];

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
  image: "https://alextione.it/wp-content/uploads/2025/03/IMG_3061.jpg",
  sections: [
    {
      id: "napoli",
      title: "Napoli 2018 \u2014 In Progress",
      image: "https://alextione.it/wp-content/uploads/2025/03/alextionemaradonna.jpeg",
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
      image: "https://alextione.it/wp-content/uploads/2025/04/28Ottobre2024©alextione_2-scaled.jpg",
      paragraphs: [
        "Since October 2024, the project has continued in Argentina, to document the love for Diego Maradona in his homeland."
      ]
    },
    {
      id: "diego-indelebile",
      title: "Diego Indelebile (In Progress)",
      image: "https://alextione.it/wp-content/uploads/2025/04/Bronx2024-scaled.jpeg",
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
    href: "https://www.vinted.it/member/50988651-alextione"
  }
};

export const siteContent = {
  seo: {
    title: "Alessandro Tione — Tour Guide & Photographer in Naples",
    description:
      "Licensed tour guide and photographer based in Naples. Walking tours through hidden alleys, street art, Maradona tributes, and authentic Neapolitan street food. Book your private tour or explore fine-art photography inspired by the soul of Napoli.",
    image: "/images/hero-alex.webp"
  },
  navigation: [
    { label: "Tours", href: "/tours" },
    { label: "Portfolio", href: "/photo-art" },
    { label: "Maradona Project", href: "/religione-monoteistica" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/#about" }
  ],
  hero: {
    kicker: "Tour guide & Photographer",
    name: "Alessandro Tione",
    title: "Discover Napoli through my eyes",
    subtitle:
      "Licensed tour guide and photographer based in Naples. I show you the city beyond the postcards — hidden corners, vibrant culture, and timeless legends.",
    primaryCta: { label: "Book a Tour", href: "/tours" },
    secondaryCta: { label: "See Portfolio", href: "/photo-art" },
    image: "/images/hero-alex.webp"
  },
  tours: {
    intro:
      "Naples lives in its streets, alleys, and hidden places. Join me on a walk that goes beyond the surface — with stories, culture, and local flavor you won't find in any guidebook.",
    tours: [
      {
        title: "Maradona Tour",
        duration: "2 hours",
        description:
          "Naples lives for Maradona. This 2-hour tour dives into murals and shrines that show why his legend still lives on.",
        bookingUrl: "/tours#maradona-tour",
        image: "https://alextione.it/wp-content/uploads/2025/03/maradona-tour-hero-500x1000.webp"
      },
      {
        title: "Rione Sanita Tour",
        duration: "2.5 hours",
        description:
          "Discover Naples' hidden gem! Join my tour of Rione Sanita — secret alleys, street art, and history in one unforgettable walk.",
        bookingUrl: "/tours#rione-sanita-tour",
        image: "https://alextione.it/wp-content/uploads/2025/03/rione-sa-tour-hero-500x1000.webp"
      },
      {
        title: "Highlights Tour",
        duration: "3 hours",
        description:
          "Experience Naples in one unforgettable walk! My Highlights Tour covers the historic center, Spanish Quarters, and Royal Naples.",
        bookingUrl: "/tours#highlights-tour",
        image: "https://alextione.it/wp-content/uploads/2025/03/highlights-tour-hero-500x1000.webp"
      },
      {
        title: "Quartieri Spagnoli Tour",
        duration: "2 hours",
        description:
          "Explore the heart of Naples! Join my tour of the Spanish Quarters — hidden alleys, street art, and local stories in a vibrant maze.",
        bookingUrl: "/tours#quartieri-spagnoli-tour",
        image: "https://alextione.it/wp-content/uploads/2025/03/spagnoli-tour-hero-500x1000.webp"
      },
      {
        title: "Street Food Tour",
        duration: "2.5 hours",
        description:
          "Taste Naples through its street food — from fried pizza to sfogliatella — on a delicious walk through the city's heart!",
        bookingUrl: "/tours#street-food-tour",
        image: "https://alextione.it/wp-content/uploads/2025/03/street-food-sa-tour-hero-500x1000.webp"
      },
      {
        title: "Street Art Tour",
        duration: "2 hours",
        description:
          "Discover Naples' street art — from Banksy to Jorit — in a vibrant tour through the Spanish Quarters and Historic Center!",
        bookingUrl: "/tours#street-art-tour",
        image: "https://alextione.it/wp-content/uploads/2025/03/street-art-tour-hero-500x1000.webp"
      }
    ] as Tour[],
    cta: {
      label: "View All Tours",
      href: "/tours"
    }
  },
  photography: {
    intro:
      "Naples is not just visited, it's felt. Through my lens I capture proposals, elopements, portraits, maternity, family, and events across Naples and Campania.",
    categories: [
      "Wedding & Elopement",
      "Proposal in Naples",
      "Couples & Portraits",
      "Maternity & Family",
      "Ceremony & Events"
    ],
    ctaPrimary: {
      label: "View Full Portfolio",
      href: "/photo-art"
    },
    ctaSecondary: {
      label: "Book a Photoshoot",
      href: "https://alextione.it/contact/"
    }
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
      href: "https://shop.alextione.it/collections/maradona"
    }
  },
  shop: {
    intro:
      "Bring Naples home. Curated products and fine-art pieces from my projects and photography.",
    items: [
      { label: "T-shirts Designed by Alex", href: "https://shop.alextione.it/" },
      {
        label: "Photographic Fine Art Prints",
        href: "https://shop.alextione.it/collections/stampe-fotografiche-fine-art"
      },
      {
        label: "No Fake Guides Allowed Collection",
        href: "https://shop.alextione.it/collections/no-fake-guides-allowed"
      },
      {
        label: "Postcards",
        href: "https://shop.alextione.it/collections/cartoline"
      },
      {
        label: "Mugs",
        href: "https://shop.alextione.it/collections/tazze"
      }
    ],
    cta: { label: "Open Shop", href: "https://shop.alextione.it/" }
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
    quickLinks: [
      { label: "Maradona Tour", href: "/tours#maradona-tour" },
      { label: "Rione Sanita", href: "/tours#rione-sanita-tour" },
      { label: "Highlights", href: "/tours#highlights-tour" },
      { label: "Quartieri Spagnoli", href: "/tours#quartieri-spagnoli-tour" },
      { label: "Street Food", href: "/tours#street-food-tour" },
      { label: "Street Art", href: "/tours#street-art-tour" }
    ],
    blogLinks: [
      { label: "Travel", href: "https://alextione.it/category/viaggi/" },
      { label: "Food", href: "https://alextione.it/category/food/" },
      { label: "Events", href: "https://alextione.it/category/eventi-e-mostre/" },
      { label: "Coast", href: "https://alextione.it/category/costiera/" },
      { label: "Urban", href: "https://alextione.it/category/urban/" }
    ],
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
