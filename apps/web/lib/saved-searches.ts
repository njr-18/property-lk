import { listSavedSearches } from "@property-lk/db";
import type { NormalizedListingSearchFilters, SavedSearchPayload } from "@property-lk/types";
import { parseListingSearchParams } from "@property-lk/validation";

const DEFAULT_SAVED_SEARCH_NAME = "My search";

export async function getSavedSearchesPageData(userId: string) {
  return listSavedSearches(userId);
}

export type ParsedSavedSearchInput = {
  ok: boolean;
  data?: {
    name: string;
    alertEnabled: boolean;
    searchParams: NormalizedListingSearchFilters;
  };
  errors: Array<{ field: "name" | "searchParams"; message: string }>;
};

export function parseSavedSearchInput(input: Partial<SavedSearchPayload>): ParsedSavedSearchInput {
  const name = input.name?.trim().replace(/\s+/g, " ");
  const alertEnabled = input.alertEnabled ?? false;
  const rawSearchParams =
    input.searchParams && typeof input.searchParams === "object" ? input.searchParams : {};
  const parsedSearch = parseListingSearchParams(rawSearchParams);

  const errors: Array<{ field: "name" | "searchParams"; message: string }> = [];

  if (!name) {
    errors.push({
      field: "name",
      message: "Enter a name for this saved search."
    });
  } else if (name.length > 80) {
    errors.push({
      field: "name",
      message: "Name must be 80 characters or fewer."
    });
  }

  return {
    ok: errors.length === 0,
    data:
      errors.length === 0 && name
        ? {
            name,
            alertEnabled: Boolean(alertEnabled),
            searchParams: parsedSearch.data
          }
        : undefined,
    errors
  };
}

export function buildSavedSearchHref(filters: NormalizedListingSearchFilters) {
  const params = new URLSearchParams();

  params.set("listingType", filters.listingType);

  if (filters.propertyType) {
    params.set("propertyType", filters.propertyType);
  }

  if (filters.district) {
    params.set("district", filters.district);
  }

  if (filters.area) {
    params.set("area", filters.area);
  }

  if (typeof filters.minPriceLkr === "number") {
    params.set("minPrice", String(filters.minPriceLkr));
  }

  if (typeof filters.maxPriceLkr === "number") {
    params.set("maxPrice", String(filters.maxPriceLkr));
  }

  if (typeof filters.bedrooms === "number") {
    params.set("bedrooms", String(filters.bedrooms));
  }

  if (typeof filters.bathrooms === "number") {
    params.set("bathrooms", String(filters.bathrooms));
  }

  if (filters.furnishedState) {
    params.set("furnishedState", filters.furnishedState);
  }

  if (typeof filters.parking === "boolean") {
    params.set("parking", String(filters.parking));
  }

  if (typeof filters.verification.phoneVerified === "boolean") {
    params.set("phoneVerified", String(filters.verification.phoneVerified));
  }

  if (typeof filters.verification.whatsappVerified === "boolean") {
    params.set("whatsappVerified", String(filters.verification.whatsappVerified));
  }

  if (typeof filters.verification.ownerVerified === "boolean") {
    params.set("ownerVerified", String(filters.verification.ownerVerified));
  }

  if (typeof filters.verification.agencyVerified === "boolean") {
    params.set("agencyVerified", String(filters.verification.agencyVerified));
  }

  if (filters.query) {
    params.set("query", filters.query);
  }

  if (filters.sort && filters.sort !== "recommended") {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function getDefaultSavedSearchName(filters: NormalizedListingSearchFilters) {
  if (filters.query) {
    return truncateSavedSearchName(filters.query);
  }

  const parts = [filters.area, filters.district, filters.propertyType, filters.listingType].filter(
    Boolean
  );

  if (parts.length === 0) {
    return DEFAULT_SAVED_SEARCH_NAME;
  }

  return truncateSavedSearchName(
    parts
      .map((part) => String(part))
      .join(" ")
      .replace(/\s+/g, " ")
  );
}

function truncateSavedSearchName(value: string) {
  return value.length > 80 ? `${value.slice(0, 77)}...` : value;
}
