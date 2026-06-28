-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AuctionInvitation" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuctionInvitation_token_key" ON "AuctionInvitation"("token");

-- AddForeignKey
ALTER TABLE "AuctionInvitation" ADD CONSTRAINT "AuctionInvitation_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
