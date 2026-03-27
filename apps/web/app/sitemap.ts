import type { MetadataRoute } from "next";
import {
  listActiveListingSeoEntries,
  listAreaPageSlugs,
  listPublishedGuideSeoEntries,
  listSeoLocations
} from "@property-lk/db";
import { buildAreaPath, buildListingPath, buildSearchPath, buildCanonicalUrl } from "../lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locations, areaSlugs, guides, listings] = await Promise.all([
    listSeoLocations(100).catch(() => []),
    listAreaPageSlugs().catch(() => []),
    listPublishedGuideSeoEntries().catch(() => []),
    listActiveListingSeoEntries().catch(() => [])
  ]);

  return [
    { url: buildCanonicalUrl("/"), lastModified: new Date() },
    { url: buildCanonicalUrl("/search"), lastModified: new Date() },
    { url: buildCanonicalUrl("/rent"), lastModified: new Date() },
    { url: buildCanonicalUrl("/buy"), lastModified: new Date() },
    ...areaSlugs.map((slug) => ({
      url: buildCanonicalUrl(buildAreaPath(slug)),
      lastModified: new Date()
    })),
    ...locations.flatMap((location) => [
      {
        url: buildCanonicalUrl(buildSearchPath({ listingType: "rent", areaSlug: location.slug })),
        lastModified: location.updatedAt
      },
      {
        url: buildCanonicalUrl(buildSearchPath({ listingType: "sale", areaSlug: location.slug })),
        lastModified: location.updatedAt
      }
    ]),
    ...guides.map((guide) => ({
      url: buildCanonicalUrl(`/guides/${guide.slug}`),
      lastModified: guide.updatedAt
    })),
    ...listings.map((listing) => ({
      url: buildCanonicalUrl(buildListingPath(listing.slug)),
      lastModified: listing.updatedAt
    }))
  ];
}
