import assert from "node:assert/strict";
import test from "node:test";
import { prisma } from "../src/client";
import {
  updateDuplicateClusterStatus,
  updateListingModerationStatus
} from "../src/mutations";

async function createTemporaryAdminUser() {
  return prisma.user.create({
    data: {
      email: `admin-${Date.now()}-${Math.random().toString(16).slice(2)}@propertylk.test`,
      name: "Moderation Test Admin",
      role: "ADMIN"
    },
    select: {
      id: true
    }
  });
}

test("updateListingModerationStatus updates the listing status and records a version", async (t) => {
  let adminUser;

  try {
    adminUser = await createTemporaryAdminUser();
  } catch (error) {
    t.skip(`Database is unavailable for integration tests: ${String(error)}`);
    return;
  }

  const listing = await prisma.listing.findFirst({
    where: {
      deletedAt: null
    },
    orderBy: {
      updatedAt: "desc"
    },
    select: {
      id: true,
      availabilityStatus: true,
      publishedAt: true,
      expiresAt: true
    }
  });

  if (!listing) {
    t.skip("No listing is available for moderation mutation tests.");
    return;
  }

  const initialVersionCount = await prisma.listingVersion.count({
    where: {
      listingId: listing.id
    }
  });

  t.after(async () => {
    await prisma.listing.update({
      where: {
        id: listing.id
      },
      data: {
        availabilityStatus: listing.availabilityStatus,
        publishedAt: listing.publishedAt,
        expiresAt: listing.expiresAt
      }
    });

    await prisma.user.delete({
      where: {
        id: adminUser.id
      }
    });
  });

  const result = await updateListingModerationStatus({
    listingId: listing.id,
    status: "ARCHIVED",
    changedByUserId: adminUser.id,
    changeSummary: "Archived during integration test"
  });

  assert.equal(result.id, listing.id);
  assert.equal(result.availabilityStatus, "ARCHIVED");

  const updatedListing = await prisma.listing.findUnique({
    where: {
      id: listing.id
    },
    select: {
      availabilityStatus: true
    }
  });

  assert.equal(updatedListing?.availabilityStatus, "ARCHIVED");

  const nextVersionCount = await prisma.listingVersion.count({
    where: {
      listingId: listing.id
    }
  });

  assert.equal(nextVersionCount, initialVersionCount + 1);
});

test("updateDuplicateClusterStatus saves the review outcome", async (t) => {
  let adminUser;

  try {
    adminUser = await createTemporaryAdminUser();
  } catch (error) {
    t.skip(`Database is unavailable for integration tests: ${String(error)}`);
    return;
  }

  const cluster = await prisma.duplicateCluster.findFirst({
    orderBy: [
      {
        reviewedAt: "asc"
      },
      {
        createdAt: "desc"
      }
    ],
    select: {
      id: true,
      status: true,
      reviewedAt: true,
      reviewedByUserId: true
    }
  });

  if (!cluster) {
    t.skip("No duplicate cluster is available for moderation mutation tests.");
    return;
  }

  t.after(async () => {
    await prisma.duplicateCluster.update({
      where: {
        id: cluster.id
      },
      data: {
        status: cluster.status,
        reviewedAt: cluster.reviewedAt,
        reviewedByUserId: cluster.reviewedByUserId
      }
    });

    await prisma.user.delete({
      where: {
        id: adminUser.id
      }
    });
  });

  const result = await updateDuplicateClusterStatus({
    clusterId: cluster.id,
    status: "NOT_DUPLICATE",
    reviewedByUserId: adminUser.id
  });

  assert.equal(result.id, cluster.id);
  assert.equal(result.status, "NOT_DUPLICATE");
  assert.equal(result.reviewedByUserId, adminUser.id);
  assert.ok(result.reviewedAt instanceof Date);
});
