import type { MetadataRoute } from "next";
import { sampleAreas, sampleGuides, sampleListings } from "../lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://property-lk.local";

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/search`, lastModified: new Date() },
    { url: `${baseUrl}/rent`, lastModified: new Date() },
    { url: `${baseUrl}/buy`, lastModified: new Date() },
    ...sampleAreas.map((area) => ({
      url: `${baseUrl}/areas/${area.slug}`,
      lastModified: new Date()
    })),
    ...sampleGuides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: new Date()
    })),
    ...sampleListings.map((listing) => ({
      url: `${baseUrl}/listings/${listing.slug}`,
      lastModified: new Date()
    }))
  ];
}
