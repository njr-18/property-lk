import type { SearchFilters } from "@property-lk/types";

export function normalizeSearchFilters(filters: SearchFilters): SearchFilters {
  return {
    ...filters,
    query: filters.query?.trim()
  };
}
