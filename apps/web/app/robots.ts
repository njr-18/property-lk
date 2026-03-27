import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "../lib/seo";

export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/areas/", "/search/", "/listings/", "/rent", "/buy", "/guides/"],
        disallow: ["/api/", "/account/", "/saved/", "/login", "/signup"]
      }
    ],
    sitemap: buildCanonicalUrl("/sitemap.xml")
  };
}
