import {
  type AvailabilityStatus,
  type FurnishingLevel,
  type ListedByType,
  type ListingType,
  type Prisma,
  type PropertyType
} from "@prisma/client";
import { buildListingSearchQuery } from "@property-lk/search";
import type { AdminDuplicateClusterStatus } from "@property-lk/types";
import type { NormalizedListingSearchFilters } from "@property-lk/types";
import type { DuplicateReason } from "../duplicates";
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

export type SavedSearchSummary = {
  id: string;
  name: string;
  alertEnabled: boolean;
  alertFrequency: string;
  createdAt: Date;
  updatedAt: Date;
  searchParams: NormalizedListingSearchFilters;
};

export type InquiryListItem = {
  id: string;
  listingId: string;
  listingSlug: string;
  listingTitle: string;
  listingLocationLabel: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  preferredContactMethod?: string;
  status: "NEW" | "CONTACTED" | "CLOSED" | "SPAM";
  createdAt: Date;
};

export type AdminListingStatusFilter = "pending" | "approved" | "rejected";

export type AdminListingModerationStatus =
  | AdminListingStatusFilter
  | "draft"
  | "expired"
  | "archived";

export type AdminListingListItem = ListingSummary & {
  moderationStatus: AdminListingModerationStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  inquiryCount: number;
  qualityScore: number;
  trustScore: number;
  listedByType: ListingDetail["listedByType"];
  owner?: {
    id: string;
    name?: string;
    email: string;
  };
  agent?: {
    id: string;
    name?: string;
    email: string;
  };
};

export type AdminListingDetail = ListingDetail & {
  moderationStatus: AdminListingModerationStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  inquiryCount: number;
  qualityScore: number;
  trustScore: number;
  owner?: {
    id: string;
    name?: string;
    email: string;
  };
  agent?: {
    id: string;
    name?: string;
    email: string;
  };
  verifications: Array<{
    id: string;
    verificationType: string;
    verificationStatus: string;
    notes?: string;
    verifiedAt?: Date;
    expiresAt?: Date;
  }>;
  versions: Array<{
    id: string;
    versionNumber: number;
    changeSummary?: string;
    changedByUserId?: string;
    createdAt: Date;
  }>;
};

export type AdminInquiryStatusFilter = InquiryListItem["status"];

export type AdminInquiryListItem = InquiryListItem & {
  updatedAt: Date;
  source?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    role: AuthUser["role"];
  };
};

export type AdminInquiryDetail = AdminInquiryListItem & {
  listingPublicId: string;
  listingStatus: AdminListingModerationStatus;
  user?: {
    id: string;
    name?: string;
    email: string;
    role: AuthUser["role"];
  };
};

export type AdminDashboardStats = {
  pendingListings: number;
  approvedListings: number;
  rejectedListings: number;
  newInquiries: number;
};

export type AdminDuplicateClusterItem = {
  id: string;
  listingId: string;
  matchScore: number;
  matchReasons: DuplicateReason[];
  listing: {
    id: string;
    publicId: string;
    slug: string;
    title: string;
    priceLkr: number;
    contactPhone?: string;
    contactWhatsapp?: string;
    locationLabel: string;
    primaryImageUrl?: string;
  };
};

export type AdminDuplicateCluster = {
  id: string;
  clusterKey: string;
  confidenceScore: number;
  status: AdminDuplicateClusterStatus;
  reviewedAt?: Date;
  createdAt: Date;
  reviewedBy?: {
    id: string;
    name?: string;
    email: string;
  };
  items: AdminDuplicateClusterItem[];
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

const adminListingListSelect = {
  ...listingSummarySelect,
  availabilityStatus: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  inquiryCount: true,
  qualityScore: true,
  trustScore: true,
  listedByType: true,
  owner: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  agent: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
} satisfies Prisma.ListingSelect;

const adminListingDetailSelect = {
  ...listingDetailSelect,
  availabilityStatus: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  inquiryCount: true,
  qualityScore: true,
  trustScore: true,
  owner: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  agent: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  verifications: {
    orderBy: [{ createdAt: "desc" }, { verificationType: "asc" }],
    select: {
      id: true,
      verificationType: true,
      verificationStatus: true,
      notes: true,
      verifiedAt: true,
      expiresAt: true
    }
  },
  versions: {
    orderBy: {
      versionNumber: "desc"
    },
    take: 5,
    select: {
      id: true,
      versionNumber: true,
      changeSummary: true,
      changedByUserId: true,
      createdAt: true
    }
  }
} satisfies Prisma.ListingSelect;

const adminInquirySelect = {
  id: true,
  listingId: true,
  userId: true,
  name: true,
  email: true,
  phone: true,
  message: true,
  preferredContactMethod: true,
  status: true,
  source: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  },
  listing: {
    select: {
      publicId: true,
      slug: true,
      title: true,
      availabilityStatus: true,
      primaryLocation: {
        select: {
          areaName: true,
          city: true,
          district: true
        }
      }
    }
  }
} satisfies Prisma.InquirySelect;

