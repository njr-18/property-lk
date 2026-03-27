import { createHash } from "node:crypto";
import type { AvailabilityStatus, Prisma } from "@prisma/client";
import { prisma } from "./client";

const duplicateSignalWeights = {
  phone: 0.45,
  title: 0.2,
  price: 0.15,
  location: 0.2,
  image: 0.35
} as const;

const defaultEligibleStatuses: AvailabilityStatus[] = ["DRAFT", "PENDING_REVIEW", "ACTIVE"];
const defaultDetectionThreshold = 0.63;

export type DuplicateReasonCode =
  | "phone_match"
  | "title_similarity"
  | "price_similarity"
  | "location_similarity"
  | "image_hash_match";

export type DuplicateReason = {
  code: DuplicateReasonCode;
  label: string;
  score: number;
  detail: string;
};

export type DuplicateDetectionListing = {
  id: string;
  publicId: string;
  slug: string;
  title: string;
  priceLkr: number;
  listingType: string;
  propertyType: string;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  location: {
    id: string;
    areaName: string;
    city?: string | null;
    district: string;
  };
  images: Array<{
    id: string;
    perceptualHash?: string | null;
  }>;
};

export type DuplicatePairScore = {
  listingIds: [string, string];
  score: number;
  reasons: DuplicateReason[];
};

export type DuplicateClusterDraft = {
  clusterKey: string;
  confidenceScore: number;
  listingIds: string[];
  pairs: DuplicatePairScore[];
  items: Array<{
    listingId: string;
    matchScore: number;
    reasons: DuplicateReason[];
  }>;
};

type DuplicateDetectionRecord = Prisma.ListingGetPayload<{
  select: typeof duplicateDetectionListingSelect;
}>;

const duplicateDetectionListingSelect = {
  id: true,
  publicId: true,
  slug: true,
  title: true,
  priceLkr: true,
  listingType: true,
  propertyType: true,
  contactPhone: true,
  contactWhatsapp: true,
  primaryLocation: {
    select: {
      id: true,
      areaName: true,
      city: true,
      district: true
    }
  },
  images: {
    select: {
      id: true,
      perceptualHash: true
    }
  }
} satisfies Prisma.ListingSelect;

