import { Prisma, type AvailabilityStatus, type InquiryStatus } from "@prisma/client";
import type { AdminDuplicateClusterStatus } from "@property-lk/types";
import { prisma } from "../client";

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  name?: string;
};

export type SavedListingMutationResult = {
  listingId: string;
  saved: boolean;
};

export type CreateSavedSearchInput = {
  userId: string;
  name: string;
  searchParamsJson: Prisma.InputJsonValue;
  alertEnabled: boolean;
};

export type UpdateSavedSearchInput = {
  userId: string;
  savedSearchId: string;
  name?: string;
  alertEnabled?: boolean;
};

export type CreateInquiryInput = {
  listingId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredContactMethod: string;
  source?: string;
};

export type UpdateListingModerationInput = {
  listingId: string;
  status: AvailabilityStatus;
  changedByUserId: string;
  changeSummary: string;
};

export type UpdateListingVerificationInput = {
  listingId: string;
  changedByUserId: string;
  phoneVerified: boolean;
  ownerVerified: boolean;
  agencyVerified: boolean;
};

export type UpdateInquiryStatusInput = {
  inquiryId: string;
  status: InquiryStatus;
};

export type UpdateDuplicateClusterStatusInput = {
  clusterId: string;
  status: AdminDuplicateClusterStatus;
  reviewedByUserId: string;
};

export async function createUser(input: CreateUserInput) {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
      role: "USER"
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true
    }
  });
}

export async function saveListingForUser(
  userId: string,
  listingId: string
): Promise<SavedListingMutationResult> {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findFirst({
      where: {
        id: listingId,
        availabilityStatus: "ACTIVE",
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (!listing) {
      throw new Error("LISTING_NOT_FOUND");
    }

    const existing = await tx.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId
        }
      },
      select: {
        id: true
      }
    });

    if (existing) {
      return {
        listingId,
        saved: true
      };
    }

    await tx.savedListing.create({
      data: {
        userId,
        listingId
      }
    });

    await tx.listing.update({
      where: {
        id: listingId
      },
      data: {
        favoriteCount: {
          increment: 1
        }
      }
    });

    return {
      listingId,
      saved: true
    };
  });
}

export async function unsaveListingForUser(
  userId: string,
  listingId: string
): Promise<SavedListingMutationResult> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId
        }
      },
      select: {
        id: true
      }
    });

    if (!existing) {
      return {
        listingId,
        saved: false
      };
    }

    await tx.savedListing.delete({
      where: {
        userId_listingId: {
          userId,
          listingId
        }
      }
    });

    await tx.listing.updateMany({
      where: {
        id: listingId,
        favoriteCount: {
          gt: 0
        }
      },
      data: {
        favoriteCount: {
          decrement: 1
        }
      }
    });

    return {
      listingId,
      saved: false
    };
  });
}

