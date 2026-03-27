import {
  AvailabilityStatus,
  FurnishingLevel,
  InquiryStatus,
  ListedByType,
  ListingType,
  MapPrecision,
  PrismaClient,
  PropertyType,
  UserRole
} from "@prisma/client";

const prisma = new PrismaClient();

type SeedLocation = {
  id: string;
  district: string;
  city: string | null;
  areaName: string;
  slug: string;
  latitude: number;
  longitude: number;
  parentLocationId?: string;
};

type ListingSeed = {
  id: string;
  publicId: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  priceLkr: number;
  negotiable: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSlots: number | null;
  floorAreaSqft: number | null;
  landSizePerches: number | null;
  furnishingLevel: FurnishingLevel | null;
  listedByType: ListedByType;
  ownerUserId: string | null;
  agentUserId: string | null;
  primaryLocationId: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  mapPrecision: MapPrecision;
  contactName: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  isPhoneVerified: boolean;
  isWhatsappVerified: boolean;
  isOwnerVerified: boolean;
  isAgencyVerified: boolean;
  isFeatured: boolean;
  qualityScore: number;
  trustScore: number;
  freshnessScore: number;
  priceBandScore: number;
  viewCount: number;
  inquiryCount: number;
  favoriteCount: number;
  publishedAt: Date;
  expiresAt: Date;
  imageCount: number;
  features: Array<{ key: string; value: string }>;
  verifications: Array<{
    type: string;
    status: string;
    notes: string;
    verifiedByUserId?: string;
    verifiedAt?: Date;
    expiresAt?: Date;
  }>;
};

const now = new Date("2026-03-27T09:00:00.000Z");
const plusDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const minusDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const locations: SeedLocation[] = [
  {
    id: "loc-colombo",
    district: "Colombo",
    city: "Colombo",
    areaName: "Colombo",
    slug: "colombo",
    latitude: 6.9271,
    longitude: 79.8612
  },
  {
    id: "loc-colombo-03",
    district: "Colombo",
    city: "Colombo",
    areaName: "Colombo 03",
    slug: "colombo-03",
    latitude: 6.905,
    longitude: 79.8533,
    parentLocationId: "loc-colombo"
  },
  {
    id: "loc-colombo-05",
    district: "Colombo",
    city: "Colombo",
    areaName: "Colombo 05",
    slug: "colombo-05",
    latitude: 6.8959,
    longitude: 79.8674,
    parentLocationId: "loc-colombo"
  },
  {
    id: "loc-colombo-06",
    district: "Colombo",
    city: "Colombo",
    areaName: "Colombo 06",
    slug: "colombo-06",
    latitude: 6.8741,
    longitude: 79.8605,
    parentLocationId: "loc-colombo"
  },
  {
    id: "loc-nugegoda",
    district: "Colombo",
    city: "Nugegoda",
    areaName: "Nugegoda",
    slug: "nugegoda",
    latitude: 6.865,
    longitude: 79.8997
  },
  {
    id: "loc-rajagiriya",
    district: "Colombo",
    city: "Rajagiriya",
    areaName: "Rajagiriya",
    slug: "rajagiriya",
    latitude: 6.9061,
    longitude: 79.8952
  },
  {
    id: "loc-battaramulla",
    district: "Colombo",
    city: "Battaramulla",
    areaName: "Battaramulla",
    slug: "battaramulla",
    latitude: 6.9022,
    longitude: 79.918
  },
  {
    id: "loc-maharagama",
    district: "Colombo",
    city: "Maharagama",
    areaName: "Maharagama",
    slug: "maharagama",
    latitude: 6.848,
    longitude: 79.9265
  },
  {
    id: "loc-kotte",
    district: "Colombo",
    city: "Kotte",
    areaName: "Kotte",
    slug: "kotte",
    latitude: 6.89,
    longitude: 79.9022
  },
  {
    id: "loc-dehiwala",
    district: "Colombo",
    city: "Dehiwala",
    areaName: "Dehiwala",
    slug: "dehiwala",
    latitude: 6.8402,
    longitude: 79.8712
  },
  {
    id: "loc-mount-lavinia",
    district: "Colombo",
    city: "Mount Lavinia",
    areaName: "Mount Lavinia",
    slug: "mount-lavinia",
    latitude: 6.8389,
    longitude: 79.8636
  }
];