export async function listListingsForDuplicateDetection(
  eligibleStatuses: AvailabilityStatus[] = defaultEligibleStatuses
): Promise<DuplicateDetectionListing[]> {
  const listings = await prisma.listing.findMany({
    where: {
      deletedAt: null,
      availabilityStatus: {
        in: eligibleStatuses
      }
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: duplicateDetectionListingSelect
  });

  return listings.map(mapDuplicateDetectionListing);
}

export function scoreDuplicatePair(
  left: DuplicateDetectionListing,
  right: DuplicateDetectionListing
): DuplicatePairScore {
  const reasons: DuplicateReason[] = [];
  let weightedScore = 0;
  let possibleWeight = 0;

  const phoneMatch = hasMatchingPhone(left, right);
  if (phoneMatch.matched) {
    weightedScore += duplicateSignalWeights.phone;
    possibleWeight += duplicateSignalWeights.phone;
    reasons.push({
      code: "phone_match",
      label: "Matching phone",
      score: 1,
      detail: `Both listings use ${phoneMatch.value}.`
    });
  } else if (phoneMatch.comparable) {
    possibleWeight += duplicateSignalWeights.phone;
  }

  const titleSimilarity = calculateTitleSimilarity(left.title, right.title);
  if (titleSimilarity >= 0.6) {
    weightedScore += titleSimilarity * duplicateSignalWeights.title;
    possibleWeight += duplicateSignalWeights.title;
    reasons.push({
      code: "title_similarity",
      label: "Similar title",
      score: titleSimilarity,
      detail: `Title similarity ${Math.round(titleSimilarity * 100)}%.`
    });
  } else if (titleSimilarity > 0) {
    possibleWeight += duplicateSignalWeights.title;
  }

  const priceSimilarity = calculatePriceSimilarity(left.priceLkr, right.priceLkr);
  if (priceSimilarity >= 0.9) {
    weightedScore += priceSimilarity * duplicateSignalWeights.price;
    possibleWeight += duplicateSignalWeights.price;
    reasons.push({
      code: "price_similarity",
      label: "Similar price",
      score: priceSimilarity,
      detail: `Prices differ by ${Math.round(
        calculateRelativeDifference(left.priceLkr, right.priceLkr) * 100
      )}%.`
    });
  } else {
    possibleWeight += duplicateSignalWeights.price;
  }

  const locationSimilarity = calculateLocationSimilarity(left.location, right.location);
  if (locationSimilarity >= 0.75) {
    weightedScore += locationSimilarity * duplicateSignalWeights.location;
    possibleWeight += duplicateSignalWeights.location;
    reasons.push({
      code: "location_similarity",
      label: "Similar location",
      score: locationSimilarity,
      detail: buildLocationReason(left.location, right.location, locationSimilarity)
    });
  } else if (locationSimilarity > 0) {
    possibleWeight += duplicateSignalWeights.location;
  }

  const imageHashMatch = calculateImageHashSimilarity(left.images, right.images);
  if (imageHashMatch.available) {
    possibleWeight += duplicateSignalWeights.image;

    if (imageHashMatch.score >= 0.95) {
      weightedScore += imageHashMatch.score * duplicateSignalWeights.image;
      reasons.push({
        code: "image_hash_match",
        label: "Matching image hash",
        score: imageHashMatch.score,
        detail: "At least one listing image has the same perceptual hash."
      });
    }
  }

  const score = possibleWeight === 0 ? 0 : Number((weightedScore / possibleWeight).toFixed(4));

  return {
    listingIds: [left.id, right.id],
    score,
    reasons
  };
}

export function buildDuplicateClusters(
  listings: DuplicateDetectionListing[],
  minimumScore = defaultDetectionThreshold
): DuplicateClusterDraft[] {
  const pairs: DuplicatePairScore[] = [];

  for (let index = 0; index < listings.length; index += 1) {
    const left = listings[index];

    for (let compareIndex = index + 1; compareIndex < listings.length; compareIndex += 1) {
      const right = listings[compareIndex];

      if (!areListingsComparable(left, right)) {
        continue;
      }

      const pair = scoreDuplicatePair(left, right);

      if (pair.score >= minimumScore && pair.reasons.length > 0) {
        pairs.push(pair);
      }
    }
  }

  return buildConnectedClusters(pairs);
}

export async function detectAndStoreDuplicateClusters(options?: {
  eligibleStatuses?: AvailabilityStatus[];
  minimumScore?: number;
}) {
  const listings = await listListingsForDuplicateDetection(options?.eligibleStatuses);
  const clusters = buildDuplicateClusters(listings, options?.minimumScore);
  const clusterKeys = new Set(clusters.map((cluster) => cluster.clusterKey));

  await prisma.$transaction(async (tx) => {
    const existingClusters = await tx.duplicateCluster.findMany({
      select: {
        id: true,
        clusterKey: true,
        status: true
      }
    });

    for (const cluster of clusters) {
      const existingCluster = await tx.duplicateCluster.findUnique({
        where: {
          clusterKey: cluster.clusterKey
        },
        select: {
          id: true
        }
      });

      const persistedCluster = existingCluster
        ? await tx.duplicateCluster.update({
            where: {
              clusterKey: cluster.clusterKey
            },
            data: {
              confidenceScore: cluster.confidenceScore
            },
            select: {
              id: true
            }
          })
        : await tx.duplicateCluster.create({
            data: {
              clusterKey: cluster.clusterKey,
              confidenceScore: cluster.confidenceScore,
              status: "PENDING"
            },
            select: {
              id: true
            }
          });

      await tx.duplicateClusterItem.deleteMany({
        where: {
          duplicateClusterId: persistedCluster.id
        }
      });

      if (cluster.items.length > 0) {
        await tx.duplicateClusterItem.createMany({
          data: cluster.items.map((item) => ({
            duplicateClusterId: persistedCluster.id,
            listingId: item.listingId,
            matchScore: item.matchScore,
            matchReasonsJson: item.reasons
          }))
        });
      }
    }

    const stalePendingClusterIds = existingClusters
      .filter((cluster) => cluster.status === "PENDING" && !clusterKeys.has(cluster.clusterKey))
      .map((cluster) => cluster.id);

    if (stalePendingClusterIds.length > 0) {
      await tx.duplicateCluster.deleteMany({
        where: {
          id: {
            in: stalePendingClusterIds
          }
        }
      });
    }
  });

  return {
    scannedListings: listings.length,
    clusterCount: clusters.length,
    clusterKeys: clusters.map((cluster) => cluster.clusterKey)
  };
}

function buildConnectedClusters(pairs: DuplicatePairScore[]): DuplicateClusterDraft[] {
  if (pairs.length === 0) {
    return [];
  }

  const adjacency = new Map<string, Set<string>>();
  const pairByKey = new Map<string, DuplicatePairScore>();

  for (const pair of pairs) {
    const [leftId, rightId] = pair.listingIds;
    addAdjacency(adjacency, leftId, rightId);
    addAdjacency(adjacency, rightId, leftId);
    pairByKey.set(buildPairKey(leftId, rightId), pair);
  }

  const visited = new Set<string>();
  const clusters: DuplicateClusterDraft[] = [];

  for (const listingId of adjacency.keys()) {
    if (visited.has(listingId)) {
      continue;
    }

    const componentListingIds = walkConnectedComponent(adjacency, listingId, visited).sort();
    if (componentListingIds.length < 2) {
      continue;
    }

    const componentPairs = pairs.filter((pair) => {
      const [leftId, rightId] = pair.listingIds;
      return componentListingIds.includes(leftId) && componentListingIds.includes(rightId);
    });

    const items = componentListingIds.map((componentListingId) => {
      const relatedPairs = componentPairs.filter((pair) =>
        pair.listingIds.includes(componentListingId)
      );
      const matchScore = Number(
        Math.max(...relatedPairs.map((pair) => pair.score), 0).toFixed(4)
      );

      return {
        listingId: componentListingId,
        matchScore,
        reasons: mergeReasons(
          relatedPairs.flatMap((pair) => pair.reasons),
          pairByKey,
          componentListingId
        )
      };
    });

    const averageScore =
      componentPairs.reduce((total, pair) => total + pair.score, 0) / componentPairs.length;

    clusters.push({
      clusterKey: buildClusterKey(componentListingIds),
      confidenceScore: Number(averageScore.toFixed(4)),
      listingIds: componentListingIds,
      pairs: componentPairs,
      items
    });
  }

  return clusters.sort((left, right) => right.confidenceScore - left.confidenceScore);
}

function mergeReasons(
  reasons: DuplicateReason[],
  _pairByKey: Map<string, DuplicatePairScore>,
  _listingId: string
) {
  const reasonByCode = new Map<DuplicateReasonCode, DuplicateReason>();

  for (const reason of reasons) {
    const existing = reasonByCode.get(reason.code);

    if (!existing || reason.score > existing.score) {
      reasonByCode.set(reason.code, reason);
    }
  }

  return Array.from(reasonByCode.values()).sort((left, right) => right.score - left.score);
}

function addAdjacency(adjacency: Map<string, Set<string>>, from: string, to: string) {
  const existing = adjacency.get(from);

  if (existing) {
    existing.add(to);
    return;
  }

  adjacency.set(from, new Set([to]));
}

function walkConnectedComponent(
  adjacency: Map<string, Set<string>>,
  startId: string,
  visited: Set<string>
) {
  const queue = [startId];
  const component = new Set<string>();

  while (queue.length > 0) {
    const listingId = queue.shift();
    if (!listingId || visited.has(listingId)) {
      continue;
    }

    visited.add(listingId);
    component.add(listingId);

    for (const neighbor of adjacency.get(listingId) ?? []) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return Array.from(component);
}

function areListingsComparable(
  left: DuplicateDetectionListing,
  right: DuplicateDetectionListing
) {
  return left.id !== right.id && left.listingType === right.listingType;
}

function hasMatchingPhone(left: DuplicateDetectionListing, right: DuplicateDetectionListing) {
  const leftPhones = [left.contactPhone, left.contactWhatsapp]
    .map(normalizePhone)
    .filter((value): value is string => Boolean(value));
  const rightPhones = [right.contactPhone, right.contactWhatsapp]
    .map(normalizePhone)
    .filter((value): value is string => Boolean(value));

  if (leftPhones.length === 0 || rightPhones.length === 0) {
    return {
      comparable: false,
      matched: false,
      value: undefined
    };
  }

  for (const leftPhone of leftPhones) {
    if (rightPhones.includes(leftPhone)) {
      return {
        comparable: true,
        matched: true,
        value: leftPhone
      };
    }
  }

  return {
    comparable: true,
    matched: false,
    value: undefined
  };
}

function normalizePhone(value?: string | null) {
  const digits = value?.replace(/\D/g, "");
  if (!digits) {
    return undefined;
  }

  if (digits.length === 10 && digits.startsWith("0")) {
    return `94${digits.slice(1)}`;
  }

  if (digits.length === 9) {
    return `94${digits}`;
  }

  return digits;
}

function calculateTitleSimilarity(leftTitle: string, rightTitle: string) {
  const leftTokens = tokenizeTitle(leftTitle);
  const rightTokens = tokenizeTitle(rightTitle);

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  const intersectionCount = Array.from(leftTokens).filter((token) => rightTokens.has(token)).length;
  const unionCount = new Set([...leftTokens, ...rightTokens]).size;

  return unionCount === 0 ? 0 : Number((intersectionCount / unionCount).toFixed(4));
}

function tokenizeTitle(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3)
  );
}

