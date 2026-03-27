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
