export function buildListingIndexDocument(id: string) {
  return {
    id,
    indexedAt: new Date().toISOString()
  };
}
