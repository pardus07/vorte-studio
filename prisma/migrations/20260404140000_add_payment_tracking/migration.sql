-- AlterEnum: LeadStatus — CONTRACTED ekleniyor
ALTER TYPE "LeadStatus" ADD VALUE 'CONTRACTED' BEFORE 'WON';

-- CreateTable: ProposalPayment
CREATE TABLE "ProposalPayment" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProposalPayment" ADD CONSTRAINT "ProposalPayment_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
