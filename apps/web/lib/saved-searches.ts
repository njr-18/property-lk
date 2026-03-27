import { listSavedSearches } from "@property-lk/db";
import type { NormalizedListingSearchFilters, SavedSearchPayload } from "@property-lk/types";
import { parseListingSearchParams } from "@property-lk/validation";
export { buildSavedSearchHref, getDefaultSavedSearchName } from "./saved-search-links";

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
