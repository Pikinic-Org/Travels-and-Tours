export const siteConfig = {
  name: "Pikinic Travel & Tours",
  shortName: "Pikinic",
  description:
    "Flights, vacation packages, and travel planning for Nigerians going places. We handle the search, the booking, and the details so you can focus on the journey.",
  url: "https://travelsandtours.pikinic.ng",
  email: "admin@pikinic.ng",
  address: "LSDPC Alausa Mall, 131 Obafemi Awolowo Way, Ikeja",
  phones: ["+2348055308558", "+2349022525013"],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/pikinic", icon: "instagram" },
  { label: "X", href: "https://x.com/pikinic_ng", icon: "x" },
  { label: "TikTok", href: "https://tiktok.com/@pikinic.ng", icon: "tiktok" },
  { label: "LinkedIn", href: "https://linkedin.com/company/pikinic", icon: "linkedin" },
] as const;

export const siblingLinks = [
  {
    label: "Study Abroad",
    href: "https://studyabroad.pikinic.ng",
    description: "Applications, visas, and the paperwork that comes with studying overseas.",
  },
  { label: "Travel & Tours", href: "https://travelsandtours.pikinic.ng" },
  {
    label: "Stay & Ride",
    href: "https://stayandride.pikinic.ng",
    description: "Accommodation and local rides sorted before you land.",
  },
  {
    label: "Finance",
    href: "https://firstmushrooom.com",
    description: "Proof of funds and the financial documentation your journey needs.",
  },
];

export const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Flights", href: "/flights" },
      { label: "Packages", href: "/packages" },
      { label: "About", href: "/about" },
      { label: "Blogs", href: "/blogs" },
    ],
  },
  {
    heading: "Pikinic",
    links: siblingLinks,
  },
];

// Domain data (packages, flight offers) lives in `src/lib/data/` — each
// entity carries a stable id/slug so the upcoming /flights, /packages,
// /packages/[slug], and /blog routes can key off the same records instead
// of duplicating shapes per page.

export const partnershipPoints: { icon: "tag" | "passport" | "route"; heading: string; body: string }[] = [
  {
    icon: "tag",
    heading: "Best fares, honestly sourced",
    body: "We search across airlines and only recommend the fares that are genuinely good value. No inflated prices. No hidden charges.",
  },
  {
    icon: "passport",
    heading: "We know the Nigerian traveller",
    body: "We understand the documentation requirements, the timing pressures, and the specific needs of Nigerians travelling for business, study, tourism, and relocation.",
  },
  {
    icon: "route",
    heading: "One team for the whole journey",
    body: "Your flight, your accommodation, your study abroad application, your proof of funds. All in one brand so you never have to start over with someone new.",
  },
];
