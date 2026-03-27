import type { Prisma } from "@prisma/client";
import type { NormalizedListingSearchFilters } from "@property-lk/types";

const listingTypeMap = {
  rent: "RENT",
  sale: "SALE"
} as const;

const propertyTypeMap = {
  room: "ROOM",
  annex: "ANNEX",
  house: "HOUSE",
  apartment: "APARTMENT",
  land: "LAND",
  commercial: "COMMERCIAL"
} as const;

const furnishedStateMap = {
  unfurnished: "UNFURNISHED",
  "semi-furnished": "SEMI_FURNISHED",
  furnished: "FURNISHED"
} as const;

export type ListingSearchPrismaQuery = {
  where: Prisma.ListingWhereInput;
  orderBy: Prisma.ListingOrderByWithRelationInput[];
  skip: number;
  take: number;
};

export function buildListingSearchQuery(
  filters: NormalizedListingSearchFilters
): ListingSearchPrismaQuery {
  const andFilters: Prisma.ListingWhereInput[] = [
    {
      availabilityStatus: "ACTIVE",
      deletedAt: null,
      listingType: listingTypeMap[filters.listingType]
    }
  ];

  if (filters.propertyType) {
    andFilters.push({
      propertyType: propertyTypeMap[filters.propertyType]
    });
  }

  if (typeof filters.minPriceLkr === "number" || typeof filters.maxPriceLkr === "number") {
    andFilters.push({
      priceLkr: {
        ...(typeof filters.minPriceLkr === "number" ? { gte: filters.minPriceLkr } : {}),
        ...(typeof filters.maxPriceLkr === "number" ? { lte: filters.maxPriceLkr } : {})
      }
    });
  }

  if (typeof filters.bedrooms === "number") {
    andFilters.push({
      bedrooms: {
        gte: filters.bedrooms
      }
    });
  }

  if (typeof filters.bathrooms === "number") {
    andFilters.push({
      bathrooms: {
        gte: filters.bathrooms
      }
    });
  }

  if (filters.furnishedState) {
    andFilters.push({
      furnishingLevel: furnishedStateMap[filters.furnishedState]
    });
  }

  if (filters.parking === true) {
    andFilters.push({
      parkingSlots: {
        gte: 1
      }
    });
  }

  if (filters.parking === false) {
    andFilters.push({
      OR: [{ parkingSlots: null }, { parkingSlots: { lte: 0 } }]
    });
  }

  if (filters.district) {
    andFilters.push({
      primaryLocation: {
        district: {
          equals: filters.district,
          mode: "insensitive"
        }
      }
    });
  }

  if (filters.area) {
    andFilters.push({
      primaryLocation: {
        areaName: {
          equals: filters.area,
          mode: "insensitive"
        }
      }
    });
  }

  if (filters.verification.phoneVerified) {
    andFilters.push({ isPhoneVerified: true });
  }

  if (filters.verification.whatsappVerified) {
    andFilters.push({ isWhatsappVerified: true });
  }

  if (filters.verification.ownerVerified) {
    andFilters.push({ isOwnerVerified: true });
  }

  if (filters.verification.agencyVerified) {
    andFilters.push({ isAgencyVerified: true });
  }

  if (filters.query) {
    andFilters.push({
      OR: [
        {
          title: {
            contains: filters.query,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: filters.query,
            mode: "insensitive"
          }
        },
        {
          addressLine: {
            contains: filters.query,
            mode: "insensitive"
          }
        },
        {
          primaryLocation: {
            areaName: {
              contains: filters.query,
              mode: "insensitive"
            }
          }
        },
        {
          primaryLocation: {
            city: {
              contains: filters.query,
              mode: "insensitive"
            }
          }
        },
        {
          primaryLocation: {
            district: {
              contains: filters.query,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }

  return {
    where: {
      AND: andFilters
    },
    orderBy: buildListingSearchOrderBy(filters.sort),
    skip: filters.skip,
    take: filters.pageSize
  };
}

function buildListingSearchOrderBy(
  sort: NormalizedListingSearchFilters["sort"]
): Prisma.ListingOrderByWithRelationInput[] {
  switch (sort) {
    case "newest":
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
    case "price-asc":
      return [{ priceLkr: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }];
    case "price-desc":
      return [{ priceLkr: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }];
    case "recommended":
    default:
      return [
        { isFeatured: "desc" },
        { trustScore: "desc" },
        { qualityScore: "desc" },
        { freshnessScore: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" }
      ];
  }
}
