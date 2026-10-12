import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { getBlogPosts } from "@/server/modules/content/content.service";

// The /packages page is listed, but the individual package pages
// (/packages/<slug>) are left out for now because they aren't available. Add
// them back here when they are.
const staticPaths = ["/", "/flights", "/packages", "/about", "/blogs", "/contact", "/terms", "/refund-policy", "/privacy-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: `${siteConfig.url}${path === "/" ? "" : path}` }));

  // Blog posts come from the remote API. If it is down, ship the static
  // routes rather than failing the sitemap.
  try {
    const posts = await getBlogPosts();
    entries.push(...posts.map((post) => ({ url: `${siteConfig.url}/blogs/${post.slug}` })));
  } catch {
    // Keep the static routes.
  }

  return entries;
}
