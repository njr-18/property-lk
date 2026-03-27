export const SITE_NAME = "Property LK";
export const DEFAULT_SITE_URL = "https://property-lk.local";

export type SearchPathInput = {
  listingType?: "rent" | "sale";
  areaSlug?: string;
  query?: Record<string, string | number | boolean | null | undefined>;
};

export function getSiteUrl() {
  return stripTrailingSlash(getEnvSiteUrl() ?? DEFAULT_SITE_URL);
}

export function buildAreaPath(slug: string) {
  return `/areas/${slugifySegment(slug)}`;
}

export function buildListingPath(slug: string) {
  return `/listings/${slugifySegment(slug)}`;
}

export function buildSearchPath({ listingType, areaSlug, query }: SearchPathInput = {}) {
  const path =
    listingType && areaSlug
      ? `/search/${listingType}/in/${slugifySegment(areaSlug)}`
      : "/search";

  const search = new URLSearchParams();

  if (!areaSlug && listingType) {
    search.set("listingType", listingType);
  }

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    search.set(key, String(value));
  }

  const searchString = search.toString();
  return searchString ? `${path}?${searchString}` : path;
}

export function buildCanonicalUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${getSiteUrl()}${normalizePath(path)}`;
}

export function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function slugifySegment(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getEnvSiteUrl() {
  const processValue = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return processValue?.env?.NEXT_PUBLIC_SITE_URL;
}