export function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createSavedSearch(input: CreateSavedSearchInput) {
  return prisma.savedSearch.create({
    data: {
      userId: input.userId,
      name: input.name,
      searchParamsJson: input.searchParamsJson,
      alertEnabled: input.alertEnabled
    },
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
}

export async function updateSavedSearch(input: UpdateSavedSearchInput) {
  const savedSearch = await prisma.savedSearch.findFirst({
    where: {
      id: input.savedSearchId,
      userId: input.userId
    },
    select: {
      id: true
    }
  });

  if (!savedSearch) {
    throw new Error("SAVED_SEARCH_NOT_FOUND");
  }

  return prisma.savedSearch.update({
    where: {
      id: input.savedSearchId
    },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.alertEnabled !== undefined ? { alertEnabled: input.alertEnabled } : {})
    },
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
}

export async function deleteSavedSearch(userId: string, savedSearchId: string) {
  const savedSearch = await prisma.savedSearch.findFirst({
    where: {
      id: savedSearchId,
      userId
    },
    select: {
      id: true
    }
  });

  if (!savedSearch) {
    throw new Error("SAVED_SEARCH_NOT_FOUND");
  }

  await prisma.savedSearch.delete({
    where: {
      id: savedSearchId
    }
  });
}

export async function createInquiry(input: CreateInquiryInput) {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findFirst({
      where: {
        id: input.listingId,
        availabilityStatus: "ACTIVE",
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (!listing) {
      throw new Error("LISTING_NOT_FOUND");
    }

    const inquiry = await tx.inquiry.create({
      data: {
        listingId: input.listingId,
        userId: input.userId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        preferredContactMethod: input.preferredContactMethod,
        source: input.source
      },
      select: {
        id: true,
        listingId: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        preferredContactMethod: true,
        status: true,
        createdAt: true
      }
    });

    await tx.listing.update({
      where: {
        id: input.listingId
      },
      data: {
        inquiryCount: {
          increment: 1
        }
      }
    });

    return inquiry;
  });
}

export async function updateListingModerationStatus(input: UpdateListingModerationInput) {
  return prisma.$transaction(async (tx) => {
    const existingListing = await tx.listing.findFirst({
      where: {
        id: input.listingId,
        deletedAt: null
      },
      select: listingVersionSnapshotSelect
    });

    if (!existingListing) {
      throw new Error("LISTING_NOT_FOUND");
    }

    const now = new Date();
    const updatedListing = await tx.listing.update({
      where: {
        id: input.listingId
      },
      data: {
        availabilityStatus: input.status,
        ...(input.status === "ACTIVE"
          ? {
              publishedAt: existingListing.publishedAt ?? now,
              expiresAt: null
            }
          : {}),
        ...(input.status === "EXPIRED"
          ? {
              expiresAt: now
            }
          : {})
      },
      select: listingVersionSnapshotSelect
    });

    await createListingVersion(tx, updatedListing, input.changedByUserId, input.changeSummary);

    return {
      id: updatedListing.id,
      availabilityStatus: updatedListing.availabilityStatus
    };
  });
}

export async function updateListingVerification(input: UpdateListingVerificationInput) {
  return prisma.$transaction(async (tx) => {
    const existingListing = await tx.listing.findFirst({
      where: {
        id: input.listingId,
        deletedAt: null
      },
      select: listingVersionSnapshotSelect
    });

    if (!existingListing) {
      throw new Error("LISTING_NOT_FOUND");
    }

    const now = new Date();
    const updatedListing = await tx.listing.update({
      where: {
        id: input.listingId
      },
      data: {
        isPhoneVerified: input.phoneVerified,
        isOwnerVerified: input.ownerVerified,
        isAgencyVerified: input.agencyVerified
      },
      select: listingVersionSnapshotSelect
    });

    await syncListingVerificationRecord(
      tx,
      input.listingId,
      "phone_verified",
      input.phoneVerified,
      input.changedByUserId,
      now,
      input.phoneVerified
        ? "Phone verification updated from the admin moderation panel."
        : "Phone verification flag cleared from the admin moderation panel."
    );
    await syncListingVerificationRecord(
      tx,
      input.listingId,
      "owner_identity_verified",
      input.ownerVerified,
      input.changedByUserId,
      now,
      input.ownerVerified
        ? "Owner verification updated from the admin moderation panel."
        : "Owner verification flag cleared from the admin moderation panel."
    );
    await syncListingVerificationRecord(
      tx,
      input.listingId,
      "agency_credentials_reviewed",
      input.agencyVerified,
      input.changedByUserId,
      now,
      input.agencyVerified
        ? "Agency verification updated from the admin moderation panel."
        : "Agency verification flag cleared from the admin moderation panel."
    );

    await createListingVersion(
      tx,
      updatedListing,
      input.changedByUserId,
      "Updated listing verification flags"
    );

    return {
      id: updatedListing.id,
      isPhoneVerified: updatedListing.isPhoneVerified,
      isOwnerVerified: updatedListing.isOwnerVerified,
      isAgencyVerified: updatedListing.isAgencyVerified
    };
  });
}

export async function updateInquiryStatus(input: UpdateInquiryStatusInput) {
  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id: input.inquiryId
    },
    select: {
      id: true
    }
  });

  if (!inquiry) {
    throw new Error("INQUIRY_NOT_FOUND");
  }

  return prisma.inquiry.update({
    where: {
      id: input.inquiryId
    },
    data: {
      status: input.status
    },
    select: {
      id: true,
      status: true,
      updatedAt: true
    }
  });
}

