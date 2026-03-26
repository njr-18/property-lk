export type SearchFilters = {
  query?: string;
  district?: string;
  city?: string;
  area?: string;
  listingType?: "rent" | "sale";
  propertyType?: string;
  minPriceLkr?: number;
  maxPriceLkr?: number;
  bedrooms?: number;
};

export type SearchResponse = {
  total: number;
  filters: SearchFilters;
  listingIds: string[];
};