const users = [
  {
    id: "user-admin-1",
    name: "Nadeesha Perera",
    email: "nadeesha.admin@propertylk.test",
    phone: "+94770000001",
    whatsappNumber: "+94770000001",
    passwordHash: "seed-admin-hash",
    preferredLanguage: "en",
    role: UserRole.ADMIN
  },
  {
    id: "user-agent-1",
    name: "Sahan Realty",
    email: "sahan.agent@propertylk.test",
    phone: "+94770000002",
    whatsappNumber: "+94770000002",
    passwordHash: "seed-agent-hash",
    preferredLanguage: "en",
    role: UserRole.AGENT
  },
  {
    id: "user-agent-2",
    name: "Metro Homes LK",
    email: "metro.agent@propertylk.test",
    phone: "+94770000003",
    whatsappNumber: "+94770000003",
    passwordHash: "seed-agent-hash",
    preferredLanguage: "en",
    role: UserRole.AGENT
  },
  {
    id: "user-owner-1",
    name: "Shalini Fernando",
    email: "shalini.owner@propertylk.test",
    phone: "+94770000004",
    whatsappNumber: "+94770000004",
    passwordHash: "seed-owner-hash",
    preferredLanguage: "en",
    role: UserRole.OWNER
  },
  {
    id: "user-owner-2",
    name: "Kamal Wijesinghe",
    email: "kamal.owner@propertylk.test",
    phone: "+94770000005",
    whatsappNumber: "+94770000005",
    passwordHash: "seed-owner-hash",
    preferredLanguage: "en",
    role: UserRole.OWNER
  },
  {
    id: "user-seeker-1",
    name: "Ayesha Silva",
    email: "ayesha.user@propertylk.test",
    phone: "+94770000006",
    whatsappNumber: "+94770000006",
    passwordHash: "seed-user-hash",
    preferredLanguage: "en",
    role: UserRole.USER
  },
  {
    id: "user-seeker-2",
    name: "Ravin Hettiarachchi",
    email: "ravin.user@propertylk.test",
    phone: "+94770000007",
    whatsappNumber: "+94770000007",
    passwordHash: "seed-user-hash",
    preferredLanguage: "en",
    role: UserRole.USER
  }
] as const;

const profiles = [
  {
    id: "profile-agent-1",
    userId: "user-agent-1",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    bio: "Rental-focused Colombo agent with strong owner inventory in the city fringe.",
    companyName: "Sahan Realty (Pvt) Ltd",
    agencyName: "Sahan Realty",
    licenseNumber: "REA-1001",
    city: "Colombo",
    district: "Colombo"
  },
  {
    id: "profile-agent-2",
    userId: "user-agent-2",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    bio: "Handles family homes, land, and mid-market apartment resales in Greater Colombo.",
    companyName: "Metro Homes LK",
    agencyName: "Metro Homes LK",
    licenseNumber: "REA-1002",
    city: "Rajagiriya",
    district: "Colombo"
  },
  {
    id: "profile-owner-1",
    userId: "user-owner-1",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    bio: "Owner managing a small set of rental properties in Nugegoda and Colombo 06.",
    companyName: null,
    agencyName: null,
    licenseNumber: null,
    city: "Nugegoda",
    district: "Colombo"
  },
  {
    id: "profile-owner-2",
    userId: "user-owner-2",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    bio: "Direct owner with residential land and annex inventory in southern Colombo suburbs.",
    companyName: null,
    agencyName: null,
    licenseNumber: null,
    city: "Mount Lavinia",
    district: "Colombo"
  }
] as const;

const locationById = Object.fromEntries(locations.map((location) => [location.id, location]));

const locationOrder = [
  "loc-colombo-03",
  "loc-colombo-05",
  "loc-colombo-06",
  "loc-nugegoda",
  "loc-rajagiriya",
  "loc-battaramulla",
  "loc-maharagama",
  "loc-kotte",
  "loc-dehiwala",
  "loc-mount-lavinia",
  "loc-colombo"
] as const;

