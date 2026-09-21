import type { BlogPost } from "@/lib/data/blog";

// The site-content shapes still live beside their pure helpers in lib/data;
// they're re-exported here so every type can be imported from "@/types".
export type { FlightOffer } from "@/lib/data/flights";
export type { Package } from "@/lib/data/packages";
export type { BlogPost } from "@/lib/data/blog";

// pikinic-site's blog posts store rich content blocks (headings, paragraphs,
// images) for the admin editor. This site's blog pages only render flat
// paragraphs today, so text blocks are flattened to strings and image
// blocks are dropped — richer rendering can be added later if needed.
export type RemoteBlogContentBlock =
  | { id: string; type: "h1" | "h2" | "h3" | "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption?: string };

export type RemoteBlogPost = Omit<BlogPost, "content"> & { content: RemoteBlogContentBlock[] };
