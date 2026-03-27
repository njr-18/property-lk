export type ListingType = "rent" | "sale";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  listingType: ListingType;
  propertyType: "room" | "annex" | "house" | "apartment" | "land" | "commercial";
  area: string;
  district: string;
  priceLkr: number;
  bedrooms?: number;
  bathrooms?: number;
  featured?: boolean;
  description: string;
};

export type Area = {
  slug: string;
  title: string;
  district: string;
  summary: string;
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
};

export const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/areas", label: "Areas" },
  { href: "/rent", label: "Rent" },
  { href: "/buy", label: "Buy" },
  { href: "/guides", label: "Guides" },
  { href: "/post-property", label: "Post Property" }
] as const;

export const mobileNavLinks = [
  { href: "/", label: "Home", description: "Overview and featured inventory" },
  { href: "/search", label: "Search", description: "Filters, cards, and comparison entry" },
  { href: "/areas", label: "Areas", description: "Local guides and linked search routes" },
  { href: "/saved/listings", label: "Saved", description: "Listings and searches in one place" },
  { href: "/account", label: "Account", description: "Profile and inquiry surfaces" }
] as const;

export const footerLinkGroups = [
  {
    title: "Explore",
    links: [
      { href: "/search", label: "Search listings" },
      { href: "/areas", label: "Browse areas" },
      { href: "/compare", label: "Compare homes" },
      { href: "/guides", label: "Read guides" }
    ]
  },
  {
    title: "Saved",
    links: [
      { href: "/saved/listings", label: "Saved listings" },
      { href: "/saved/searches", label: "Saved searches" },
      { href: "/account", label: "Account overview" }
    ]
  }
] as const;

export const listingTypeOptions = [
  { label: "Rent", value: "rent" },
  { label: "Sale", value: "sale" }
] as const;

export const propertyTypeOptions = [
  { label: "Room", value: "room" },
  { label: "Annex", value: "annex" },
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" }
] as const;

export const sampleListings: Listing[] = [
  {
    id: "lst_001",
    slug: "colombo-07-modern-apartment",
    title: "Modern apartment with skyline views",
    listingType: "rent",
    propertyType: "apartment",
    area: "Colombo 07",
    district: "Colombo",
    priceLkr: 185000,
    bedrooms: 3,
    bathrooms: 2,
    featured: true,
    description: "Bright, well-managed apartment close to schools, offices, and cafés."
  },
  {
    id: "lst_002",
    slug: "rajagiriya-family-house",
    title: "Family house on a quiet street",
    listingType: "sale",
    propertyType: "house",
    area: "Rajagiriya",
    district: "Colombo",
    priceLkr: 48500000,
    bedrooms: 4,
    bathrooms: 3,
    featured: true,
    description: "A practical home with garden space, parking, and quick access to the city."
  },
  {
    id: "lst_003",
    slug: "nugegoda-studio-room",
    title: "Furnished studio room",
    listingType: "rent",
    propertyType: "room",
    area: "Nugegoda",
    district: "Colombo",
    priceLkr: 42000,
    bedrooms: 1,
    bathrooms: 1,
    description: "Compact and walkable, ideal for a student or young professional."
  }
];

export const sampleAreas: Area[] = [
  {
    slug: "colombo-07",
    title: "Colombo 07",
    district: "Colombo",
    summary: "Premium apartments, offices, and walkable city living."
  },
  {
    slug: "rajagiriya",
    title: "Rajagiriya",
    district: "Colombo",
    summary: "Balanced family homes with easy access to the administrative district."
  },
  {
    slug: "nugegoda",
    title: "Nugegoda",
    district: "Colombo",
    summary: "Busy rental market, student demand, and everyday convenience."
  }
];

export const sampleGuides: Guide[] = [
  {
    slug: "how-to-price-a-rental",
    title: "How to price a rental listing",
    excerpt: "A simple checklist for setting an asking price with confidence.",
    body: "Compare similar homes, measure demand by area, and keep your listing photos and details complete."
  },
  {
    slug: "documents-to-verify-before-buying",
    title: "Documents to verify before buying",
    excerpt: "The essentials to review before you commit.",
    body: "Confirm ownership, approvals, and any site-specific restrictions before a deposit changes hands."
  }
];

export const siteStats = [
  { value: "1,200+", label: "Active listings" },
  { value: "25", label: "Coverage areas" },
  { value: "4.8/5", label: "Average trust score" }
];

export function getListingBySlug(slug: string) {
  return sampleListings.find((listing) => listing.slug === slug);
}

export function getListingById(id: string) {
  return sampleListings.find((listing) => listing.id === id);
}

export function getAreaBySlug(slug: string) {
  return sampleAreas.find((area) => area.slug === slug);
}

export function getGuideBySlug(slug: string) {
  return sampleGuides.find((guide) => guide.slug === slug);
}