const propertyTemplates = [
  {
    propertyType: PropertyType.APARTMENT,
    titlePrefix: "Bright apartment",
    facts: "Good light, practical layout, and straightforward access to shops and offices.",
    features: ["lift_access", "parking", "hot_water", "gated_entry"],
    bedroomRange: [1, 3] as const,
    bathroomRange: [1, 2] as const,
    parkingRange: [0, 1] as const,
    floorAreaRange: [650, 1450] as const,
    landPerchesRange: [null, null] as const
  },
  {
    propertyType: PropertyType.HOUSE,
    titlePrefix: "Family house",
    facts: "Well-suited for families who need parking, privacy, and a calmer residential lane.",
    features: ["garden_space", "parking", "servant_room", "hot_water"],
    bedroomRange: [3, 5] as const,
    bathroomRange: [2, 4] as const,
    parkingRange: [1, 3] as const,
    floorAreaRange: [1800, 3600] as const,
    landPerchesRange: [8, 20] as const
  },
  {
    propertyType: PropertyType.ANNEX,
    titlePrefix: "Private annex",
    facts: "Compact and easy to manage, with separate access and a practical rent profile.",
    features: ["separate_entrance", "near_main_road", "pet_friendly", "hot_water"],
    bedroomRange: [1, 2] as const,
    bathroomRange: [1, 1] as const,
    parkingRange: [0, 1] as const,
    floorAreaRange: [420, 900] as const,
    landPerchesRange: [null, null] as const
  },
  {
    propertyType: PropertyType.ROOM,
    titlePrefix: "Furnished room",
    facts: "Designed for single professionals and students who care about commute time and essentials.",
    features: ["furnished", "wifi_ready", "shared_kitchen", "near_bus_route"],
    bedroomRange: [1, 1] as const,
    bathroomRange: [1, 1] as const,
    parkingRange: [0, 0] as const,
    floorAreaRange: [180, 320] as const,
    landPerchesRange: [null, null] as const
  },
  {
    propertyType: PropertyType.LAND,
    titlePrefix: "Residential land",
    facts: "Useful for buyers prioritizing frontage, neighborhood profile, and resale stability.",
    features: ["square_plot", "clear_deeds", "wide_road_access", "residential_zone"],
    bedroomRange: [null, null] as const,
    bathroomRange: [null, null] as const,
    parkingRange: [null, null] as const,
    floorAreaRange: [null, null] as const,
    landPerchesRange: [6, 24] as const
  }
] as const;

const listingTypeCycle = [
  ListingType.RENT,
  ListingType.SALE,
  ListingType.RENT,
  ListingType.RENT,
  ListingType.SALE
] as const;

const furnishingCycle = [
  FurnishingLevel.FURNISHED,
  FurnishingLevel.SEMI_FURNISHED,
  FurnishingLevel.UNFURNISHED,
  FurnishingLevel.SEMI_FURNISHED,
  null
] as const;

