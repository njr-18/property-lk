import { buildCanonicalUrl, SITE_NAME } from "../links";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type ListingSchemaInput = {
  title: string;
  description: string;
  path: string;
  listingType: "rent" | "sale";
  propertyType: "room" | "annex" | "house" | "apartment" | "land" | "commercial";
  priceLkr: number;
  area: string;
  district: string;
  bedrooms?: number;
  bathrooms?: number;
  imageUrl?: string;
};

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: buildCanonicalUrl("/")
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path)
    }))
  };
}

export function buildListingSchema(input: ListingSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: input.title,
    description: input.description,
    url: buildCanonicalUrl(input.path),
    price: input.priceLkr,
    priceCurrency: "LKR",
    category: `${input.propertyType} ${input.listingType}`,
    availability: "https://schema.org/InStock",
    image: input.imageUrl ? [input.imageUrl] : undefined,
    itemOffered: {
      "@type": mapPropertySchemaType(input.propertyType),
      name: input.title,
      description: input.description,
      numberOfRooms: input.bedrooms,
      numberOfBathroomsTotal: input.bathrooms,
      address: {
        "@type": "PostalAddress",
        addressLocality: input.area,
        addressRegion: input.district,
        addressCountry: "LK"
      }
    }
  };
}

function mapPropertySchemaType(propertyType: ListingSchemaInput["propertyType"]) {
  switch (propertyType) {
    case "apartment":
      return "Apartment";
    case "house":
      return "House";
    case "land":
      return "Landform";
    case "commercial":
      return "Place";
    case "annex":
    case "room":
    default:
      return "Accommodation";
  }
}
