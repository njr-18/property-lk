export function flagSuspiciousListing(reason: string) {
  return {
    flagged: Boolean(reason),
    reason
  } as const;
}
