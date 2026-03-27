import type { ListingType, Prisma, PropertyType } from "@prisma/client";
import { prisma } from "../client";

export type SeoLocationSummary = {
  id: string;
  slug: string;
  areaName: string;
  district: string;
  city?: string;
  listingCount: number;
  updatedAt: Date;
};

export type AreaPageContent = {
  slug: string;
  areaName: string;
  district: string;
  city?: string;
  title: string;
  intro: string;
  metaTitle?: string;
  metaDescription?: string;
  pageType?: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  stats?: Record<string, unknown>;
  updatedAt: Date;
};

export type GuideSeoEntry = {
  slug: string;
  updatedAt: Date;
};

const seoListingSelect = {
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
  updatedAt: true,
  primaryLocation: {
    select: {
      slug: true,
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

const areaLocationSelect = {
  id: true,
  slug: true,
  areaName: true,
  district: true,
  city: true,
  areaPages: {
    where: {
      published: true
    },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      pageType: true,
      title: true,
      intro: true,
      metaTitle: true,
      metaDescription: true,
      faqJson: true,
      statsJson: true,
      updatedAt: true
    }
  },
  listings: {
    where: {
      availabilityStatus: "ACTIVE",
      deletedAt: null
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: 12,
    select: seoListingSelect
  }
} satisfies Prisma.LocationSelect;

type AreaLocationRecord = Prisma.LocationGetPayload<{
  select: typeof areaLocationSelect;
}>;

type SeoListingRecord = Prisma.ListingGetPayload<{
  select: typeof seoListingSelect;
}>;

export type SeoListingSummary = {
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
  areaSlug: string;
  district: string;
  locationLabel: string;
  primaryImageUrl?: string;
};

export async function listSeoLocations(limit = 12): Promise<SeoLocationSummary[]> {
  const locations = await prisma.location.findMany({
    where: {
      isActive: true,
      listings: {
        some: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        }
      }
    },
    orderBy: [{ areaName: "asc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      areaName: true,
      district: true,
      city: true,
      listings: {
        where: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: {
          updatedAt: true
        }
      }
    }
  });

  return locations.map((location) => ({
    id: location.id,
    slug: location.slug,
    areaName: location.areaName,
    district: location.district,
    city: location.city ?? undefined,
    listingCount: location.listings.length,
    updatedAt: location.listings[0]?.updatedAt ?? new Date()
  }));
}

export async function getAreaPageContentBySlug(slug: string): Promise<AreaPageContent | null> {
  const location = await prisma.location.findUnique({
    where: {
      slug
    },
    select: areaLocationSelect
  });

  if (!location || location.listings.length === 0) {
    return null;
  }

  return mapAreaPageContent(location);
}

export async function listAreaPageSlugs(): Promise<string[]> {
  const locations = await prisma.location.findMany({
    where: {
      isActive: true,
      listings: {
        some: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        }
      }
    },
    select: {
      slug: true
    }
  });

  return locations.map((location) => location.slug);
}

export async function listAreaListingsBySlug(slug: string, take = 12): Promise<SeoListingSummary[]> {
  const listings = await prisma.listing.findMany({
    where: {
      availabilityStatus: "ACTIVE",
      deletedAt: null,
      primaryLocation: {
        slug
      }
    },
    orderBy: [{ isFeatured: "desc" }, { trustScore: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    take,
    select: seoListingSelect
  });

  return listings.map(mapSeoListingSummary);
}

export async function listRelatedSeoLocations(
  slug: string,
  district: string,
  limit = 4
): Promise<SeoLocationSummary[]> {
  const locations = await prisma.location.findMany({
    where: {
      slug: {
        not: slug
      },
      district: {
        equals: district,
        mode: "insensitive"
      },
      isActive: true,
      listings: {
        some: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        }
      }
    },
    orderBy: [{ areaName: "asc" }],
    take: limit,
    select: {
      id: true,
      slug: true,
      areaName: true,
      district: true,
      city: true,
      listings: {
        where: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: {
          updatedAt: true
        }
      }
    }
  });

  return locations.map((location) => ({
    id: location.id,
    slug: location.slug,
    areaName: location.areaName,
    district: location.district,
    city: location.city ?? undefined,
    listingCount: location.listings.length,
    updatedAt: location.listings[0]?.updatedAt ?? new Date()
  }));
}

export async function listActiveListingSeoEntries() {
  const listings = await prisma.listing.findMany({
    where: {
      availabilityStatus: "ACTIVE",
      deletedAt: null
    },
    select: {
      slug: true,
      updatedAt: true
    }
  });

  return listings.map((listing) => ({
    slug: listing.slug,
    updatedAt: listing.updatedAt
  }));
}

export async function listPublishedGuideSeoEntries(): Promise<GuideSeoEntry[]> {
  const guides = await prisma.guide.findMany({
    where: {
      publishedAt: {
        not: null
      }
    },
    select: {
      slug: true,
      updatedAt: true
    }
  });

  return guides.map((guide) => ({
    slug: guide.slug,
    updatedAt: guide.updatedAt
  }));
}

export async function getSeoLocationBySlug(slug: string): Promise<SeoLocationSummary | null> {
  const location = await prisma.location.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      slug: true,
      areaName: true,
      district: true,
      city: true,
      listings: {
        where: {
          availabilityStatus: "ACTIVE",
          deletedAt: null
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: {
          updatedAt: true
        }
      }
    }
  });

  if (!location || location.listings.length === 0) {
    return null;
  }

  return {
    id: location.id,
    slug: location.slug,
    areaName: location.areaName,
    district: location.district,
    city: location.city ?? undefined,
    listingCount: location.listings.length,
    updatedAt: location.listings[0]?.updatedAt ?? new Date()
  };
}

function mapAreaPageContent(location: AreaLocationRecord): AreaPageContent {
  const publishedPage = location.areaPages[0];

  return {
    slug: location.slug,
    areaName: location.areaName,
    district: location.district,
    city: location.city ?? undefined,
    title: publishedPage?.title ?? `Property in ${location.areaName}`,
    intro:
      publishedPage?.intro ??
      `${location.areaName} offers active property options across rentals and sales within ${location.district} District.`,
    metaTitle: publishedPage?.metaTitle ?? undefined,
    metaDescription: publishedPage?.metaDescription ?? undefined,
    pageType: publishedPage?.pageType ?? undefined,
    faq: mapFaqItems(publishedPage?.faqJson),
    stats: mapStatsRecord(publishedPage?.statsJson),
    updatedAt: publishedPage?.updatedAt ?? location.listings[0]?.updatedAt ?? new Date()
  };
}

function mapSeoListingSummary(
  listing: SeoListingRecord
): SeoListingSummary {
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
    areaSlug: listing.primaryLocation.slug,
    district: listing.primaryLocation.district,
    locationLabel: buildLocationLabel(
      listing.primaryLocation.areaName,
      listing.primaryLocation.city,
      listing.primaryLocation.district
    ),
    primaryImageUrl: listing.images[0]?.imageUrl
  };
}

function buildLocationLabel(area: string, city: string | null, district: string) {
  const parts = [area, city, district].filter(
    (part, index, values) => Boolean(part) && values.indexOf(part) === index
  );

  return parts.join(", ");
}

function mapListingType(value: ListingType): SeoListingSummary["listingType"] {
  return value === "RENT" ? "rent" : "sale";
}

function mapPropertyType(value: PropertyType): SeoListingSummary["propertyType"] {
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

function mapFaqItems(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || !("question" in item) || !("answer" in item)) {
      return [];
    }

    const question = item.question;
    const answer = item.answer;

    if (typeof question !== "string" || typeof answer !== "string") {
      return [];
    }

    return [{ question, answer }];
  });
}

function mapStatsRecord(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  return Object.fromEntries(Object.entries(value)) as Record<string, unknown>;
}
