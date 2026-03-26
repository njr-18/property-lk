import type { ListingCard } from "@property-lk/types";

export function validateListingDraft(input: Partial<ListingCard>) {
  const issues: string[] = [];

  if (!input.title) {
    issues.push("title is required");
  }

  if (typeof input.priceLkr !== "number") {
    issues.push("priceLkr must be a number");
  }

  return {
    ok: issues.length === 0,
    issues
  } as const;
}
