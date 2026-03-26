import type { InquiryPayload } from "@property-lk/types";

export function validateInquiry(payload: InquiryPayload) {
  return Boolean(payload.listingId && (payload.email || payload.phone));
}
