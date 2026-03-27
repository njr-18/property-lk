import type { Metadata } from "next";
import {
  buildAreaPath,
  buildBreadcrumbSchema,
  buildCanonicalUrl,
  buildListingPath,
  buildListingSchema,
  buildMetadataPayload,
  buildSearchPath,
  getSiteUrl
} from "@property-lk/seo";
import type { BreadcrumbItem, ListingSchemaInput } from "@property-lk/seo";

export type { BreadcrumbItem } from "@property-lk/seo";

export function getMetadataBase() {
  return new URL(getSiteUrl());
}

export function createMetadata(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const payload = buildMetadataPayload(input);

  return {
    title: payload.title,
    description: payload.description,
    alternates: {
      canonical: payload.canonical
    },
    openGraph: payload.openGraph,
    twitter: payload.twitter
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return buildBreadcrumbSchema(items);
}

export function createListingStructuredData(input: ListingSchemaInput) {
  return buildListingSchema(input);
}

export {
  buildAreaPath,
  buildCanonicalUrl,
  buildListingPath,
  buildSearchPath
};