function calculatePriceSimilarity(leftPrice: number, rightPrice: number) {
  return Number((1 - calculateRelativeDifference(leftPrice, rightPrice)).toFixed(4));
}

function calculateRelativeDifference(leftValue: number, rightValue: number) {
  const baseline = Math.max(leftValue, rightValue, 1);
  return Math.abs(leftValue - rightValue) / baseline;
}

function calculateLocationSimilarity(
  leftLocation: DuplicateDetectionListing["location"],
  rightLocation: DuplicateDetectionListing["location"]
) {
  if (leftLocation.id === rightLocation.id) {
    return 1;
  }

  const leftArea = normalizeText(leftLocation.areaName);
  const rightArea = normalizeText(rightLocation.areaName);
  const leftCity = normalizeText(leftLocation.city);
  const rightCity = normalizeText(rightLocation.city);
  const leftDistrict = normalizeText(leftLocation.district);
  const rightDistrict = normalizeText(rightLocation.district);

  if (leftArea && rightArea && leftArea === rightArea) {
    return 0.9;
  }

  if (leftCity && rightCity && leftCity === rightCity && leftDistrict === rightDistrict) {
    return 0.82;
  }

  if (leftDistrict && rightDistrict && leftDistrict === rightDistrict) {
    return 0.45;
  }

  return 0;
}

