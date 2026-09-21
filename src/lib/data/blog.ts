// Blog post data now comes from pikinic-site's admin-managed API — see
// @/services/content.service. This file only keeps the shared type and the pure
// date formatter, since those are used regardless of data source.
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
  imageUrl: string;
};

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
