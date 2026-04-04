-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "submissionId" TEXT,
    "leadId" TEXT,
    "firmName" TEXT NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "sector" TEXT,
    "city" TEXT,
    "siteType" TEXT,
    "features" JSONB NOT NULL DEFAULT '[]',
    "pageCount" TEXT,
    "contentStatus" TEXT,
    "hostingStatus" TEXT,
    "hostingProvider" TEXT,
    "domainStatus" TEXT,
    "domainName" TEXT,
    "timeline" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "estimatedHours" DOUBLE PRECISION,
    "paymentPlan" JSONB NOT NULL DEFAULT '[]',
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3) NOT NULL,
    "adminNotes" TEXT,
    "viewedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_token_key" ON "Proposal"("token");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ChatSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
