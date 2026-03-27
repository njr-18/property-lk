-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'AGENT', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('RENT', 'SALE');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('ROOM', 'ANNEX', 'HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "FurnishingLevel" AS ENUM ('UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED');

-- CreateEnum
CREATE TYPE "ListedByType" AS ENUM ('OWNER', 'AGENT', 'BUILDER');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'EXPIRED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MapPrecision" AS ENUM ('EXACT', 'APPROXIMATE', 'AREA_ONLY');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED', 'SPAM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsappNumber" TEXT,
    "passwordHash" TEXT,
    "preferredLanguage" TEXT DEFAULT 'en',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "companyName" TEXT,
    "agencyName" TEXT,
    "licenseNumber" TEXT,
    "city" TEXT,
    "district" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT,
    "areaName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "parentLocationId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "priceLkr" INTEGER NOT NULL,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'LKR',
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parkingSlots" INTEGER,
    "floorAreaSqft" INTEGER,
    "landSizePerches" DOUBLE PRECISION,
    "furnishingLevel" "FurnishingLevel",
    "availabilityStatus" "AvailabilityStatus" NOT NULL DEFAULT 'DRAFT',
    "listedByType" "ListedByType" NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'DIRECT',
    "ownerUserId" TEXT,
    "agentUserId" TEXT,
    "primaryLocationId" TEXT NOT NULL,
    "addressLine" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mapPrecision" "MapPrecision" NOT NULL DEFAULT 'APPROXIMATE',
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactWhatsapp" TEXT,
    "contactEmail" TEXT,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isWhatsappVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOwnerVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAgencyVerified" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "freshnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceBandScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "inquiryCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingImage" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storageKey" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "blurhash" TEXT,
    "perceptualHash" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingFeature" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "featureValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingVersion" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changedByUserId" TEXT,
    "changeSummary" TEXT,
    "snapshotJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingSourceRecord" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceExternalId" TEXT,
    "sourceUrl" TEXT,
    "rawPayloadJson" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingSourceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "searchParamsJson" JSONB NOT NULL,
    "alertEnabled" BOOLEAN NOT NULL DEFAULT true,
    "alertFrequency" TEXT NOT NULL DEFAULT 'daily',
    "lastAlertSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "preferredContactMethod" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingVerification" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "verifiedByUserId" TEXT,
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuplicateCluster" (
    "id" TEXT NOT NULL,
    "clusterKey" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DuplicateCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuplicateClusterItem" (
    "id" TEXT NOT NULL,
    "duplicateClusterId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "matchReasonsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DuplicateClusterItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reporterUserId" TEXT,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaPage" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "faqJson" JSONB,
    "statsJson" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "bodyMd" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "authorUserId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "queryText" TEXT,
    "filtersJson" JSONB,
    "resultCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingViewEvent" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE INDEX "Location_district_city_areaName_idx" ON "Location"("district", "city", "areaName");

-- CreateIndex
CREATE INDEX "Location_parentLocationId_idx" ON "Location"("parentLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_publicId_key" ON "Listing"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- CreateIndex
CREATE INDEX "Listing_listingType_propertyType_priceLkr_idx" ON "Listing"("listingType", "propertyType", "priceLkr");

-- CreateIndex
CREATE INDEX "Listing_primaryLocationId_listingType_propertyType_idx" ON "Listing"("primaryLocationId", "listingType", "propertyType");

-- CreateIndex
CREATE INDEX "Listing_availabilityStatus_publishedAt_idx" ON "Listing"("availabilityStatus", "publishedAt");

-- CreateIndex
CREATE INDEX "ListingImage_listingId_sortOrder_idx" ON "ListingImage"("listingId", "sortOrder");

-- CreateIndex
CREATE INDEX "ListingFeature_listingId_featureKey_idx" ON "ListingFeature"("listingId", "featureKey");

-- CreateIndex
CREATE UNIQUE INDEX "ListingVersion_listingId_versionNumber_key" ON "ListingVersion"("listingId", "versionNumber");

-- CreateIndex
CREATE INDEX "ListingSourceRecord_listingId_importedAt_idx" ON "ListingSourceRecord"("listingId", "importedAt");

-- CreateIndex
CREATE INDEX "ListingSourceRecord_sourceName_sourceExternalId_idx" ON "ListingSourceRecord"("sourceName", "sourceExternalId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedListing_userId_listingId_key" ON "SavedListing"("userId", "listingId");

-- CreateIndex
CREATE INDEX "Inquiry_listingId_status_createdAt_idx" ON "Inquiry"("listingId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_userId_createdAt_idx" ON "Inquiry"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingVerification_listingId_verificationType_idx" ON "ListingVerification"("listingId", "verificationType");

-- CreateIndex
CREATE UNIQUE INDEX "DuplicateCluster_clusterKey_key" ON "DuplicateCluster"("clusterKey");

-- CreateIndex
CREATE INDEX "DuplicateCluster_status_createdAt_idx" ON "DuplicateCluster"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DuplicateClusterItem_listingId_matchScore_idx" ON "DuplicateClusterItem"("listingId", "matchScore");

-- CreateIndex
CREATE UNIQUE INDEX "DuplicateClusterItem_duplicateClusterId_listingId_key" ON "DuplicateClusterItem"("duplicateClusterId", "listingId");

-- CreateIndex
CREATE INDEX "Report_listingId_status_createdAt_idx" ON "Report"("listingId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AreaPage_pageType_published_idx" ON "AreaPage"("pageType", "published");

-- CreateIndex
CREATE UNIQUE INDEX "AreaPage_locationId_pageType_key" ON "AreaPage"("locationId", "pageType");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "Guide_publishedAt_idx" ON "Guide"("publishedAt");

-- CreateIndex
CREATE INDEX "SearchEvent_createdAt_idx" ON "SearchEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SearchEvent_userId_createdAt_idx" ON "SearchEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingViewEvent_listingId_createdAt_idx" ON "ListingViewEvent"("listingId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingViewEvent_userId_createdAt_idx" ON "ListingViewEvent"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parentLocationId_fkey" FOREIGN KEY ("parentLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_agentUserId_fkey" FOREIGN KEY ("agentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_primaryLocationId_fkey" FOREIGN KEY ("primaryLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingFeature" ADD CONSTRAINT "ListingFeature_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingVersion" ADD CONSTRAINT "ListingVersion_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingSourceRecord" ADD CONSTRAINT "ListingSourceRecord_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingVerification" ADD CONSTRAINT "ListingVerification_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuplicateClusterItem" ADD CONSTRAINT "DuplicateClusterItem_duplicateClusterId_fkey" FOREIGN KEY ("duplicateClusterId") REFERENCES "DuplicateCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuplicateClusterItem" ADD CONSTRAINT "DuplicateClusterItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaPage" ADD CONSTRAINT "AreaPage_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

