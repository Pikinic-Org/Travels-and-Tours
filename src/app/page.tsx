import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Packages } from "@/components/sections/packages";
import { FlightOffers } from "@/components/sections/flight-offers";
import { Cta } from "@/components/sections/cta";
import { siteConfig, socialLinks } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Tells Google what the business is, in its own words (name, description,
// contact, social profiles), all taken from siteConfig so there is one source.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phones[0],
  address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressCountry: "NG" },
  parentOrganization: { "@type": "Organization", name: "Pikinic", url: "https://www.pikinic.ng" },
  sameAs: socialLinks.map((link) => link.href),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Hero />
      <Packages />
      <FlightOffers />
      <Cta />
    </>
  );
}
