import {
  listingSearchListingTypes,
  type ListingSearchListingType
} from "@property-lk/types";

export { searchListings } from "./listings";

const validListingTypes = new Set<ListingSearchListingType>(listingSearchListingTypes);

export function parseListingTypeParam(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase() as ListingSearchListingType;
  return validListingTypes.has(normalized) ? normalized : undefined;
}
