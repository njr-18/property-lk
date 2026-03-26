export function calculateRankingScore(input: {
  trustScore?: number;
  freshnessScore?: number;
  qualityScore?: number;
}) {
  return (input.trustScore ?? 0) + (input.freshnessScore ?? 0) + (input.qualityScore ?? 0);
}
