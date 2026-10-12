import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

// Private routes (cart, booking, checkout) are kept out of the index with a
// `noindex` tag in their layouts, not by Disallow here — Google has to be able
// to crawl a page to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
