// Sample content — written for layout purposes only. Real posts will come
// from an editorial dashboard later; until then these are generic,
// evergreen travel-advice pieces (no claims about Pikinic itself, no
// invented staff members) attributed to the team account, not a fabricated
// individual. `slug` is stable so /blogs/[slug] can key off this list
// without a data-shape change once the dashboard lands.

export type BlogCategory = "Travel Tips" | "Visa & Documentation" | "Money & Fares" | "Destination Guides";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "documents-before-any-international-trip",
    title: "5 Documents to Sort Out Before Any International Trip",
    excerpt:
      "The paperwork side of travel is rarely fun, but getting it right early saves you from a stressful departure day.",
    category: "Visa & Documentation",
    author: "Pikinic Team",
    publishedAt: "2026-08-12",
    readTime: "4 min read",
    content: [
      "It's easy to spend weeks planning an itinerary and leave the paperwork until the last minute — and it's almost always the paperwork that causes the stressful moments at the airport, not the trip itself.",
      "Start with your passport. Many countries require at least six months of validity remaining from your date of entry, and some airlines will deny boarding if that rule isn't met — check your specific destination's requirement rather than assuming.",
      "Next, be ready to show proof you can support yourself: a bank statement, a return ticket, and confirmed accommodation are commonly requested at immigration, even when they're not always checked.",
      "If you're travelling through parts of Africa or South America, your Yellow Fever vaccination card may be requested on arrival — confirm the specific requirement for your route well before you fly, since availability of the vaccine itself can take time to arrange.",
      "Finally, travel insurance is worth having even when it isn't mandatory. If any of this feels like a lot to track, it's exactly the kind of thing a travel agency can take off your plate — that's the documentation support we build into our packages.",
    ],
  },
  {
    slug: "how-to-get-a-good-flight-deal",
    title: "How to Actually Get a Good Flight Deal",
    excerpt: "A few habits make a bigger difference than any single \"secret\" trick.",
    category: "Money & Fares",
    author: "Pikinic Team",
    publishedAt: "2026-07-28",
    readTime: "5 min read",
    content: [
      "There's no single trick that guarantees a cheap fare, but a handful of habits consistently help: booking with enough lead time, staying flexible on dates, and comparing total cost rather than just the headline price.",
      "Flying midweek is usually cheaper than weekends, and being open to a one-stop routing instead of insisting on direct can significantly change the fare — especially on longer-haul routes out of Nigeria.",
      "Set fare alerts if you have flexibility on when you travel, and always check what's actually included in the price. A slightly higher fare with checked baggage included can beat a \"cheaper\" one where bags, seat selection, and meals are all extra.",
      "This is also where booking through an agent pays for itself — we search across multiple airlines for the same route and only recommend the fares that are genuinely good value, rather than you needing to check five sites yourself.",
    ],
  },
  {
    slug: "packing-for-a-week-away",
    title: "Packing for a Week Away: A Practical Checklist",
    excerpt: "Less thinking, less last-minute stress — pack the same way every time.",
    category: "Travel Tips",
    author: "Pikinic Team",
    publishedAt: "2026-07-10",
    readTime: "3 min read",
    content: [
      "Documents first, always: passport, boarding pass, hotel confirmation, and any visa paperwork go in one place you check before you leave the house — not scattered across your bag.",
      "Pack versatile clothing you can layer and repeat, rather than a separate outfit for every day. A universal adapter, a power bank, and any medication you take regularly are easy to forget and hard to replace once you've landed.",
      "Keep toiletries minimal if you're checking a bag with weight limits, and leave a little extra room — or pack a foldable bag — for whatever you pick up while you're away.",
    ],
  },
  {
    slug: "weekend-trip-or-full-holiday",
    title: "Weekend Trip or Full Holiday? How to Decide",
    excerpt: "Both are valid. The right one depends on what you're actually trying to get out of the trip.",
    category: "Travel Tips",
    author: "Pikinic Team",
    publishedAt: "2026-06-22",
    readTime: "4 min read",
    content: [
      "A weekend trip and a full international holiday solve different problems. If what you need is a quick reset — a change of scenery without using up your annual leave — a short regional hop is usually the better call.",
      "A full holiday makes more sense when the destination itself is the point: somewhere you've wanted to see properly, with enough time to actually settle in rather than spend half the trip adjusting.",
      "Budget matters too, but not just the headline cost — factor in how much annual leave you're using and how quickly you can realistically save for a longer trip versus a shorter one. Sometimes two well-timed weekend trips are more realistic than one big holiday, and sometimes it's the other way round.",
    ],
  },
  {
    slug: "booking-through-an-agency-vs-diy",
    title: "Booking Through an Agency vs. Doing It Yourself",
    excerpt: "There's no universally right answer — here's how to think about the trade-off.",
    category: "Money & Fares",
    author: "Pikinic Team",
    publishedAt: "2026-06-05",
    readTime: "5 min read",
    content: [
      "Booking everything yourself gives you full control and can work well for a simple, single-destination trip where you already know exactly what you want.",
      "Where an agency tends to help more is when a trip has several moving parts — flights, accommodation, transfers, maybe a visa application — and you'd rather have one point of contact than juggle five different bookings if something changes.",
      "It also helps when you don't have time to compare fares across multiple airlines yourself, or when the documentation requirements for your destination aren't straightforward.",
      "Neither approach is automatically better — it comes down to how complex the trip is and how much of the coordination you'd rather hand off.",
    ],
  },
  {
    slug: "first-time-in-dubai",
    title: "First Time in Dubai? Here's What to Know",
    excerpt: "The basics that make your first few hours in the city a lot less confusing.",
    category: "Destination Guides",
    author: "Pikinic Team",
    publishedAt: "2026-08-25",
    readTime: "4 min read",
    content: [
      "Dubai runs on a mix of the familiar and the unfamiliar — English is widely spoken and getting around is straightforward, but a few basics are worth knowing before you land.",
      "The local currency is the UAE Dirham (AED); most hotels and malls accept cards, but it's worth carrying some cash for taxis and smaller vendors. The Dubai Metro is clean, cheap, and covers most of the areas visitors care about, including a direct line to the airport.",
      "Weather-wise, the cooler months (roughly November to March) are far more comfortable for walking around outdoors than the peak of summer, when daytime heat can make anything outside air conditioning a short trip.",
      "Dress is generally relaxed in tourist areas and hotels, but modest clothing is appreciated in more traditional or religious sites — packing a light layer to cover shoulders is an easy way to stay flexible.",
      "Beyond that, the city rewards a loose plan more than a rigid one — leave room to wander through Old Dubai one day and do nothing but the pool the next.",
    ],
  },
  {
    slug: "beginners-guide-to-multi-city-flights",
    title: "A Beginner's Guide to Multi-City Flights",
    excerpt: "One trip, several stops — here's when it makes sense and how the pricing tends to work.",
    category: "Travel Tips",
    author: "Pikinic Team",
    publishedAt: "2026-05-18",
    readTime: "4 min read",
    content: [
      "A multi-city itinerary means flying into one city and out of another — or adding a stop in between — instead of a simple round trip. It's common for combining a business trip with personal travel, or visiting more than one country in one journey.",
      "Pricing on multi-city routes doesn't always follow the same logic as a standard round trip. Sometimes it's cheaper than booking the legs separately, sometimes it isn't, and it depends heavily on which airlines and alliances cover your specific combination of cities.",
      "Because there are more moving parts — more connections, more visa considerations if you're crossing multiple borders — this is one of the itinerary types where it's genuinely worth having someone check the routing before you book, rather than assembling it yourself leg by leg.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