export async function updateDuplicateClusterStatus(input: UpdateDuplicateClusterStatusInput) {
  const duplicateCluster = await prisma.duplicateCluster.findUnique({
    where: {
      id: input.clusterId
    },
    select: {
      id: true
    }
  });

  if (!duplicateCluster) {
    throw new Error("DUPLICATE_CLUSTER_NOT_FOUND");
  }

  return prisma.duplicateCluster.update({
    where: {
      id: input.clusterId
    },
    data: {
      status: input.status,
      reviewedByUserId: input.reviewedByUserId,
      reviewedAt: new Date()
    },
    select: {
      id: true,
      status: true,
      reviewedAt: true,
      reviewedByUserId: true
    }
  });
}

const listingVersionSnapshotSelect = {
  id: true,
  publicId: true,
  slug: true,
  title: true,
  priceLkr: true,
  listingType: true,
  propertyType: true,
  availabilityStatus: true,
  ownerUserId: true,
  agentUserId: true,
  primaryLocationId: true,
  publishedAt: true,
  expiresAt: true,
  isPhoneVerified: true,
  isWhatsappVerified: true,
  isOwnerVerified: true,
  isAgencyVerified: true,
  qualityScore: true,
  trustScore: true
} satisfies Prisma.ListingSelect;

type ListingVersionSnapshotRecord = Prisma.ListingGetPayload<{
  select: typeof listingVersionSnapshotSelect;
}>;

async function createListingVersion(
  tx: Prisma.TransactionClient,
  listing: ListingVersionSnapshotRecord,
  changedByUserId: string,
  changeSummary: string
) {
  const latestVersion = await tx.listingVersion.findFirst({
    where: {
      listingId: listing.id
    },
    orderBy: {
      versionNumber: "desc"
    },
    select: {
      versionNumber: true
    }
  });

  await tx.listingVersion.create({
    data: {
      listingId: listing.id,
      versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
      changedByUserId,
      changeSummary,
      snapshotJson: buildListingVersionSnapshot(listing)
    }
  });
}

function buildListingVersionSnapshot(listing: ListingVersionSnapshotRecord): Prisma.InputJsonValue {
  return {
    publicId: listing.publicId,
    slug: listing.slug,
    title: listing.title,
    priceLkr: listing.priceLkr,
    listingType: listing.listingType,
    propertyType: listing.propertyType,
    availabilityStatus: listing.availabilityStatus,
    ownerUserId: listing.ownerUserId,
    agentUserId: listing.agentUserId,
    primaryLocationId: listing.primaryLocationId,
    publishedAt: listing.publishedAt?.toISOString() ?? null,
    expiresAt: listing.expiresAt?.toISOString() ?? null,
    isPhoneVerified: listing.isPhoneVerified,
    isWhatsappVerified: listing.isWhatsappVerified,
    isOwnerVerified: listing.isOwnerVerified,
    isAgencyVerified: listing.isAgencyVerified,
    qualityScore: listing.qualityScore,
    trustScore: listing.trustScore
  };
}

async function syncListingVerificationRecord(
  tx: Prisma.TransactionClient,
  listingId: string,
  verificationType: string,
  verified: boolean,
  changedByUserId: string,
  changedAt: Date,
  notes: string
) {
  const existingRecord = await tx.listingVerification.findFirst({
    where: {
      listingId,
      verificationType
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true
    }
  });

  const data = {
    verificationStatus: verified ? "verified" : "pending",
    verifiedByUserId: verified ? changedByUserId : null,
    verifiedAt: verified ? changedAt : null,
    notes,
    expiresAt: null as Date | null
  };

  if (existingRecord) {
    await tx.listingVerification.update({
      where: {
        id: existingRecord.id
      },
      data
    });

    return;
  }

  await tx.listingVerification.create({
    data: {
      listingId,
      verificationType,
      ...data
    }
  });
}