const listings: ListingSeed[] = Array.from({ length: 44 }, (_, index) => {
  const template = propertyTemplates[index % propertyTemplates.length];
  const listingType = listingTypeCycle[index % listingTypeCycle.length];
  const locationId = locationOrder[index % locationOrder.length];
  const location = locationById[locationId];
  const furnishingLevel =
    template.propertyType === PropertyType.LAND ? null : furnishingCycle[index % furnishingCycle.length];
  const isOwnerListing = index % 3 === 0;
  const ownerUserId = isOwnerListing ? (index % 2 === 0 ? "user-owner-1" : "user-owner-2") : null;
  const agentUserId = isOwnerListing ? null : index % 2 === 0 ? "user-agent-1" : "user-agent-2";
  const listedByType = isOwnerListing ? ListedByType.OWNER : ListedByType.AGENT;
  const numeric = index + 1;
  const bedrooms =
    template.bedroomRange[0] === null
      ? null
      : template.bedroomRange[0] + (index % (template.bedroomRange[1] - template.bedroomRange[0] + 1));
  const bathrooms =
    template.bathroomRange[0] === null
      ? null
      : template.bathroomRange[0] + (index % (template.bathroomRange[1] - template.bathroomRange[0] + 1));
  const parkingSlots =
    template.parkingRange[0] === null
      ? null
      : template.parkingRange[0] + (index % (template.parkingRange[1] - template.parkingRange[0] + 1));
  const floorAreaSqft =
    template.floorAreaRange[0] === null
      ? null
      : template.floorAreaRange[0] + (index % 6) * Math.floor((template.floorAreaRange[1] - template.floorAreaRange[0]) / 5);
  const landSizePerches =
    template.landPerchesRange[0] === null
      ? null
      : Number((template.landPerchesRange[0] + (index % 7) * 1.8).toFixed(1));
  const title = `${template.titlePrefix} in ${location.areaName}`;
  const slug = `${template.propertyType.toLowerCase()}-${listingType.toLowerCase()}-${location.slug}-${String(numeric).padStart(2, "0")}`;
  const basePrices: Record<PropertyType, number> = {
    ROOM: 35000,
    ANNEX: 65000,
    HOUSE: 325000,
    APARTMENT: 95000,
    LAND: 8500000,
    COMMERCIAL: 450000
  };
  const rentMultiplier = template.propertyType === PropertyType.HOUSE ? 45000 : 18000;
  const saleMultiplier = template.propertyType === PropertyType.LAND ? 1650000 : 2200000;
  const priceLkr =
    listingType === ListingType.RENT
      ? basePrices[template.propertyType] + (index % 8) * rentMultiplier
      : basePrices[template.propertyType] + (index % 8) * saleMultiplier;
  const isPublished = index % 11 !== 0;
  const availabilityStatus = isPublished
    ? index % 9 === 0
      ? AvailabilityStatus.PENDING_REVIEW
      : AvailabilityStatus.ACTIVE
    : AvailabilityStatus.DRAFT;
  const trustScore = Number((5.8 + (index % 5) * 0.8).toFixed(1));
  const qualityScore = Number((6.4 + (index % 4) * 0.7).toFixed(1));
  const freshnessScore = Number((5.5 + (index % 6) * 0.6).toFixed(1));
  const priceBandScore = Number((6.2 + (index % 3) * 0.9).toFixed(1));
  const isVerifiedStrong = index % 4 !== 1;
  const isAgencyVerified = Boolean(agentUserId && index % 5 !== 2);
  const isFeatured = index % 10 === 0;
  const latOffset = (index % 4) * 0.0023;
  const lngOffset = (index % 5) * 0.0019;
  const imageCount = 1 + (index % 3);

  return {
    id: `listing-${String(numeric).padStart(3, "0")}`,
    publicId: `PLK-${String(1000 + numeric)}`,
    slug,
    title,
    description: `${title}. ${template.facts} Close to daily conveniences in ${location.areaName}, with realistic pricing for the current ${listingType.toLowerCase()} market.`,
    propertyType: template.propertyType,
    listingType,
    priceLkr,
    negotiable: index % 3 === 1,
    bedrooms,
    bathrooms,
    parkingSlots,
    floorAreaSqft,
    landSizePerches,
    furnishingLevel,
    listedByType,
    ownerUserId,
    agentUserId,
    primaryLocationId: locationId,
    addressLine: `${12 + numeric} ${location.areaName} Park Road`,
    latitude: Number((location.latitude + latOffset).toFixed(6)),
    longitude: Number((location.longitude + lngOffset).toFixed(6)),
    mapPrecision: index % 7 === 0 ? MapPrecision.EXACT : MapPrecision.APPROXIMATE,
    contactName: ownerUserId
      ? users.find((user) => user.id === ownerUserId)?.name ?? "Owner"
      : users.find((user) => user.id === agentUserId)?.name ?? "Agent",
    contactPhone: ownerUserId
      ? users.find((user) => user.id === ownerUserId)?.phone ?? "+94770000999"
      : users.find((user) => user.id === agentUserId)?.phone ?? "+94770000998",
    contactWhatsapp: ownerUserId
      ? users.find((user) => user.id === ownerUserId)?.whatsappNumber ?? "+94770000999"
      : users.find((user) => user.id === agentUserId)?.whatsappNumber ?? "+94770000998",
    contactEmail: ownerUserId
      ? users.find((user) => user.id === ownerUserId)?.email ?? "owner@propertylk.test"
      : users.find((user) => user.id === agentUserId)?.email ?? "agent@propertylk.test",
    isPhoneVerified: isVerifiedStrong,
    isWhatsappVerified: index % 5 !== 0,
    isOwnerVerified: Boolean(ownerUserId && isVerifiedStrong),
    isAgencyVerified,
    isFeatured,
    qualityScore,
    trustScore,
    freshnessScore,
    priceBandScore,
    viewCount: 42 + index * 9,
    inquiryCount: index % 6,
    favoriteCount: index % 8,
    publishedAt: isPublished ? minusDays(index % 18) : minusDays(1),
    expiresAt: plusDays(45 + (index % 18)),
    imageCount,
    features: template.features.map((featureKey, featureIndex) => ({
      key: featureKey,
      value: featureIndex % 2 === 0 ? "true" : index % 2 === 0 ? "true" : "false"
    })),
    verifications: [
      {
        type: "phone_verified",
        status: isVerifiedStrong ? "verified" : "pending",
        notes: isVerifiedStrong ? "Phone number confirmed during onboarding." : "Awaiting outbound verification call.",
        verifiedByUserId: isVerifiedStrong ? "user-admin-1" : undefined,
        verifiedAt: isVerifiedStrong ? minusDays(index % 12) : undefined
      },
      {
        type: ownerUserId ? "owner_identity_verified" : "agency_credentials_reviewed",
        status: ownerUserId
          ? isVerifiedStrong
            ? "verified"
            : "pending"
          : isAgencyVerified
            ? "verified"
            : "pending",
        notes: ownerUserId
          ? "NIC copy and ownership proof reviewed."
          : "Agency registration reviewed against office contact.",
        verifiedByUserId: index % 4 === 0 ? "user-admin-1" : undefined,
        verifiedAt: index % 4 === 0 ? minusDays(index % 10) : undefined,
        expiresAt: plusDays(90)
      }
    ]
  };
});

