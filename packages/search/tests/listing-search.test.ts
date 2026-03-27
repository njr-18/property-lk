import assert from "node:assert/strict";

import { buildListingSearchQuery } from "../src/listings/query-builder.ts";
import {
  getDefaultListingSearchFilters,
  normalizeSearchFilters,
  parseListingSearchParams
} from "../../validation/src/search.ts";

run("returns MVP defaults for an empty search request", () => {
  const result = parseListingSearchParams({});

  assert.equal(result.ok, true);
  assert.deepEqual(result.issues, []);
  assert.equal(result.data.listingType, getDefaultListingSearchFilters().listingType);
  assert.equal(result.data.sort, getDefaultListingSearchFilters().sort);
  assert.equal(result.data.page, getDefaultListingSearchFilters().page);
  assert.equal(result.data.pageSize, getDefaultListingSearchFilters().pageSize);
  assert.equal(result.data.skip, getDefaultListingSearchFilters().skip);
  assert.deepEqual(result.data.verification, {
    phoneVerified: undefined,
    whatsappVerified: undefined,
    ownerVerified: undefined,
    agencyVerified: undefined
  });
});

run("normalizes user input into a stable shared search contract", () => {
  const result = parseListingSearchParams({
    district: "  colombo ",
    area: "dehiwala-mount_lavinia",
    query: "  sea   view apartment ",
    furnishedState: "semi furnished",
    parking: "yes",
    page: "3"
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.district, "Colombo");
  assert.equal(result.data.area, "Dehiwala Mount Lavinia");
  assert.equal(result.data.query, "sea view apartment");
  assert.equal(result.data.furnishedState, "semi-furnished");
  assert.equal(result.data.parking, true);
  assert.equal(result.data.page, 3);
  assert.equal(result.data.skip, 48);
});

run("reports invalid values and preserves safe defaults", () => {
  const result = parseListingSearchParams({
    listingType: "lease",
    minPrice: "-10",
    maxPrice: "100",
    page: "0",
    parking: "sometimes"
  });

  assert.equal(result.ok, false);
  assert.deepEqual(
    result.issues.map((issue) => issue.field).sort(),
    ["listingType", "minPrice", "page", "parking"].sort()
  );
  assert.equal(result.data.listingType, "rent");
  assert.equal(result.data.page, 1);
  assert.equal(result.data.skip, 0);
  assert.equal(result.data.minPriceLkr, undefined);
  assert.equal(result.data.parking, undefined);
});

run("drops inverted price ranges instead of building a broken filter", () => {
  const result = parseListingSearchParams({
    minPrice: "250000",
    maxPrice: "100000"
  });

  assert.equal(result.ok, false);
  assert.equal(result.data.minPriceLkr, undefined);
  assert.equal(result.data.maxPriceLkr, undefined);
  assert.equal(result.issues.some((issue) => issue.message.includes("greater than maxPrice")), true);
});

run("builds a Prisma query from combined normalized filters", () => {
  const filters = normalizeSearchFilters({
    listingType: "rent",
    propertyType: "apartment",
    district: "Colombo",
    area: "Rajagiriya",
    minPriceLkr: 75000,
    maxPriceLkr: 250000,
    bedrooms: 2,
    bathrooms: 2,
    furnishedState: "furnished",
    parking: true,
    verification: {
      phoneVerified: true,
      ownerVerified: true
    },
    query: "lake view",
    sort: "price-asc",
    page: 2
  });

  const query = buildListingSearchQuery(filters);

  assert.equal(query.skip, 24);
  assert.equal(query.take, 24);
  assert.deepEqual(query.orderBy, [
    { priceLkr: "asc" },
    { publishedAt: "desc" },
    { createdAt: "desc" }
  ]);

  assert.deepEqual(query.where, {
    AND: [
      {
        availabilityStatus: "ACTIVE",
        deletedAt: null,
        listingType: "RENT"
      },
      {
        propertyType: "APARTMENT"
      },
      {
        priceLkr: {
          gte: 75000,
          lte: 250000
        }
      },
      {
        bedrooms: {
          gte: 2
        }
      },
      {
        bathrooms: {
          gte: 2
        }
      },
      {
        furnishingLevel: "FURNISHED"
      },
      {
        parkingSlots: {
          gte: 1
        }
      },
      {
        primaryLocation: {
          district: {
            equals: "Colombo",
            mode: "insensitive"
          }
        }
      },
      {
        primaryLocation: {
          areaName: {
            equals: "Rajagiriya",
            mode: "insensitive"
          }
        }
      },
      {
        isPhoneVerified: true
      },
      {
        isOwnerVerified: true
      },
      {
        OR: [
          {
            title: {
              contains: "lake view",
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: "lake view",
              mode: "insensitive"
            }
          },
          {
            addressLine: {
              contains: "lake view",
              mode: "insensitive"
            }
          },
          {
            primaryLocation: {
              areaName: {
                contains: "lake view",
                mode: "insensitive"
              }
            }
          },
          {
            primaryLocation: {
              city: {
                contains: "lake view",
                mode: "insensitive"
              }
            }
          },
          {
            primaryLocation: {
              district: {
                contains: "lake view",
                mode: "insensitive"
              }
            }
          }
        ]
      }
    ]
  });
});

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}
