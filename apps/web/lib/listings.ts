import {
  getListingByIdentifier as getDbListingByIdentifier,
  getListingBySlug as getDbListingBySlug,
  getRelatedListings,
  listLatestListings,
  searchListings as searchDbListings,
  type ListingDetail,
  type ListingSearchResult,
  type ListingSummary
} from "@property-lk/db";
import type { ListingSearchRawParams } from "@property-lk/types";
import { parseListingSearchParams } from "@property-lk/validation";

type SearchParamInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

export type SearchPageData = ListingSearchResult & {
  issues: ReturnType<typeof parseListingSearchParams>["issues"];
};

export async function searchListings(searchParams: SearchParamInput): Promise<SearchPageData> {
  const parseResult = parseListingSearchParams(toRawSearchParams(searchParams));
  const result = await searchDbListings(parseResult.data);

  return {
    ...result,
    issues: parseResult.issues
  };
}

export async function getListingPageData(slug: string) {
  const listing = await getDbListingBySlug(slug);

  if (!listing) {
    return null;
  }

  const relatedListings = await getRelatedListings(listing);

  return {
    listing,
    relatedListings
  };
}

export function getListingByIdentifier(identifier: string): Promise<ListingDetail | null> {
  return getDbListingByIdentifier(identifier);
}

export function getLatestListings(limit?: number): Promise<ListingSummary[]> {
  return listLatestListings(limit);
}

function toRawSearchParams(searchParams: SearchParamInput): ListingSearchRawParams {
  const params = searchParams instanceof URLSearchParams
    ? searchParams
    : objectToSearchParams(searchParams);

  return {
    listingType: params.get("listingType") ?? params.get("type") ?? undefined,
    propertyType: params.get("propertyType") ?? undefined,
    district: params.get("district") ?? undefined,
    area: params.get("area") ?? undefined,
    minPrice: params.get("minPrice") ?? undefined,
    maxPrice: params.get("maxPrice") ?? undefined,
    bedrooms: params.get("bedrooms") ?? undefined,
    bathrooms: params.get("bathrooms") ?? undefined,
    furnishedState: params.get("furnishedState") ?? undefined,
    parking: params.get("parking") ?? undefined,
    phoneVerified: params.get("phoneVerified") ?? undefined,
    whatsappVerified: params.get("whatsappVerified") ?? undefined,
    ownerVerified: params.get("ownerVerified") ?? undefined,
    agencyVerified: params.get("agencyVerified") ?? undefined,
    query: params.get("query") ?? params.get("q") ?? undefined,
    sort: params.get("sort") ?? undefined,
    page: params.get("page") ?? undefined
  };
}

function objectToSearchParams(input: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      params.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    }
  }

  return params;
}
