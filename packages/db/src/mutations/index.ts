import { Prisma } from "@prisma/client";
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
