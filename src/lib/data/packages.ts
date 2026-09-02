// Package data now comes from pikinic-site's admin-managed API — see
// @/lib/pikinic-api. This file only keeps the shared types and the pure
// cart-item mapper, since those are used regardless of data source.
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

export function packageToCartItem(pkg: Package) {
  return {
    id: `package-${pkg.slug}`,
    type: "package" as const,
    title: pkg.name,
    subtitle: `${pkg.destination} · ${pkg.duration}`,
    price: pkg.priceFrom,
  };
}