type AdminListingListRecord = Prisma.ListingGetPayload<{
  select: typeof adminListingListSelect;
}>;

type AdminListingDetailRecord = Prisma.ListingGetPayload<{
  select: typeof adminListingDetailSelect;
}>;

type AdminInquiryRecord = Prisma.InquiryGetPayload<{
  select: typeof adminInquirySelect;
}>;

const adminDuplicateClusterSelect = {
  id: true,
  clusterKey: true,
  confidenceScore: true,
  status: true,
  reviewedAt: true,
  createdAt: true,
  reviewedByUserId: true,
  items: {
    orderBy: [{ matchScore: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      listingId: true,
      matchScore: true,
      matchReasonsJson: true,
      listing: {
        select: {
          id: true,
          publicId: true,
          slug: true,
          title: true,
          priceLkr: true,
          contactPhone: true,
          contactWhatsapp: true,
          primaryLocation: {
            select: {
              areaName: true,
              city: true,
              district: true
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
        }
      }
    }
  }
} satisfies Prisma.DuplicateClusterSelect;

type AdminDuplicateClusterRecord = Prisma.DuplicateClusterGetPayload<{
  select: typeof adminDuplicateClusterSelect;
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

export async function listSavedSearches(userId: string): Promise<SavedSearchSummary[]> {
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      userId
    },
    orderBy: [
      {
        updatedAt: "desc"
      },
      {
        createdAt: "desc"
      }
    ],
    select: {
      id: true,
      name: true,
      alertEnabled: true,
      alertFrequency: true,
      createdAt: true,
      updatedAt: true,
      searchParamsJson: true
    }
  });

  return savedSearches.map((savedSearch) => ({
    id: savedSearch.id,
    name: savedSearch.name,
    alertEnabled: savedSearch.alertEnabled,
    alertFrequency: savedSearch.alertFrequency,
    createdAt: savedSearch.createdAt,
    updatedAt: savedSearch.updatedAt,
    searchParams: savedSearch.searchParamsJson as NormalizedListingSearchFilters
  }));
}

export async function listInquiriesForUser(userId: string): Promise<InquiryListItem[]> {
  const inquiries = await prisma.inquiry.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      listingId: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      preferredContactMethod: true,
      status: true,
      createdAt: true,
      listing: {
        select: {
          slug: true,
          title: true,
          primaryLocation: {
            select: {
              areaName: true,
              city: true,
              district: true
            }
          }
        }
      }
    }
  });

  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    listingId: inquiry.listingId,
    listingSlug: inquiry.listing.slug,
    listingTitle: inquiry.listing.title,
    listingLocationLabel: buildLocationLabel(
      inquiry.listing.primaryLocation.areaName,
      inquiry.listing.primaryLocation.city,
      inquiry.listing.primaryLocation.district
    ),
    name: inquiry.name ?? undefined,
    email: inquiry.email ?? undefined,
    phone: inquiry.phone ?? undefined,
    message: inquiry.message ?? undefined,
    preferredContactMethod: inquiry.preferredContactMethod ?? undefined,
    status: inquiry.status,
    createdAt: inquiry.createdAt
  }));
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [pendingListings, approvedListings, rejectedListings, newInquiries] = await prisma.$transaction([
    prisma.listing.count({
      where: {
        deletedAt: null,
        availabilityStatus: "PENDING_REVIEW"
      }
    }),
    prisma.listing.count({
      where: {
        deletedAt: null,
        availabilityStatus: "ACTIVE"
      }
    }),
    prisma.listing.count({
      where: {
        deletedAt: null,
        availabilityStatus: "REJECTED"
      }
    }),
    prisma.inquiry.count({
      where: {
        status: "NEW"
      }
    })
  ]);

  return {
    pendingListings,
    approvedListings,
    rejectedListings,
    newInquiries
  };
}

