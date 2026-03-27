import assert from "node:assert/strict";
import test from "node:test";
import type { TestContext } from "node:test";
import { prisma } from "@property-lk/db/client";
import {
  handleSaveListingRequest,
  handleUnsaveListingRequest
} from "../../app/api/saved-listings/handlers";

async function getActiveListingId(t: TestContext) {
  try {
    const listing = await prisma.listing.findFirst({
      where: {
        availabilityStatus: "ACTIVE",
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (!listing) {
      t.skip("No active listing is available for integration tests.");
      return null;
    }

    return listing.id;
  } catch (error) {
    t.skip(`Database is unavailable for integration tests: ${String(error)}`);
    return null;
  }
}

async function createTemporaryUser() {
  return prisma.user.create({
    data: {
      email: `saved-listings-${Date.now()}-${Math.random().toString(16).slice(2)}@propertylk.test`,
      name: "Saved Listings Test User",
      role: "USER"
    },
    select: {
      id: true
    }
  });
}

function createJsonRequest(method: "POST" | "DELETE", body: Record<string, unknown>) {
  return new Request("http://localhost/api/saved-listings", {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

test("rejects unauthenticated save attempts", async (t) => {
  const listingId = await getActiveListingId(t);

  if (!listingId) {
    return;
  }

  const response = await handleSaveListingRequest({
    userId: null,
    request: createJsonRequest("POST", { listingId })
  });

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Authentication is required to save a listing."
  });
});

test("saves a listing for an authenticated user", async (t) => {
  const listingId = await getActiveListingId(t);

  if (!listingId) {
    return;
  }

  const user = await createTemporaryUser();

  t.after(async () => {
    await prisma.savedListing.deleteMany({
      where: {
        userId: user.id
      }
    });

    await prisma.listing.updateMany({
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

    await prisma.user.delete({
      where: {
        id: user.id
      }
    });
  });

  const response = await handleSaveListingRequest({
    userId: user.id,
    request: createJsonRequest("POST", { listingId })
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    listingId,
    saved: true
  });

  const savedListing = await prisma.savedListing.findUnique({
    where: {
      userId_listingId: {
        userId: user.id,
        listingId
      }
    }
  });

  assert.ok(savedListing);
});

test("unsaves a listing for an authenticated user", async (t) => {
  const listingId = await getActiveListingId(t);

  if (!listingId) {
    return;
  }

  const user = await createTemporaryUser();

  await prisma.savedListing.create({
    data: {
      userId: user.id,
      listingId
    }
  });

  t.after(async () => {
    await prisma.savedListing.deleteMany({
      where: {
        userId: user.id
      }
    });

    await prisma.user.delete({
      where: {
        id: user.id
      }
    });
  });

  const response = await handleUnsaveListingRequest({
    userId: user.id,
    request: createJsonRequest("DELETE", { listingId })
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    listingId,
    saved: false
  });

  const savedListing = await prisma.savedListing.findUnique({
    where: {
      userId_listingId: {
        userId: user.id,
        listingId
      }
    }
  });

  assert.equal(savedListing, null);
});
