import assert from "node:assert/strict";
import test from "node:test";
import type { TestContext } from "node:test";
import { prisma } from "@property-lk/db/client";
import {
  handleCreateSavedSearch,
  handleDeleteSavedSearch,
  handleListSavedSearches,
  handleUpdateSavedSearch
} from "../../app/api/saved-searches/handlers";

async function createTemporaryUser(t: TestContext) {
  try {
    return await prisma.user.create({
      data: {
        email: `saved-searches-${Date.now()}-${Math.random().toString(16).slice(2)}@propertylk.test`,
        name: "Saved Searches Test User",
        role: "USER"
      },
      select: {
        id: true
      }
    });
  } catch (error) {
    t.skip(`Database is unavailable for integration tests: ${String(error)}`);
    return null;
  }
}

function createJsonRequest(
  method: "POST" | "PATCH",
  body: Record<string, unknown>
) {
  return new Request("http://localhost/api/saved-searches", {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

test("rejects unauthenticated saved-search creation", async () => {
  const response = await handleCreateSavedSearch({
    userId: null,
    request: createJsonRequest("POST", {
      name: "Colombo rentals",
      alertEnabled: true,
      searchParams: { listingType: "rent", district: "Colombo" }
    })
  });

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Authentication is required to save a search."
  });
});

test("creates, lists, updates, and deletes a saved search", async (t) => {
  const user = await createTemporaryUser(t);

  if (!user) {
    return;
  }

  t.after(async () => {
    await prisma.savedSearch.deleteMany({
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

  const createResponse = await handleCreateSavedSearch({
    userId: user.id,
    request: createJsonRequest("POST", {
      name: "Colombo apartments",
      alertEnabled: true,
      searchParams: {
        listingType: "rent",
        propertyType: "apartment",
        district: "Colombo"
      }
    })
  });

  assert.equal(createResponse.status, 200);
  const createPayload = await createResponse.json();
  assert.equal(createPayload.ok, true);
  assert.equal(createPayload.savedSearch.name, "Colombo apartments");

  const savedSearchId = createPayload.savedSearch.id as string;

  const listResponse = await handleListSavedSearches({
    userId: user.id
  });
  const listPayload = await listResponse.json();

  assert.equal(listResponse.status, 200);
  assert.equal(listPayload.ok, true);
  assert.equal(listPayload.results.length, 1);

  const updateResponse = await handleUpdateSavedSearch({
    userId: user.id,
    savedSearchId,
    request: createJsonRequest("PATCH", {
      name: "Colombo apartments updated",
      alertEnabled: false
    })
  });
  const updatePayload = await updateResponse.json();

  assert.equal(updateResponse.status, 200);
  assert.equal(updatePayload.savedSearch.name, "Colombo apartments updated");
  assert.equal(updatePayload.savedSearch.alertEnabled, false);

  const deleteResponse = await handleDeleteSavedSearch({
    userId: user.id,
    savedSearchId
  });

  assert.equal(deleteResponse.status, 200);
  assert.deepEqual(await deleteResponse.json(), {
    ok: true,
    savedSearchId
  });

  const savedSearch = await prisma.savedSearch.findUnique({
    where: {
      id: savedSearchId
    }
  });

  assert.equal(savedSearch, null);
});