const duplicateClusterId = "dup-cluster-001";
const duplicateListingA = listings[7];
const duplicateListingB = listings[18];

async function resetDatabase() {
  await prisma.$transaction([
    prisma.listingViewEvent.deleteMany(),
    prisma.searchEvent.deleteMany(),
    prisma.duplicateClusterItem.deleteMany(),
    prisma.duplicateCluster.deleteMany(),
    prisma.report.deleteMany(),
    prisma.listingVerification.deleteMany(),
    prisma.inquiry.deleteMany(),
    prisma.savedListing.deleteMany(),
    prisma.savedSearch.deleteMany(),
    prisma.listingSourceRecord.deleteMany(),
    prisma.listingVersion.deleteMany(),
    prisma.listingFeature.deleteMany(),
    prisma.listingImage.deleteMany(),
    prisma.areaPage.deleteMany(),
    prisma.guide.deleteMany(),
    prisma.listing.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.location.deleteMany(),
    prisma.user.deleteMany()
  ]);
}

async function seedLocations() {
  for (const location of locations) {
    await prisma.location.create({
      data: {
        id: location.id,
        district: location.district,
        city: location.city,
        areaName: location.areaName,
        slug: location.slug,
        latitude: location.latitude,
        longitude: location.longitude,
        parentLocationId: location.parentLocationId,
        isActive: true
      }
    });
  }
}

async function seedUsers() {
  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  for (const profile of profiles) {
    await prisma.profile.create({ data: profile });
  }
}

