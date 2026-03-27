import {
  LISTING_SEARCH_PAGE_SIZE,
  listingSearchFurnishedStates,
  listingSearchListingTypes,
  listingSearchPropertyTypes,
  listingSearchSortOptions,
  type ListingSearchFurnishedState,
  type ListingSearchListingType,
  type ListingSearchParseIssue,
  type ListingSearchParseResult,
  type ListingSearchPropertyType,
  type ListingSearchRawParam,
  type ListingSearchRawParams,
  type ListingSearchSort,
  type NormalizedListingSearchFilters
} from "@property-lk/types";

const DEFAULT_LISTING_TYPE: ListingSearchListingType = "rent";
const DEFAULT_SORT: ListingSearchSort = "recommended";

const furnishedStateAliases: Record<string, ListingSearchFurnishedState> = {
  furnished: "furnished",
  "fully furnished": "furnished",
  fullfurnished: "furnished",
  semifurnished: "semi-furnished",
  "semi furnished": "semi-furnished",
  "semi-furnished": "semi-furnished",
  unfurnished: "unfurnished",
  none: "unfurnished"
};

type SearchField = ListingSearchParseIssue["field"];

export function getDefaultListingSearchFilters(): NormalizedListingSearchFilters {
  return {
    listingType: DEFAULT_LISTING_TYPE,
    sort: DEFAULT_SORT,
    verification: {},
    page: 1,
    pageSize: LISTING_SEARCH_PAGE_SIZE,
    skip: 0
  };
}

export function normalizeSearchFilters(
  filters: Partial<NormalizedListingSearchFilters>
): NormalizedListingSearchFilters {
  const defaults = getDefaultListingSearchFilters();
  const page = filters.page && filters.page > 0 ? Math.floor(filters.page) : defaults.page;
  const pageSize =
    filters.pageSize && filters.pageSize > 0 ? Math.floor(filters.pageSize) : defaults.pageSize;

  return {
    ...defaults,
    ...filters,
    district: normalizeLocationText(filters.district),
    area: normalizeLocationText(filters.area),
    query: normalizeKeyword(filters.query),
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    verification: {
      ...defaults.verification,
      ...filters.verification
    }
  };
}

export function parseListingSearchParams(input: ListingSearchRawParams): ListingSearchParseResult {
  const issues: ListingSearchParseIssue[] = [];
  const parsed = getDefaultListingSearchFilters();

  parsed.listingType = parseEnumValue(
    input.listingType,
    listingSearchListingTypes,
    "listingType",
    issues,
    DEFAULT_LISTING_TYPE
  ) ?? DEFAULT_LISTING_TYPE;
  parsed.propertyType = parseEnumValue(
    input.propertyType,
    listingSearchPropertyTypes,
    "propertyType",
    issues
  );
  parsed.district = parseTextField(input.district, "district", issues, normalizeLocationText);
  parsed.area = parseTextField(input.area, "area", issues, normalizeLocationText);
  parsed.query = parseTextField(input.query, "query", issues, normalizeKeyword);
  parsed.minPriceLkr = parsePositiveInteger(input.minPrice, "minPrice", issues);
  parsed.maxPriceLkr = parsePositiveInteger(input.maxPrice, "maxPrice", issues);
  parsed.bedrooms = parsePositiveInteger(input.bedrooms, "bedrooms", issues);
  parsed.bathrooms = parsePositiveInteger(input.bathrooms, "bathrooms", issues);
  parsed.furnishedState = parseFurnishedState(input.furnishedState, issues);
  parsed.parking = parseBooleanField(input.parking, "parking", issues);
  parsed.verification.phoneVerified = parseBooleanField(
    input.phoneVerified,
    "phoneVerified",
    issues
  );
  parsed.verification.whatsappVerified = parseBooleanField(
    input.whatsappVerified,
    "whatsappVerified",
    issues
  );
  parsed.verification.ownerVerified = parseBooleanField(
    input.ownerVerified,
    "ownerVerified",
    issues
  );
  parsed.verification.agencyVerified = parseBooleanField(
    input.agencyVerified,
    "agencyVerified",
    issues
  );
  parsed.sort =
    parseEnumValue(input.sort, listingSearchSortOptions, "sort", issues, DEFAULT_SORT) ??
    DEFAULT_SORT;

  const parsedPage = parsePositiveInteger(input.page, "page", issues, 1);
  parsed.page = parsedPage ?? 1;

  if (
    typeof parsed.minPriceLkr === "number" &&
    typeof parsed.maxPriceLkr === "number" &&
    parsed.minPriceLkr > parsed.maxPriceLkr
  ) {
    issues.push({
      field: "minPrice",
      message: "minPrice cannot be greater than maxPrice",
      value: input.minPrice
    });
    issues.push({
      field: "maxPrice",
      message: "maxPrice cannot be less than minPrice",
      value: input.maxPrice
    });
    delete parsed.minPriceLkr;
    delete parsed.maxPriceLkr;
  }

  return {
    ok: issues.length === 0,
    data: normalizeSearchFilters(parsed),
    issues
  };
}

