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

// A wa.me link that opens a chat with the message already typed.
export const whatsappLink = (phone: string, message?: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

// Tour enquiries, Finance and Stay and Ride go to WhatsApp on 0806 579 4790 (user, 2026-11-06).
export const enquiryWhatsapp = "+2348065794790";

// Places to visit on the homepage: the destinations of the live packages (user, 2026-11-06).
// No photos yet, so the cards use the deep-green placeholder like the package cards.
export const placesToVisit = [
  { name: "Zanzibar", country: "Tanzania" },
  { name: "Accra", country: "Ghana" },
  { name: "London", country: "United Kingdom" },
  { name: "Dubai", country: "United Arab Emirates" },
].map((place) => ({
  ...place,
  href: whatsappLink(enquiryWhatsapp, `Hi Pikinic, I'd like to make an enquiry about this tour: ${place.name}, ${place.country}.`),
}));

// A general tour enquiry, for the "What we do" banner.
export const tourEnquiryHref = whatsappLink(enquiryWhatsapp, "Hi Pikinic, I'd like to make an enquiry about a tour.");

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights" },
  { label: "Packages", href: "/packages" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
];

export const socialLinks = [
  // The Travels account (user, 2026-11-06). X removed the same day.
  { label: "Instagram", href: "https://www.instagram.com/pikinictravels_ng/", icon: "instagram" },
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
    href: whatsappLink(enquiryWhatsapp, "Hi Pikinic, I'd like to make an enquiry about Stay and Ride (a short-stay apartment or a rental car)."),
    description: "Accommodation and local rides sorted before you land.",
  },
  {
    label: "Finance",
    href: whatsappLink(
      enquiryWhatsapp,
      "Hi Pikinic, I'd like to make an enquiry about your finance services (proof of funds, school fees, visa fees or a study loan)."
    ),
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
  {
    heading: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund & Cancellation", href: "/refund-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
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
