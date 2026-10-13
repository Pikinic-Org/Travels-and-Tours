// Blog post data now comes from pikinic-site's admin-managed API — see
// @/server/modules/content/content.service. This file only keeps the shared type and the pure
// date formatter, since those are used regardless of data source.
export type BlogCategory = "Travel Tips" | "Visa & Documentation" | "Money & Fares" | "Destination Guides";

// Matches pikinic-site's admin editor blocks. Paragraph and list text can
// carry **bold**, *italic* and [link](https://…) markers.
export type BlogContentBlock =
  | { id: string; type: "h1" | "h2" | "h3" | "paragraph"; text: string }
  | { id: string; type: "list"; ordered: boolean; items: string[] }
  | { id: string; type: "image"; url: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readTime: string;
  content: BlogContentBlock[];
  imageUrl: string;
};

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