export async function listAdminListings(
  status?: AdminListingStatusFilter
): Promise<AdminListingListItem[]> {
  const listings = await prisma.listing.findMany({
    where: {
      deletedAt: null,
      ...(status ? { availabilityStatus: mapAdminListingFilterToAvailabilityStatus(status) } : {})
    },
    orderBy: [
      {
        updatedAt: "desc"
      },
      {
        createdAt: "desc"
      }
    ],
    select: adminListingListSelect
  });

  return listings.map(mapAdminListingListItem);
}

export async function getAdminListingByIdentifier(
  identifier: string
): Promise<AdminListingDetail | null> {
  const listing = await prisma.listing.findFirst({
    where: {
      deletedAt: null,
      OR: [{ id: identifier }, { publicId: identifier }, { slug: identifier }]
    },
    select: adminListingDetailSelect
  });

  return listing ? mapAdminListingDetail(listing) : null;
}

export async function listAdminInquiries(
  status?: AdminInquiryStatusFilter
): Promise<AdminInquiryListItem[]> {
  const inquiries = await prisma.inquiry.findMany({
    where: {
      ...(status ? { status } : {})
    },
    orderBy: [
      {
        createdAt: "desc"
      },
      {
        updatedAt: "desc"
      }
    ],
    select: adminInquirySelect
  });

  return inquiries.map(mapAdminInquiry);
}

export async function getAdminInquiryById(id: string): Promise<AdminInquiryDetail | null> {
  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id
    },
    select: adminInquirySelect
  });

  return inquiry ? mapAdminInquiry(inquiry) : null;
}

export async function listAdminDuplicateClusters(
  status?: AdminDuplicateClusterStatus
): Promise<AdminDuplicateCluster[]> {
  const [clusters, reviewedByUserIds] = await prisma.$transaction(async (tx) => {
    const foundClusters = await tx.duplicateCluster.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ confidenceScore: "desc" }, { createdAt: "desc" }],
      select: adminDuplicateClusterSelect
    });

    return [
      foundClusters,
      Array.from(
        new Set(
          foundClusters
            .map((cluster) => cluster.reviewedByUserId)
            .filter((reviewedByUserId): reviewedByUserId is string => Boolean(reviewedByUserId))
        )
      )
    ] as const;
  });

  const reviewers =
    reviewedByUserIds.length === 0
      ? []
      : await prisma.user.findMany({
          where: {
            id: {
              in: reviewedByUserIds
            }
          },
          select: {
            id: true,
            name: true,
            email: true
          }
        });

  const reviewerById = new Map(reviewers.map((reviewer) => [reviewer.id, reviewer]));

  return clusters.map((cluster) => mapAdminDuplicateCluster(cluster, reviewerById));
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

