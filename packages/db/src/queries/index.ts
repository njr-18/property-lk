import { type FurnishingLevel, type ListedByType, type ListingType, type Prisma, type PropertyType } from "@prisma/client";
import { buildListingSearchQuery } from "@property-lk/search";
import type { NormalizedListingSearchFilters } from "@property-lk/types";
import { prisma } from "../client";

export type ListingSummary = {
  id: string;
  publicId: string;
  slug: string;
  title: string;
  description: string;
  propertyType: "room" | "annex" | "house" | "apartment" | "land" | "commercial";
  listingType: "rent" | "sale";
  priceLkr: number;
  bedrooms?: number;
  bathrooms?: number;
  featured: boolean;
  area: string;
  district: string;
  locationLabel: string;
  primaryImageUrl?: string;
};

export type AuthUser = {
  id: string;
  name?: string;
  email: string;
  role: "USER" | "AGENT" | "OWNER" | "ADMIN";
  passwordHash?: string;
};

export type ListingDetail = ListingSummary & {
  city?: string;
  addressLine?: string;
  parkingSlots?: number;
  floorAreaSqft?: number;
  landSizePerches?: number;
  furnishingLevel?: "unfurnished" | "semi-furnished" | "furnished";
  listedByType: "owner" | "agent" | "builder";
  contactName?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  images: Array<{
    id: string;
    imageUrl: string;
    altText?: string;
    isPrimary: boolean;
  }>;
  features: Array<{
    id: string;
    featureKey: string;
    featureValue: string;
  }>;
  verification: {
    phoneVerified: boolean;
    whatsappVerified: boolean;
    ownerVerified: boolean;
    agencyVerified: boolean;
  };
};

export type ListingSearchResult = {
  total: number;
  totalPages: number;
  filters: NormalizedListingSearchFilters;
  listings: ListingSummary[];
};

export type SavedListingsPage = {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  listings: ListingSummary[];
};

const listingSummarySelect = {
  id: true,
  publicId: true,
  slug: true,
  title: true,
  description: true,
  propertyType: true,
  listingType: true,
  priceLkr: true,
  bedrooms: true,
  bathrooms: true,
  isFeatured: true,
  primaryLocation: {
    select: {
      areaName: true,
      district: true,
      city: true
    }
  },
  images: {
    where: {
      isPrimary: true
    },
    orderBy: {
      sortOrder: "asc"
    },
    take: 1,
    select: {
      imageUrl: true
    }
  }
} satisfies Prisma.ListingSelect;

const listingDetailSelect = {
  ...listingSummarySelect,
  addressLine: true,
  parkingSlots: true,
  floorAreaSqft: true,
  landSizePerches: true,
  furnishingLevel: true,
  listedByType: true,
  contactName: true,
  contactPhone: true,
  contactWhatsapp: true,
  contactEmail: true,
  isPhoneVerified: true,
  isWhatsappVerified: true,
  isOwnerVerified: true,
  isAgencyVerified: true,
  images: {
    orderBy: {
      sortOrder: "asc"
    },
    select: {
      id: true,
      imageUrl: true,
      altText: true,
      isPrimary: true
    }
  },
  features: {
    orderBy: {
      featureKey: "asc"
    },
    select: {
      id: true,
      featureKey: true,
      featureValue: true
    }
  }
} satisfies Prisma.ListingSelect;

type ListingSummaryRecord = Prisma.ListingGetPayload<{
  select: typeof listingSummarySelect;
}>;

type ListingDetailRecord = Prisma.ListingGetPayload<{
  select: typeof listingDetailSelect;
}>;

type AuthUserRecord = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
    passwordHash: true;
  };
}>;

