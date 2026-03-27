export const LISTING_SEARCH_PAGE_SIZE = 24;

export const listingSearchListingTypes = ["rent", "sale"] as const;
export const listingSearchPropertyTypes = [
  "room",
  "annex",
  "house",
  "apartment",
  "land",
  "commercial"
] as const;
export const listingSearchFurnishedStates = ["unfurnished", "semi-furnished", "furnished"] as const;
export const listingSearchSortOptions = ["recommended", "newest", "price-asc", "price-desc"] as const;

export type ListingSearchListingType = (typeof listingSearchListingTypes)[number];
export type ListingSearchPropertyType = (typeof listingSearchPropertyTypes)[number];
export type ListingSearchFurnishedState = (typeof listingSearchFurnishedStates)[number];
export type ListingSearchSort = (typeof listingSearchSortOptions)[number];

export type ListingSearchVerificationFilters = {
  phoneVerified?: boolean;
  whatsappVerified?: boolean;
  ownerVerified?: boolean;
  agencyVerified?: boolean;
};

export type ListingSearchRawParam =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly (string | number | boolean | null | undefined)[];

export type ListingSearchRawParams = Partial<
  Record<
    | "listingType"
    | "propertyType"
    | "district"
    | "area"
    | "minPrice"
    | "maxPrice"
    | "bedrooms"
    | "bathrooms"
    | "furnishedState"
    | "parking"
    | "phoneVerified"
    | "whatsappVerified"
    | "ownerVerified"
    | "agencyVerified"
    | "query"
    | "sort"
    | "page",
    ListingSearchRawParam
  >
>;

export type NormalizedListingSearchFilters = {
  listingType: ListingSearchListingType;
  propertyType?: ListingSearchPropertyType;
  district?: string;
  area?: string;
  minPriceLkr?: number;
  maxPriceLkr?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishedState?: ListingSearchFurnishedState;
  parking?: boolean;
  verification: ListingSearchVerificationFilters;
  query?: string;
  sort: ListingSearchSort;
  page: number;
  pageSize: number;
  skip: number;
};

export type ListingSearchParseIssue = {
  field:
    | "listingType"
    | "propertyType"
    | "district"
    | "area"
    | "minPrice"
    | "maxPrice"
    | "bedrooms"
    | "bathrooms"
    | "furnishedState"
    | "parking"
    | "phoneVerified"
    | "whatsappVerified"
    | "ownerVerified"
    | "agencyVerified"
    | "query"
    | "sort"
    | "page";
  message: string;
  value?: ListingSearchRawParam;
};

export type ListingSearchParseResult = {
  ok: boolean;
  data: NormalizedListingSearchFilters;
  issues: ListingSearchParseIssue[];
};

export type SearchFilters = NormalizedListingSearchFilters;

export type SearchResponse = {
  total: number;
  filters: NormalizedListingSearchFilters;
  listingIds: string[];
};

export type SavedSearchPayload = {
  name: string;
  alertEnabled?: boolean;
  searchParams: ListingSearchRawParams;
};
