export type ModerationQueueItem = {
  id: string;
  listingId: string;
  reason: string;
  status: "PENDING" | "REVIEWED" | "ESCALATED";
  confidence?: number;
};

export const adminListingModerationActions = [
  "approve",
  "reject",
  "expire",
  "archive"
] as const;

export type AdminListingModerationAction = (typeof adminListingModerationActions)[number];

export const adminListingVerificationFields = ["phone", "owner", "agency"] as const;

export type AdminListingVerificationField = (typeof adminListingVerificationFields)[number];

export const adminInquiryStatuses = ["NEW", "CONTACTED", "CLOSED", "SPAM"] as const;

export type AdminInquiryStatus = (typeof adminInquiryStatuses)[number];

export const adminDuplicateClusterStatuses = [
  "PENDING",
  "CONFIRMED_DUPLICATE",
  "NOT_DUPLICATE",
  "MERGE_CANDIDATE"
] as const;

export type AdminDuplicateClusterStatus = (typeof adminDuplicateClusterStatuses)[number];
