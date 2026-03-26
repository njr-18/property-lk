export type ModerationQueueItem = {
  id: string;
  listingId: string;
  reason: string;
  status: "PENDING" | "REVIEWED" | "ESCALATED";
  confidence?: number;
};
