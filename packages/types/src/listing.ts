export type ListingCard = {
  id: string;
  slug: string;
  title: string;
  propertyType: "room" | "annex" | "house" | "apartment" | "land" | "commercial";
  listingType: "rent" | "sale";
  priceLkr: number;
  locationLabel: string;
  bedrooms?: number;
  bathrooms?: number;
  isFeatured?: boolean;
};
