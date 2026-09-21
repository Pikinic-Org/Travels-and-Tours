import { getJson } from "@/services/http";
import type { BlogPost, FlightOffer, Package, RemoteBlogContentBlock, RemoteBlogPost } from "@/types";

const flattenBlogContent = (blocks: RemoteBlogContentBlock[]): string[] =>
  blocks.filter((block) => block.type !== "image").map((block) => (block as { text: string }).text);

const toBlogPost = (post: RemoteBlogPost): BlogPost => ({ ...post, content: flattenBlogContent(post.content) });

export const getFlightOffers = () => getJson<FlightOffer[]>("/api/flights");

export const getPackages = () => getJson<Package[]>("/api/packages");

export const getPackageBySlug = async (slug: string): Promise<Package | null> => {
  try {
    return await getJson<Package>(`/api/packages/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const posts = await getJson<RemoteBlogPost[]>("/api/blog");
  return posts.map(toBlogPost);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const post = await getJson<RemoteBlogPost>(`/api/blog/${encodeURIComponent(slug)}`);
    return toBlogPost(post);
  } catch {
    return null;
  }
};