function buildLocationReason(
  leftLocation: DuplicateDetectionListing["location"],
  rightLocation: DuplicateDetectionListing["location"],
  similarity: number
) {
  if (similarity === 1) {
    return `Both listings point to ${leftLocation.areaName}.`;
  }

  if (similarity >= 0.9) {
    return `Both listings reference the same area name: ${leftLocation.areaName}.`;
  }

  return `Both listings are in ${leftLocation.district}.`;
}

function calculateImageHashSimilarity(
  leftImages: DuplicateDetectionListing["images"],
  rightImages: DuplicateDetectionListing["images"]
) {
  const leftHashes = leftImages
    .map((image) => normalizeText(image.perceptualHash))
    .filter((value): value is string => Boolean(value));
  const rightHashes = rightImages
    .map((image) => normalizeText(image.perceptualHash))
    .filter((value): value is string => Boolean(value));

  if (leftHashes.length === 0 || rightHashes.length === 0) {
    return {
      available: false,
      score: 0
    };
  }

  const matched = leftHashes.some((leftHash) => rightHashes.includes(leftHash));

  return {
    available: true,
    score: matched ? 1 : 0
  };
}

function buildClusterKey(listingIds: string[]) {
  return `dup-${createHash("sha1").update(listingIds.join("|")).digest("hex").slice(0, 16)}`;
}

function buildPairKey(leftId: string, rightId: string) {
  return [leftId, rightId].sort().join(":");
}

function mapDuplicateDetectionListing(listing: DuplicateDetectionRecord): DuplicateDetectionListing {
  return {
    id: listing.id,
    publicId: listing.publicId,
    slug: listing.slug,
    title: listing.title,
    priceLkr: listing.priceLkr,
    listingType: listing.listingType,
    propertyType: listing.propertyType,
    contactPhone: listing.contactPhone,
    contactWhatsapp: listing.contactWhatsapp,
    location: {
      id: listing.primaryLocation.id,
      areaName: listing.primaryLocation.areaName,
      city: listing.primaryLocation.city ?? undefined,
      district: listing.primaryLocation.district
    },
    images: listing.images.map((image) => ({
      id: image.id,
      perceptualHash: image.perceptualHash ?? undefined
    }))
  };
}

function normalizeText(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}