function mapAdminListingListItem(listing: AdminListingListRecord): AdminListingListItem {
  return {
    ...mapListingSummary(listing),
    moderationStatus: mapAvailabilityStatus(listing.availabilityStatus),
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    publishedAt: listing.publishedAt ?? undefined,
    inquiryCount: listing.inquiryCount,
    qualityScore: listing.qualityScore,
    trustScore: listing.trustScore,
    listedByType: mapListedByType(listing.listedByType),
    owner: listing.owner
      ? {
          id: listing.owner.id,
          name: listing.owner.name ?? undefined,
          email: listing.owner.email
        }
      : undefined,
    agent: listing.agent
      ? {
          id: listing.agent.id,
          name: listing.agent.name ?? undefined,
          email: listing.agent.email
        }
      : undefined
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

function mapAdminListingDetail(listing: AdminListingDetailRecord): AdminListingDetail {
  return {
    ...mapListingDetail(listing),
    moderationStatus: mapAvailabilityStatus(listing.availabilityStatus),
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    publishedAt: listing.publishedAt ?? undefined,
    inquiryCount: listing.inquiryCount,
    qualityScore: listing.qualityScore,
    trustScore: listing.trustScore,
    owner: listing.owner
      ? {
          id: listing.owner.id,
          name: listing.owner.name ?? undefined,
          email: listing.owner.email
        }
      : undefined,
    agent: listing.agent
      ? {
          id: listing.agent.id,
          name: listing.agent.name ?? undefined,
          email: listing.agent.email
        }
      : undefined,
    verifications: listing.verifications.map((verification) => ({
      id: verification.id,
      verificationType: verification.verificationType,
      verificationStatus: verification.verificationStatus,
      notes: verification.notes ?? undefined,
      verifiedAt: verification.verifiedAt ?? undefined,
      expiresAt: verification.expiresAt ?? undefined
    })),
    versions: listing.versions.map((version) => ({
      id: version.id,
      versionNumber: version.versionNumber,
      changeSummary: version.changeSummary ?? undefined,
      changedByUserId: version.changedByUserId ?? undefined,
      createdAt: version.createdAt
    }))
  };
}

function mapAdminInquiry(inquiry: AdminInquiryRecord): AdminInquiryDetail {
  return {
    id: inquiry.id,
    listingId: inquiry.listingId,
    listingPublicId: inquiry.listing.publicId,
    listingSlug: inquiry.listing.slug,
    listingTitle: inquiry.listing.title,
    listingLocationLabel: buildLocationLabel(
      inquiry.listing.primaryLocation.areaName,
      inquiry.listing.primaryLocation.city,
      inquiry.listing.primaryLocation.district
    ),
    name: inquiry.name ?? undefined,
    email: inquiry.email ?? undefined,
    phone: inquiry.phone ?? undefined,
    message: inquiry.message ?? undefined,
    preferredContactMethod: inquiry.preferredContactMethod ?? undefined,
    status: inquiry.status,
    source: inquiry.source ?? undefined,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt,
    listingStatus: mapAvailabilityStatus(inquiry.listing.availabilityStatus),
    user: inquiry.user
      ? {
          id: inquiry.user.id,
          name: inquiry.user.name ?? undefined,
          email: inquiry.user.email,
          role: inquiry.user.role
        }
      : undefined
  };
}

function mapAdminDuplicateCluster(
  cluster: AdminDuplicateClusterRecord,
  reviewerById: Map<string, { id: string; name: string | null; email: string }>
): AdminDuplicateCluster {
  return {
    id: cluster.id,
    clusterKey: cluster.clusterKey,
    confidenceScore: cluster.confidenceScore,
    status: cluster.status as AdminDuplicateClusterStatus,
    reviewedAt: cluster.reviewedAt ?? undefined,
    createdAt: cluster.createdAt,
    reviewedBy: cluster.reviewedByUserId
      ? {
          id: cluster.reviewedByUserId,
          name: reviewerById.get(cluster.reviewedByUserId)?.name ?? undefined,
          email: reviewerById.get(cluster.reviewedByUserId)?.email ?? ""
        }
      : undefined,
    items: cluster.items.map((item) => ({
      id: item.id,
      listingId: item.listingId,
      matchScore: item.matchScore,
      matchReasons: mapDuplicateReasons(item.matchReasonsJson),
      listing: {
        id: item.listing.id,
        publicId: item.listing.publicId,
        slug: item.listing.slug,
        title: item.listing.title,
        priceLkr: item.listing.priceLkr,
        contactPhone: item.listing.contactPhone ?? undefined,
        contactWhatsapp: item.listing.contactWhatsapp ?? undefined,
        locationLabel: buildLocationLabel(
          item.listing.primaryLocation.areaName,
          item.listing.primaryLocation.city,
          item.listing.primaryLocation.district
        ),
        primaryImageUrl: item.listing.images[0]?.imageUrl
      }
    }))
  };
}

function mapDuplicateReasons(value: Prisma.JsonValue | null): DuplicateReason[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((reason) => {
    if (
      !reason ||
      typeof reason !== "object" ||
      !("code" in reason) ||
      !("label" in reason) ||
      !("score" in reason) ||
      !("detail" in reason)
    ) {
      return [];
    }

    const record = reason as {
      code: string;
      label: string;
      score: number;
      detail: string;
    };

    if (
      typeof record.code !== "string" ||
      typeof record.label !== "string" ||
      typeof record.score !== "number" ||
      typeof record.detail !== "string"
    ) {
      return [];
    }

    return [
      {
        code: record.code as DuplicateReason["code"],
        label: record.label,
        score: record.score,
        detail: record.detail
      }
    ];
  });
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

function mapAvailabilityStatus(value: AvailabilityStatus): AdminListingModerationStatus {
  switch (value) {
    case "PENDING_REVIEW":
      return "pending";
    case "ACTIVE":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "DRAFT":
      return "draft";
    case "EXPIRED":
      return "expired";
    case "ARCHIVED":
      return "archived";
    default:
      return "draft";
  }
}

function mapAdminListingFilterToAvailabilityStatus(
  value: AdminListingStatusFilter
): AvailabilityStatus {
  switch (value) {
    case "pending":
      return "PENDING_REVIEW";
    case "approved":
      return "ACTIVE";
    case "rejected":
      return "REJECTED";
  }
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
