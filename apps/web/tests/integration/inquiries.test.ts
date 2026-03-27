import assert from "node:assert/strict";
import test from "node:test";
import type { TestContext } from "node:test";
import { prisma } from "@property-lk/db/client";
import { handleCreateInquiry } from "../../app/api/inquiries/handlers";

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
      email: `inquiries-${Date.now()}-${Math.random().toString(16).slice(2)}@propertylk.test`,
      name: "Inquiry Test User",
      role: "USER"
    },
    select: {
      id: true
    }
  });
}

function createInquiryRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `inquiry-test-${Date.now()}-${Math.random().toString(16).slice(2)}`
    },
    body: JSON.stringify(body)
  });
}

test("rejects invalid inquiry payloads", async () => {
  const response = await handleCreateInquiry({
    userId: null,
    request: createInquiryRequest({
      listingId: "",
      name: "",
      email: "bad-email",
      message: "",
      preferredContactMethod: "email"
    })
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.equal(payload.error, "Inquiry is invalid.");
  assert.ok(Array.isArray(payload.fieldErrors));
});

test("creates an inquiry for an authenticated user", async (t) => {
  const listingId = await getActiveListingId(t);

  if (!listingId) {
    return;
  }

  const user = await createTemporaryUser();

  t.after(async () => {
    await prisma.inquiry.deleteMany({
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

  const response = await handleCreateInquiry({
    userId: user.id,
    request: createInquiryRequest({
      listingId,
      name: "Test Buyer",
      email: "buyer@propertylk.test",
      phone: "+94 77 123 4567",
      message: "Is this still available next month?",
      preferredContactMethod: "whatsapp"
    })
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.ok(payload.inquiry.id);

  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id: payload.inquiry.id as string
    }
  });

  assert.ok(inquiry);
  assert.equal(inquiry?.listingId, listingId);
  assert.equal(inquiry?.userId, user.id);
  assert.equal(inquiry?.preferredContactMethod, "whatsapp");
});
