import { getJson } from "@/server/lib/pikinic-client";
import type { BlogPost, FlightOffer, Package } from "@/types";

export const getFlightOffers = () => getJson<FlightOffer[]>("/api/flights");

export const getPackages = () => getJson<Package[]>("/api/packages");

export const getPackageBySlug = async (slug: string): Promise<Package | null> => {
  try {
    return await getJson<Package>(`/api/packages/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
};

export const getBlogPosts = () => getJson<BlogPost[]>("/api/blog");

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    return await getJson<BlogPost>(`/api/blog/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
};
