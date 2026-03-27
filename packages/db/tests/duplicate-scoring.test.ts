import test from "node:test";
import assert from "node:assert/strict";
import { buildDuplicateClusters, scoreDuplicatePair, type DuplicateDetectionListing } from "../src/duplicates";

function createListing(overrides: Partial<DuplicateDetectionListing>): DuplicateDetectionListing {
  return {
    id: overrides.id ?? "listing-a",
    publicId: overrides.publicId ?? "PLK-1001",
    slug: overrides.slug ?? "listing-a",
    title: overrides.title ?? "Bright apartment in Rajagiriya",
    priceLkr: overrides.priceLkr ?? 180000,
    listingType: overrides.listingType ?? "RENT",
    propertyType: overrides.propertyType ?? "APARTMENT",
    contactPhone: overrides.contactPhone ?? "+94 77 700 0002",
    contactWhatsapp: overrides.contactWhatsapp ?? "+94 77 700 0002",
    location: overrides.location ?? {
      id: "loc-rajagiriya",
      areaName: "Rajagiriya",
      city: "Rajagiriya",
      district: "Colombo"
    },
    images: overrides.images ?? [{ id: "image-a", perceptualHash: "hash-1" }]
  };
}

test("scoreDuplicatePair gives a strong score for obvious duplicates", () => {
  const left = createListing({});
  const right = createListing({
    id: "listing-b",
    publicId: "PLK-1002",
    slug: "listing-b",
    title: "Bright apartment for rent in Rajagiriya",
    priceLkr: 185000
  });

  const result = scoreDuplicatePair(left, right);

  assert.ok(result.score >= 0.8);
  assert.deepEqual(
    result.reasons.map((reason) => reason.code),
    [
      "phone_match",
      "title_similarity",
      "price_similarity",
      "location_similarity",
      "image_hash_match"
    ]
  );
});

test("scoreDuplicatePair stays below threshold for weak matches", () => {
  const left = createListing({});
  const right = createListing({
    id: "listing-c",
    publicId: "PLK-1003",
    slug: "listing-c",
    title: "Residential land in Mount Lavinia",
    priceLkr: 9500000,
    propertyType: "LAND",
    contactPhone: "+94 77 700 0015",
    contactWhatsapp: "+94 77 700 0015",
    location: {
      id: "loc-mount-lavinia",
      areaName: "Mount Lavinia",
      city: "Mount Lavinia",
      district: "Colombo"
    },
    images: [{ id: "image-c", perceptualHash: "hash-9" }]
  });

  const result = scoreDuplicatePair(left, right);

  assert.ok(result.score < 0.63);
  assert.equal(result.reasons.some((reason) => reason.code === "phone_match"), false);
});

test("buildDuplicateClusters groups linked duplicate pairs into one cluster", () => {
  const listingA = createListing({ id: "listing-a", publicId: "PLK-1101" });
  const listingB = createListing({
    id: "listing-b",
    publicId: "PLK-1102",
    title: "Bright apartment for rent in Rajagiriya",
    priceLkr: 182000
  });
  const listingC = createListing({
    id: "listing-c",
    publicId: "PLK-1103",
    title: "Rajagiriya bright apartment rental",
    priceLkr: 178000
  });
  const listingD = createListing({
    id: "listing-d",
    publicId: "PLK-1104",
    slug: "listing-d",
    title: "Family house in Nugegoda",
    priceLkr: 325000,
    propertyType: "HOUSE",
    contactPhone: "+94 77 700 0099",
    contactWhatsapp: "+94 77 700 0099",
    location: {
      id: "loc-nugegoda",
      areaName: "Nugegoda",
      city: "Nugegoda",
      district: "Colombo"
    },
    images: [{ id: "image-d", perceptualHash: "hash-8" }]
  });

  const clusters = buildDuplicateClusters([listingA, listingB, listingC, listingD]);

  assert.equal(clusters.length, 1);
  assert.deepEqual(clusters[0]?.listingIds, ["listing-a", "listing-b", "listing-c"]);
  assert.equal(clusters[0]?.items.length, 3);
});

test("scoreDuplicatePair still works when perceptual hashes are missing", () => {
  const left = createListing({
    images: [{ id: "image-a", perceptualHash: undefined }]
  });
  const right = createListing({
    id: "listing-b",
    publicId: "PLK-1202",
    slug: "listing-b",
    title: "Bright apartment for rent in Rajagiriya",
    priceLkr: 180000,
    images: []
  });

  const result = scoreDuplicatePair(left, right);

  assert.ok(result.score >= 0.7);
  assert.equal(result.reasons.some((reason) => reason.code === "image_hash_match"), false);
});