export async function searchListings(
  filters: NormalizedListingSearchFilters
): Promise<ListingSearchResult> {
  const query = buildListingSearchQuery(filters);

  const [total, listings] = await prisma.$transaction([
    prisma.listing.count({
      where: query.where
    }),
    prisma.listing.findMany({
      where: query.where,
      orderBy: query.orderBy,
      skip: query.skip,
      take: query.take,
      select: listingSummarySelect
    })
  ]);

  return {
    total,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    filters,
    listings: listings.map(mapListingSummary)
  };
}

export async function getListingBySlug(slug: string): Promise<ListingDetail | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      slug,
      availabilityStatus: "ACTIVE",
      deletedAt: null
    },
    select: listingDetailSelect
  });

  return listing ? mapListingDetail(listing) : null;
}

export async function getListingByIdentifier(identifier: string): Promise<ListingDetail | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      availabilityStatus: "ACTIVE",
      deletedAt: null,
      OR: [{ id: identifier }, { publicId: identifier }, { slug: identifier }]
    },
    select: listingDetailSelect
  });

  return listing ? mapListingDetail(listing) : null;
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true
    }
  });

  return user ? mapAuthUser(user) : null;
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true
    }
  });

  return user ? mapAuthUser(user) : null;
}

export async function getSavedListingIds(userId: string, listingIds: string[]): Promise<string[]> {
  if (listingIds.length === 0) {
    return [];
  }

  const savedListings = await prisma.savedListing.findMany({
    where: {
      userId,
      listingId: {
        in: listingIds
      }
    },
    select: {
      listingId: true
    }
  });

  return savedListings.map((savedListing) => savedListing.listingId);
}

export async function listSavedListings(
  userId: string,
  page = 1,
  pageSize = 12
): Promise<SavedListingsPage> {
  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const skip = (safePage - 1) * safePageSize;

  const [total, savedListings] = await prisma.$transaction([
    prisma.savedListing.count({
      where: {
        userId,
        listing: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        }
      }
    }),
    prisma.savedListing.findMany({
      where: {
        userId,
        listing: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: safePageSize,
      select: {
        listing: {
          select: listingSummarySelect
        }
      }
    })
  ]);

  return {
    total,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    page: safePage,
    pageSize: safePageSize,
    listings: savedListings.map((savedListing) => mapListingSummary(savedListing.listing))
  };
}

export async function getRelatedListings(
  listing: Pick<ListingDetail, "id" | "listingType" | "propertyType" | "district" | "area">,
  take = 3
): Promise<ListingSummary[]> {
  const relatedListings = await prisma.listing.findMany({
    where: {
      id: {
        not: listing.id
      },
      availabilityStatus: "ACTIVE",
      deletedAt: null,
      listingType: mapListingTypeToPrisma(listing.listingType),
      OR: [
        {
          primaryLocation: {
            areaName: {
              equals: listing.area,
              mode: "insensitive"
            }
          }
        },
        {
          propertyType: mapPropertyTypeToPrisma(listing.propertyType)
        },
        {
          primaryLocation: {
            district: {
              equals: listing.district,
              mode: "insensitive"
            }
          }
        }
      ]
    },
    orderBy: [
      {
        isFeatured: "desc"
      },
      {
        trustScore: "desc"
      },
      {
        publishedAt: "desc"
      },
      {
        createdAt: "desc"
      }
    ],
    take,
    select: listingSummarySelect
  });

  return relatedListings.map(mapListingSummary);
}

export async function listLatestListings(take = 12): Promise<ListingSummary[]> {
  const listings = await prisma.listing.findMany({
    where: {
      availabilityStatus: "ACTIVE",
      deletedAt: null
    },
    orderBy: [
      {
        isFeatured: "desc"
      },
      {
        publishedAt: "desc"
      },
      {
        createdAt: "desc"
      }
    ],
    take,
    select: listingSummarySelect
  });

  return listings.map(mapListingSummary);
}

