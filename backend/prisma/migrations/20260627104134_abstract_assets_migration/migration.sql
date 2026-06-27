/*
  Warnings:

  - You are about to drop the column `propertyId` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[assetId]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('PROPERTY', 'VEHICLE', 'CONSTRUCTION_MACHINERY', 'AGRI_MACHINERY', 'INDUSTRIAL_EQUIPMENT', 'TOOLS_WELDING', 'BATTERIES_ENERGY', 'IT_COMPUTERS', 'VALUABLES_ART', 'OTHER');

-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_sellerId_fkey";

-- DropIndex
DROP INDEX "Auction_propertyId_key";

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "propertyId",
ADD COLUMN     "assetId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "iban" TEXT;

-- DropTable
DROP TABLE "Property";

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL DEFAULT 'PROPERTY',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "startPrice" DECIMAL(65,30),
    "reservePrice" DECIMAL(65,30),
    "images" JSONB,
    "documents" JSONB,
    "specifications" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrls" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedAuction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedAuction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KycRequest_externalId_key" ON "KycRequest"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedAuction_userId_auctionId_key" ON "SavedAuction"("userId", "auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_assetId_key" ON "Auction"("assetId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycRequest" ADD CONSTRAINT "KycRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedAuction" ADD CONSTRAINT "SavedAuction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedAuction" ADD CONSTRAINT "SavedAuction_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
