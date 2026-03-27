import { getSavedListingIds, listSavedListings } from "@property-lk/db";
import { getSessionUser } from "./auth";

const SAVED_LISTINGS_PAGE_SIZE = 12;

export async function getCurrentUserSavedListingIds(listingIds: string[]) {
  const user = await getSessionUser();

  if (!user) {
    return [];
  }

  return getSavedListingIdsForUser(user.id, listingIds);
}

export async function getSavedListingIdsForUser(userId: string, listingIds: string[]) {
  return getSavedListingIds(userId, listingIds);
}

export async function getSavedListingsPageData(
  userId: string,
  searchParams?: Record<string, string | string[] | undefined>
) {
  const page = normalizePageNumber(searchParams?.page);
  return listSavedListings(userId, page, SAVED_LISTINGS_PAGE_SIZE);
}

function normalizePageNumber(value: string | string[] | undefined) {
  const input = Array.isArray(value) ? value[0] : value;
  const parsed = input ? Number(input) : 1;

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}
