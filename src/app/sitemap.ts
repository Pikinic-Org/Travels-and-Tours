import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { getBlogPosts, getPackages } from "@/server/modules/content/content.service";

const staticPaths = ["/", "/flights", "/packages", "/about", "/blogs", "/contact", "/terms", "/refund-policy", "/privacy-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: `${siteConfig.url}${path === "/" ? "" : path}` }));

  // Packages and blog posts come from the remote API. If it is down, ship the
  // static routes rather than failing the sitemap.
  const [packages, posts] = await Promise.allSettled([getPackages(), getBlogPosts()]);

  if (packages.status === "fulfilled") {
    entries.push(...packages.value.map((pkg) => ({ url: `${siteConfig.url}/packages/${pkg.slug}` })));
  }
  if (posts.status === "fulfilled") {
    entries.push(...posts.value.map((post) => ({ url: `${siteConfig.url}/blogs/${post.slug}` })));
  }

  return entries;
}
