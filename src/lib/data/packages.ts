// Sample content — no live inventory feed wired up yet. Realistic
// placeholders (real routes/destinations Nigerians actually fly, round
// prices) standing in until real package data is provided; swap in place.
// `slug` is stable so /packages and /packages/[slug] link into this list
// without a data-shape change later.

export type PackageCategory =
  | "Domestic"
  | "International"
  | "Beach"
  | "City Break"
  | "Family"
  | "Business";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type Package = {
  slug: string;
  destination: string;
  country: string;
  name: string;
  categories: PackageCategory[];
  priceFrom: number;
  duration: string;
  availability: string;
  summary: string;
  headline: string;
  description: string[];
  included: string[];
  excluded: string[];
  itinerary?: ItineraryDay[];
};

export const packages: Package[] = [
  {
    slug: "dubai-getaway",
    destination: "Dubai",
    country: "United Arab Emirates",
    name: "Dubai Getaway",
    categories: ["International", "City Break"],
    priceFrom: 1450000,
    duration: "5 nights / 6 days",
    availability: "Contact us for available dates",
    summary: "Flights, hotel, and a desert safari day trip.",
    headline: "Skyline views, desert adventure, and five-star comfort — Dubai, done right.",
    description: [
      "Dubai pairs futuristic skylines with old-world souks, making it one of the most popular short-haul destinations for Nigerian travellers. Direct and one-stop connections from Lagos make it an easy add to any calendar, whether you're marking an anniversary, a milestone birthday, or simply need a proper reset.",
      "This package covers your flights, a five-night stay in a well-located hotel, daily breakfast, and a half-day desert safari with dune bashing and a traditional dinner under the stars. From there, the city is yours — the Burj Khalifa, the Dubai Mall, Jumeirah Beach, and the gold and spice souks are all a short ride away.",
      "We handle the logistics — flight timing, hotel check-in, and the safari booking — so the only decision you need to make once you land is where to eat first.",
    ],
    included: [
      "Return flights (Lagos–Dubai)",
      "5 nights hotel accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Half-day desert safari with dinner",
    ],
    excluded: ["Travel insurance", "UAE visa fees", "Personal expenses and optional excursions"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Land in Dubai, transfer to your hotel, and settle in. Evening free to explore the neighbourhood." },
      { day: 2, title: "City Highlights", description: "Burj Khalifa observation deck, Dubai Mall, and the Dubai Fountain show in the evening." },
      { day: 3, title: "Desert Safari", description: "Afternoon pickup for dune bashing, camel riding, and a traditional BBQ dinner under the stars." },
      { day: 4, title: "Free Day", description: "Beach time at Jumeirah, or an optional add-on trip to the Museum of the Future or Global Village." },
      { day: 5, title: "Old Dubai", description: "Explore the gold and spice souks, cross the creek by abra, and pick up souvenirs." },
      { day: 6, title: "Departure", description: "Check out and transfer to the airport for your return flight." },
    ],
  },
  {
    slug: "london-city-break",
    destination: "London",
    country: "United Kingdom",
    name: "London City Break",
    categories: ["International", "City Break"],
    priceFrom: 2100000,
    duration: "6 nights / 7 days",
    availability: "Contact us for available dates",
    summary: "Central London stay with return flights included.",
    headline: "Museums, markets, and proper tea — a week in the city that never quite sits still.",
    description: [
      "London remains one of the most requested destinations for Nigerians travelling for leisure, family visits, or a bit of both. This package is built around a central location, so you're never more than a short tube ride from the sights that matter.",
      "Your stay includes flights and six nights in a centrally located hotel, with breakfast included each morning. The itinerary leaves plenty of open time — this is a city best explored at your own pace, whether that means Camden Market on a Sunday or an afternoon at the Tate Modern.",
      "Because visa timelines for the UK can be unpredictable, we recommend starting your application as early as possible after booking — our team will walk you through the requirements as part of this package.",
    ],
    included: [
      "Return flights (Lagos–London)",
      "6 nights hotel accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Hop-on hop-off city bus pass",
    ],
    excluded: ["Travel insurance", "UK visa fees", "Personal expenses and optional excursions"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Land, transfer to your hotel, and take an evening walk around the neighbourhood." },
      { day: 2, title: "Central London", description: "Westminster, Big Ben, the London Eye, and Buckingham Palace." },
      { day: 3, title: "Museums & Markets", description: "The British Museum or Tate Modern, then Borough Market or Camden." },
      { day: 4, title: "Free Day", description: "Shopping on Oxford Street, or a day trip to Windsor (optional add-on)." },
      { day: 5, title: "Royal London", description: "The Tower of London, Tower Bridge, and a Thames river cruise." },
      { day: 6, title: "Free Day", description: "Your call — Greenwich, Notting Hill, or one more museum." },
      { day: 7, title: "Departure", description: "Check out and transfer to the airport for your return flight." },
    ],
  },
  {
    slug: "accra-weekender",
    destination: "Accra",
    country: "Ghana",
    name: "Accra Weekender",
    categories: ["International", "City Break"],
    priceFrom: 520000,
    duration: "3 nights / 4 days",
    availability: "Contact us for available dates",
    summary: "A short regional trip built for a long weekend.",
    headline: "A short flight, a full reset — Accra for the weekend.",
    description: [
      "Accra is one of the easiest regional trips from Nigeria — short flight time, no time zone change, and a city that rewards a quick weekend visit. It's a popular pick for a fast getaway without the jet lag.",
      "This package includes your return flight, three nights in a comfortable hotel, and daily breakfast, leaving the rest of the weekend open for the beach at Labadi, the Kwame Nkrumah Memorial, or the restaurants and nightlife around Osu.",
      "Because it's a short regional hop, this is also one of our most flexible packages to customise — extend a night, add a car hire, or combine it with a stop in another West African city.",
    ],
    included: ["Return flights (Lagos–Accra)", "3 nights hotel accommodation", "Daily breakfast", "Airport transfers"],
    excluded: ["Travel insurance", "Personal expenses and optional excursions"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Transfer to your hotel, evening at leisure around Osu." },
      { day: 2, title: "City & Culture", description: "Kwame Nkrumah Memorial Park, Makola Market, and Independence Square." },
      { day: 3, title: "Beach Day", description: "Labadi Beach, with the afternoon free." },
      { day: 4, title: "Departure", description: "Check out and transfer to the airport for your return flight." },
    ],
  },
  {
    slug: "zanzibar-beach-escape",
    destination: "Zanzibar",
    country: "Tanzania",
    name: "Zanzibar Beach Escape",
    categories: ["International", "Beach", "Family"],
    priceFrom: 1850000,
    duration: "7 nights / 8 days",
    availability: "Contact us for available dates",
    summary: "Beachfront stay with airport transfers included.",
    headline: "White sand, warm water, and nothing on the schedule but the tide.",
    description: [
      "Zanzibar is built for slowing down — turquoise water, white-sand beaches, and a laid-back pace that makes it one of our most requested beach packages, for couples and families alike.",
      "This package covers flights, seven nights at a beachfront hotel, daily breakfast, and airport transfers. Stone Town's spice markets and historic architecture are a straightforward day trip if you want a break from the beach, but most guests are happy to stay put.",
      "Because the appeal here is the resort itself, we work with a small number of vetted beachfront properties — let us know your budget and preferences and we'll match you to the right one.",
    ],
    included: ["Return flights (via connecting hub)", "7 nights beachfront hotel accommodation", "Daily breakfast", "Airport transfers"],
    excluded: ["Travel insurance", "Visa fees (where applicable)", "Personal expenses and optional excursions"],
  },
  {
    slug: "obudu-mountain-retreat",
    destination: "Obudu",
    country: "Nigeria",
    name: "Obudu Mountain Retreat",
    categories: ["Domestic", "Family"],
    priceFrom: 180000,
    duration: "2 nights / 3 days",
    availability: "Contact us for available dates",
    summary: "A cool-climate mountain resort break, no international flight needed.",
    headline: "Cool mountain air and a proper break, without leaving the country.",
    description: [
      "The Obudu Mountain Resort sits high in Cross River State, with a cooler climate and open-air scenery that feels far removed from Lagos or Abuja traffic, despite being a domestic trip.",
      "This package includes your return flight to Calabar plus road transfer, two nights at the resort, and daily breakfast. The cable car, walking trails, and the resort's open spaces make it an easy trip for families with kids.",
      "It's also one of our better-value packages for a short reset, since it skips the international flight cost entirely.",
    ],
    included: ["Return flights (Lagos–Calabar)", "Road transfer to Obudu", "2 nights resort accommodation", "Daily breakfast"],
    excluded: ["Travel insurance", "Personal expenses and optional excursions", "Cable car tickets (available on-site)"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Flight to Calabar, road transfer to the resort, evening at leisure." },
      { day: 2, title: "Resort Day", description: "Cable car ride, walking trails, and open-air relaxation." },
      { day: 3, title: "Departure", description: "Transfer back to Calabar for your return flight." },
    ],
  },
  {
    slug: "abuja-corporate-stay",
    destination: "Abuja",
    country: "Nigeria",
    name: "Abuja Corporate Stay",
    categories: ["Domestic", "Business"],
    priceFrom: 220000,
    duration: "3 nights / 4 days",
    availability: "Contact us for available dates",
    summary: "Flights and a business-district hotel stay for corporate trips.",
    headline: "A straightforward stay for when Abuja is a work trip, not a holiday.",
    description: [
      "For business travel to Abuja, the details that matter are simple: a reliable flight, a well-located hotel, and transport that shows up on time. This package handles all three.",
      "It includes your return flight, three nights in a business-district hotel with breakfast, and airport transfers, so you can focus on the meetings rather than the logistics.",
      "Extending your stay, adding a driver for the duration of your trip, or booking for a small team are all easy to arrange — just tell us what you need.",
    ],
    included: ["Return flights (Lagos–Abuja)", "3 nights hotel accommodation", "Daily breakfast", "Airport transfers"],
    excluded: ["Travel insurance", "Personal expenses", "Meals outside breakfast"],
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((item) => item.slug === slug);
}

export function packageToCartItem(pkg: Package) {
  return {
    id: `package-${pkg.slug}`,
    type: "package" as const,
    title: pkg.name,
    subtitle: `${pkg.destination} · ${pkg.duration}`,
    price: pkg.priceFrom,
  };
}