function mapListingSummary(listing: ListingSummaryRecord): ListingSummary {
  return {
    id: listing.id,
    publicId: listing.publicId,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    propertyType: mapPropertyType(listing.propertyType),
    listingType: mapListingType(listing.listingType),
    priceLkr: listing.priceLkr,
    bedrooms: listing.bedrooms ?? undefined,
    bathrooms: listing.bathrooms ?? undefined,
    featured: listing.isFeatured,
    area: listing.primaryLocation.areaName,
    district: listing.primaryLocation.district,
    locationLabel: buildLocationLabel(
      listing.primaryLocation.areaName,
      listing.primaryLocation.city,
      listing.primaryLocation.district
    ),
    primaryImageUrl: listing.images[0]?.imageUrl
  };
}

function mapAuthUser(user: AuthUserRecord): AuthUser {
  return {
    id: user.id,
    name: user.name ?? undefined,
    email: user.email,
    role: user.role,
    passwordHash: user.passwordHash ?? undefined
  };
}

function mapListingDetail(listing: ListingDetailRecord): ListingDetail {
  return {
    ...mapListingSummary(listing),
    city: listing.primaryLocation.city ?? undefined,
    addressLine: listing.addressLine ?? undefined,
    parkingSlots: listing.parkingSlots ?? undefined,
    floorAreaSqft: listing.floorAreaSqft ?? undefined,
    landSizePerches: listing.landSizePerches ?? undefined,
    furnishingLevel: mapFurnishingLevel(listing.furnishingLevel),
    listedByType: mapListedByType(listing.listedByType),
    contactName: listing.contactName ?? undefined,
    contactPhone: listing.contactPhone ?? undefined,
    contactWhatsapp: listing.contactWhatsapp ?? undefined,
    contactEmail: listing.contactEmail ?? undefined,
    images: listing.images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText ?? undefined,
      isPrimary: image.isPrimary
    })),
    features: listing.features.map((feature) => ({
      id: feature.id,
      featureKey: feature.featureKey,
      featureValue: feature.featureValue
    })),
    verification: {
      phoneVerified: listing.isPhoneVerified,
      whatsappVerified: listing.isWhatsappVerified,
      ownerVerified: listing.isOwnerVerified,
      agencyVerified: listing.isAgencyVerified
    }
  };
}

function buildLocationLabel(area: string, city: string | null, district: string) {
  const parts = [area, city, district].filter(
    (part, index, values) => Boolean(part) && values.indexOf(part) === index
  );

  return parts.join(", ");
}

function mapListingType(value: ListingType): ListingSummary["listingType"] {
  return value === "RENT" ? "rent" : "sale";
}

function mapPropertyType(value: PropertyType): ListingSummary["propertyType"] {
  switch (value) {
    case "ROOM":
      return "room";
    case "ANNEX":
      return "annex";
    case "HOUSE":
      return "house";
    case "APARTMENT":
      return "apartment";
    case "LAND":
      return "land";
    case "COMMERCIAL":
      return "commercial";
  }
}

function mapFurnishingLevel(
  value: FurnishingLevel | null
): ListingDetail["furnishingLevel"] | undefined {
  switch (value) {
    case "UNFURNISHED":
      return "unfurnished";
    case "SEMI_FURNISHED":
      return "semi-furnished";
    case "FURNISHED":
      return "furnished";
    default:
      return undefined;
  }
}

function mapListedByType(value: ListedByType): ListingDetail["listedByType"] {
  switch (value) {
    case "OWNER":
      return "owner";
    case "AGENT":
      return "agent";
    case "BUILDER":
      return "builder";
  }
}

function mapListingTypeToPrisma(value: ListingSummary["listingType"]): ListingType {
  return value === "rent" ? "RENT" : "SALE";
}

function mapPropertyTypeToPrisma(value: ListingSummary["propertyType"]): PropertyType {
  switch (value) {
    case "room":
      return "ROOM";
    case "annex":
      return "ANNEX";
    case "house":
      return "HOUSE";
    case "apartment":
      return "APARTMENT";
    case "land":
      return "LAND";
    case "commercial":
      return "COMMERCIAL";
  }
}