async function seedListings() {
  for (const listing of listings) {
    await prisma.listing.create({
      data: {
        id: listing.id,
        publicId: listing.publicId,
        slug: listing.slug,
        title: listing.title,
        description: listing.description,
        propertyType: listing.propertyType,
        listingType: listing.listingType,
        priceLkr: listing.priceLkr,
        negotiable: listing.negotiable,
        currency: "LKR",
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        parkingSlots: listing.parkingSlots,
        floorAreaSqft: listing.floorAreaSqft,
        landSizePerches: listing.landSizePerches,
        furnishingLevel: listing.furnishingLevel,
        availabilityStatus: listing.availabilityStatus,
        listedByType: listing.listedByType,
        sourceType: "DIRECT",
        ownerUserId: listing.ownerUserId,
        agentUserId: listing.agentUserId,
        primaryLocationId: listing.primaryLocationId,
        addressLine: listing.addressLine,
        latitude: listing.latitude,
        longitude: listing.longitude,
        mapPrecision: listing.mapPrecision,
        contactName: listing.contactName,
        contactPhone: listing.contactPhone,
        contactWhatsapp: listing.contactWhatsapp,
        contactEmail: listing.contactEmail,
        isPhoneVerified: listing.isPhoneVerified,
        isWhatsappVerified: listing.isWhatsappVerified,
        isOwnerVerified: listing.isOwnerVerified,
        isAgencyVerified: listing.isAgencyVerified,
        isFeatured: listing.isFeatured,
        qualityScore: listing.qualityScore,
        trustScore: listing.trustScore,
        freshnessScore: listing.freshnessScore,
        priceBandScore: listing.priceBandScore,
        viewCount: listing.viewCount,
        inquiryCount: listing.inquiryCount,
        favoriteCount: listing.favoriteCount,
        publishedAt: listing.publishedAt,
        expiresAt: listing.expiresAt
      }
    });

    await prisma.listingImage.createMany({
      data: Array.from({ length: listing.imageCount }, (_, imageIndex) => ({
        id: `${listing.id}-image-${imageIndex + 1}`,
        listingId: listing.id,
        imageUrl: `https://images.unsplash.com/photo-${1600000000000 + listing.id.length * 100 + imageIndex}?auto=format&fit=crop&w=1200&q=80`,
        storageKey: `seed/${listing.slug}/${imageIndex + 1}.jpg`,
        altText: `${listing.title} image ${imageIndex + 1}`,
        sortOrder: imageIndex,
        width: 1600,
        height: 1066,
        blurhash: `seedblur${imageIndex + 1}`,
        perceptualHash: `${listing.slug}-hash-${imageIndex + 1}`,
        isPrimary: imageIndex === 0
      }))
    });

    await prisma.listingFeature.createMany({
      data: listing.features.map((feature, featureIndex) => ({
        id: `${listing.id}-feature-${featureIndex + 1}`,
        listingId: listing.id,
        featureKey: feature.key,
        featureValue: feature.value
      }))
    });

    await prisma.listingVersion.create({
      data: {
        id: `${listing.id}-version-1`,
        listingId: listing.id,
        versionNumber: 1,
        changedByUserId: listing.agentUserId ?? listing.ownerUserId ?? "user-admin-1",
        changeSummary: "Initial seeded listing snapshot",
        snapshotJson: {
          title: listing.title,
          priceLkr: listing.priceLkr,
          listingType: listing.listingType,
          propertyType: listing.propertyType,
          locationId: listing.primaryLocationId
        }
      }
    });

    await prisma.listingSourceRecord.create({
      data: {
        id: `${listing.id}-source`,
        listingId: listing.id,
        sourceName: "seed",
        sourceExternalId: listing.publicId,
        sourceUrl: `https://propertylk.test/listings/${listing.slug}`,
        rawPayloadJson: {
          listingId: listing.id,
          seededAt: now.toISOString()
        },
        importedAt: minusDays(2)
      }
    });

    for (let verificationIndex = 0; verificationIndex < listing.verifications.length; verificationIndex += 1) {
      const verification = listing.verifications[verificationIndex];
      await prisma.listingVerification.create({
        data: {
          id: `${listing.id}-verification-${verificationIndex + 1}`,
          listingId: listing.id,
          verificationType: verification.type,
          verificationStatus: verification.status,
          verifiedByUserId: verification.verifiedByUserId,
          notes: verification.notes,
          verifiedAt: verification.verifiedAt,
          expiresAt: verification.expiresAt
        }
      });
    }
  }
}

