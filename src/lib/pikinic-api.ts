import type { FlightOffer } from "@/lib/data/flights";
import type { Package } from "@/lib/data/packages";
import type { BlogPost } from "@/lib/data/blog";

const BASE_URL = process.env.PIKINIC_API_URL ?? "http://localhost:3000";

// pikinic-site's blog posts store rich content blocks (headings, paragraphs,
// images) for the admin editor. This site's blog pages only render flat
// paragraphs today, so text blocks are flattened to strings and image
// blocks are dropped — richer rendering can be added later if needed.
type RemoteBlogContentBlock =
  | { id: string; type: "h1" | "h2" | "h3" | "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption?: string };

type RemoteBlogPost = Omit<BlogPost, "content"> & { content: RemoteBlogContentBlock[] };

function flattenBlogContent(blocks: RemoteBlogContentBlock[]): string[] {
  return blocks.filter((block) => block.type !== "image").map((block) => (block as { text: string }).text);
}

function toBlogPost(post: RemoteBlogPost): BlogPost {
  return { ...post, content: flattenBlogContent(post.content) };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Request to ${path} failed with status ${res.status}`);
  return res.json();
}

export async function getFlightOffers(): Promise<FlightOffer[]> {
  return get<FlightOffer[]>("/api/flights");
}

export async function getPackages(): Promise<Package[]> {
  return get<Package[]>("/api/packages");
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  try {
    return await get<Package>(`/api/packages/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await get<RemoteBlogPost[]>("/api/blog");
  return posts.map(toBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await get<RemoteBlogPost>(`/api/blog/${encodeURIComponent(slug)}`);
    return toBlogPost(post);
  } catch {
    return null;
  }
}