function parseTextField(
  value: ListingSearchRawParam,
  field: SearchField,
  issues: ListingSearchParseIssue[],
  formatter: (input: string | undefined) => string | undefined = normalizeKeyword
) {
  const singleValue = getSingleValue(value);

  if (singleValue == null) {
    return undefined;
  }

  if (typeof singleValue !== "string") {
    issues.push({
      field,
      message: `${field} must be a string`,
      value
    });
    return undefined;
  }

  return formatter(singleValue);
}

function parsePositiveInteger(
  value: ListingSearchRawParam,
  field: SearchField,
  issues: ListingSearchParseIssue[],
  minimum = 0
) {
  const singleValue = getSingleValue(value);

  if (singleValue == null || singleValue === "") {
    return undefined;
  }

  const numericValue =
    typeof singleValue === "number"
      ? singleValue
      : typeof singleValue === "string"
        ? Number(singleValue)
        : Number.NaN;

  if (!Number.isInteger(numericValue) || numericValue < minimum) {
    issues.push({
      field,
      message: `${field} must be a non-negative integer`,
      value
    });
    return undefined;
  }

  return numericValue;
}

function parseBooleanField(
  value: ListingSearchRawParam,
  field: SearchField,
  issues: ListingSearchParseIssue[]
) {
  const singleValue = getSingleValue(value);

  if (singleValue == null || singleValue === "") {
    return undefined;
  }

  if (typeof singleValue === "boolean") {
    return singleValue;
  }

  if (typeof singleValue === "number") {
    if (singleValue === 1) {
      return true;
    }

    if (singleValue === 0) {
      return false;
    }
  }

  if (typeof singleValue === "string") {
    const normalized = singleValue.trim().toLowerCase();

    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  issues.push({
    field,
    message: `${field} must be a boolean`,
    value
  });
  return undefined;
}

function parseEnumValue<TValue extends string>(
  value: ListingSearchRawParam,
  allowedValues: readonly TValue[],
  field: SearchField,
  issues: ListingSearchParseIssue[],
  fallback?: TValue
) {
  const singleValue = getSingleValue(value);

  if (singleValue == null || singleValue === "") {
    return fallback;
  }

  if (typeof singleValue !== "string") {
    issues.push({
      field,
      message: `${field} must be one of ${allowedValues.join(", ")}`,
      value
    });
    return fallback;
  }

  const normalized = singleValue.trim().toLowerCase() as TValue;

  if (!allowedValues.includes(normalized)) {
    issues.push({
      field,
      message: `${field} must be one of ${allowedValues.join(", ")}`,
      value
    });
    return fallback;
  }

  return normalized;
}

function parseFurnishedState(
  value: ListingSearchRawParam,
  issues: ListingSearchParseIssue[]
): ListingSearchFurnishedState | undefined {
  const singleValue = getSingleValue(value);

  if (singleValue == null || singleValue === "") {
    return undefined;
  }

  if (typeof singleValue !== "string") {
    issues.push({
      field: "furnishedState",
      message: `furnishedState must be one of ${listingSearchFurnishedStates.join(", ")}`,
      value
    });
    return undefined;
  }

  const normalized = singleValue.trim().toLowerCase().replace(/[_\s]+/g, " ");
  const mapped = furnishedStateAliases[normalized.replace(/\s+/g, " ")] ?? furnishedStateAliases[normalized.replace(/\s+/g, "")];

  if (!mapped) {
    issues.push({
      field: "furnishedState",
      message: `furnishedState must be one of ${listingSearchFurnishedStates.join(", ")}`,
      value
    });
  }

  return mapped;
}

function getSingleValue(value: ListingSearchRawParam) {
  if (Array.isArray(value)) {
    return value.find((item) => item !== undefined && item !== null);
  }

  return value;
}

export function normalizeKeyword(input: string | undefined) {
  const normalized = input?.trim().replace(/\s+/g, " ");
  return normalized ? normalized : undefined;
}

export function normalizeLocationText(input: string | undefined) {
  const normalized = input?.trim().replace(/[-_]+/g, " ").replace(/\s+/g, " ");

  if (!normalized) {
    return undefined;
  }

  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