async function seedSupportingRecords() {
  await prisma.savedListing.createMany({
    data: [
      { id: "saved-listing-1", userId: "user-seeker-1", listingId: listings[0].id },
      { id: "saved-listing-2", userId: "user-seeker-1", listingId: listings[3].id },
      { id: "saved-listing-3", userId: "user-seeker-1", listingId: listings[9].id },
      { id: "saved-listing-4", userId: "user-seeker-2", listingId: listings[5].id },
      { id: "saved-listing-5", userId: "user-seeker-2", listingId: listings[11].id },
      { id: "saved-listing-6", userId: "user-seeker-2", listingId: listings[21].id }
    ]
  });

  await prisma.savedSearch.createMany({
    data: [
      {
        id: "saved-search-1",
        userId: "user-seeker-1",
        name: "Colombo 05 furnished rentals",
        searchParamsJson: {
          listingType: "rent",
          locationSlug: "colombo-05",
          furnishingLevel: "FURNISHED",
          maxPriceLkr: 250000
        },
        alertEnabled: true,
        alertFrequency: "daily",
        lastAlertSentAt: minusDays(1)
      },
      {
        id: "saved-search-2",
        userId: "user-seeker-1",
        name: "Rajagiriya apartments for sale",
        searchParamsJson: {
          listingType: "sale",
          locationSlug: "rajagiriya",
          propertyType: "APARTMENT",
          minBedrooms: 2
        },
        alertEnabled: true,
        alertFrequency: "weekly",
        lastAlertSentAt: minusDays(3)
      },
      {
        id: "saved-search-3",
        userId: "user-seeker-2",
        name: "Affordable annexes near Nugegoda",
        searchParamsJson: {
          listingType: "rent",
          locationSlug: "nugegoda",
          propertyType: "ANNEX",
          maxPriceLkr: 120000
        },
        alertEnabled: false,
        alertFrequency: "daily",
        lastAlertSentAt: null
      }
    ]
  });

  await prisma.inquiry.createMany({
    data: [
      {
        id: "inquiry-1",
        listingId: listings[0].id,
        userId: "user-seeker-1",
        name: "Ayesha Silva",
        email: "ayesha.user@propertylk.test",
        phone: "+94770000006",
        message: "Can I schedule a viewing this Saturday morning?",
        preferredContactMethod: "whatsapp",
        status: InquiryStatus.NEW,
        source: "listing_page"
      },
      {
        id: "inquiry-2",
        listingId: listings[4].id,
        userId: "user-seeker-2",
        name: "Ravin Hettiarachchi",
        email: "ravin.user@propertylk.test",
        phone: "+94770000007",
        message: "Please confirm whether the price is negotiable and if parking is covered.",
        preferredContactMethod: "call",
        status: InquiryStatus.CONTACTED,
        source: "compare_page"
      },
      {
        id: "inquiry-3",
        listingId: listings[10].id,
        userId: null,
        name: "Nimali Guest",
        email: "nimali.guest@example.com",
        phone: "+94771122334",
        message: "Is the room still available for immediate move-in?",
        preferredContactMethod: "email",
        status: InquiryStatus.NEW,
        source: "listing_page"
      },
      {
        id: "inquiry-4",
        listingId: listings[18].id,
        userId: "user-seeker-1",
        name: "Ayesha Silva",
        email: "ayesha.user@propertylk.test",
        phone: "+94770000006",
        message: "Do you have a floor plan or more photos of the kitchen?",
        preferredContactMethod: "whatsapp",
        status: InquiryStatus.CLOSED,
        source: "saved_listings"
      },
      {
        id: "inquiry-5",
        listingId: listings[27].id,
        userId: "user-seeker-2",
        name: "Ravin Hettiarachchi",
        email: "ravin.user@propertylk.test",
        phone: "+94770000007",
        message: "Interested in the land plot. Please share road width and utility access details.",
        preferredContactMethod: "call",
        status: InquiryStatus.NEW,
        source: "listing_page"
      }
    ]
  });

  await prisma.report.createMany({
    data: [
      {
        id: "report-1",
        listingId: duplicateListingA.id,
        reporterUserId: "user-seeker-1",
        reason: "duplicate",
        notes: "Looks very similar to another Rajagiriya apartment with the same photos.",
        status: "OPEN"
      },
      {
        id: "report-2",
        listingId: listings[14].id,
        reporterUserId: "user-seeker-2",
        reason: "wrong_price",
        notes: "Price in the description mentions a different amount.",
        status: "OPEN"
      },
      {
        id: "report-3",
        listingId: listings[30].id,
        reporterUserId: null,
        reason: "sold_or_rented",
        notes: "Caller said the property was already taken last week.",
        status: "REVIEWED",
        resolvedAt: minusDays(1),
        resolvedByUserId: "user-admin-1"
      }
    ]
  });

  await prisma.areaPage.createMany({
    data: [
      {
        id: "area-page-1",
        locationId: "loc-colombo-05",
        pageType: "rent_area",
        title: "Rent in Colombo 05",
        intro: "Colombo 05 remains one of the strongest rental micro-markets for professionals and families.",
        metaTitle: "Properties for Rent in Colombo 05",
        metaDescription: "Browse apartments, annexes, rooms, and homes for rent in Colombo 05.",
        faqJson: [
          { question: "What rents are common in Colombo 05?", answer: "Studios and rooms sit lower; larger apartments and houses sit much higher." }
        ],
        statsJson: { averageRentLkr: 215000, activeListings: 9 },
        published: true
      },
      {
        id: "area-page-2",
        locationId: "loc-nugegoda",
        pageType: "rent_area",
        title: "Rent in Nugegoda",
        intro: "Nugegoda works well for commuters balancing value, access, and neighborhood amenities.",
        metaTitle: "Properties for Rent in Nugegoda",
        metaDescription: "See current rooms, annexes, apartments, and homes for rent in Nugegoda.",
        faqJson: [
          { question: "Is Nugegoda practical for daily commuting?", answer: "Yes, especially for residents using bus corridors and arterial roads into Colombo." }
        ],
        statsJson: { averageRentLkr: 128000, activeListings: 7 },
        published: true
      },
      {
        id: "area-page-3",
        locationId: "loc-mount-lavinia",
        pageType: "buy_area",
        title: "Buy in Mount Lavinia",
        intro: "Mount Lavinia attracts buyers looking for coastal access, schools, and established neighborhoods.",
        metaTitle: "Properties for Sale in Mount Lavinia",
        metaDescription: "Explore homes, apartments, and land for sale in Mount Lavinia.",
        faqJson: [
          { question: "What property mix is common in Mount Lavinia?", answer: "Apartments, detached homes, and occasional residential land plots." }
        ],
        statsJson: { averageSaleLkr: 31200000, activeListings: 6 },
        published: true
      }
    ]
  });

  await prisma.guide.createMany({
    data: [
      {
        id: "guide-1",
        slug: "renting-in-colombo-checklist",
        title: "Renting in Colombo: practical checklist",
        excerpt: "A compact guide for evaluating commute, budget, utilities, and verification signals.",
        bodyMd: "Review the location carefully, ask about utility billing, and verify who actually controls the property before you commit.",
        metaTitle: "Renting in Colombo checklist",
        metaDescription: "A starter checklist for renters comparing Greater Colombo properties.",
        authorUserId: "user-admin-1",
        publishedAt: minusDays(12)
      },
      {
        id: "guide-2",
        slug: "how-to-compare-apartments-in-colombo",
        title: "How to compare apartments in Colombo",
        excerpt: "Look beyond photos and compare layout efficiency, parking, maintenance, and travel time.",
        bodyMd: "A stronger apartment choice usually combines realistic maintenance cost, practical parking, and a commute you can sustain daily.",
        metaTitle: "Compare Colombo apartments",
        metaDescription: "Simple advice for comparing apartments in the Greater Colombo market.",
        authorUserId: "user-admin-1",
        publishedAt: minusDays(7)
      }
    ]
  });

  await prisma.duplicateCluster.create({
    data: {
      id: duplicateClusterId,
      clusterKey: "seed-rajagiriya-apartment-dup",
      confidenceScore: 0.91,
      status: "PENDING",
      reviewedByUserId: null,
      reviewedAt: null,
      createdAt: minusDays(2)
    }
  });

  await prisma.duplicateClusterItem.createMany({
    data: [
      {
        id: "dup-item-1",
        duplicateClusterId,
        listingId: duplicateListingA.id,
        matchScore: 0.93,
        matchReasonsJson: { samePhone: true, similarPhotos: true, sameArea: true }
      },
      {
        id: "dup-item-2",
        duplicateClusterId,
        listingId: duplicateListingB.id,
        matchScore: 0.89,
        matchReasonsJson: { samePhone: true, similarTitle: true, sameArea: true }
      }
    ]
  });

  await prisma.searchEvent.createMany({
    data: [
      {
        id: "search-event-1",
        userId: "user-seeker-1",
        sessionId: "session-seed-1",
        queryText: "furnished apartment colombo 05",
        filtersJson: { listingType: "rent", locationSlug: "colombo-05", furnishingLevel: "FURNISHED" },
        resultCount: 6,
        createdAt: minusDays(2)
      },
      {
        id: "search-event-2",
        userId: "user-seeker-2",
        sessionId: "session-seed-2",
        queryText: "land mount lavinia",
        filtersJson: { listingType: "sale", propertyType: "LAND", locationSlug: "mount-lavinia" },
        resultCount: 3,
        createdAt: minusDays(1)
      }
    ]
  });

  await prisma.listingViewEvent.createMany({
    data: [
      {
        id: "listing-view-1",
        listingId: listings[0].id,
        userId: "user-seeker-1",
        sessionId: "session-seed-1",
        source: "search_results",
        createdAt: minusDays(2)
      },
      {
        id: "listing-view-2",
        listingId: listings[4].id,
        userId: "user-seeker-2",
        sessionId: "session-seed-2",
        source: "saved_listings",
        createdAt: minusDays(1)
      },
      {
        id: "listing-view-3",
        listingId: listings[18].id,
        userId: null,
        sessionId: "session-guest-1",
        source: "area_page",
        createdAt: minusDays(3)
      }
    ]
  });
}

export async function seed() {
  await resetDatabase();
  await seedLocations();
  await seedUsers();
  await seedListings();
  await seedSupportingRecords();

  return {
    seeded: true,
    counts: {
      locations: locations.length,
      users: users.length,
      profiles: profiles.length,
      listings: listings.length,
      listingImages: listings.reduce((total, listing) => total + listing.imageCount, 0),
      savedListings: 6,
      savedSearches: 3,
      inquiries: 5,
      reports: 3,
      areaPages: 3,
      guides: 2,
      duplicateClusters: 1,
      searchEvents: 2,
      listingViewEvents: 3
    }
  } as const;
}

async function main() {
  const result = await seed();
  console.log(JSON.stringify(result, null, 2));
}

void main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
