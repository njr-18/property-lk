import { listInquiriesForUser } from "@property-lk/db";

export async function getAccountInquiriesPageData(userId: string) {
  return listInquiriesForUser(userId);
}
