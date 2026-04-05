-- Müşteri Portal Sistemi — Manuel Migration
-- Production'da SSH ile çalıştır

-- PortalUser tablosu
CREATE TABLE IF NOT EXISTS "PortalUser" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "proposalId" TEXT NOT NULL,
  "firmName" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PortalUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PortalUser_email_key" ON "PortalUser"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "PortalUser_proposalId_key" ON "PortalUser"("proposalId");

ALTER TABLE "PortalUser" ADD CONSTRAINT "PortalUser_proposalId_fkey"
  FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PortalMessage tablosu
CREATE TABLE IF NOT EXISTS "PortalMessage" (
  "id" TEXT NOT NULL,
  "portalUserId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "senderType" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PortalMessage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PortalMessage" ADD CONSTRAINT "PortalMessage_portalUserId_fkey"
  FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PortalFile tablosu
CREATE TABLE IF NOT EXISTS "PortalFile" (
  "id" TEXT NOT NULL,
  "portalUserId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileType" TEXT NOT NULL,
  "uploadedBy" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PortalFile_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PortalFile" ADD CONSTRAINT "PortalFile_portalUserId_fkey"
  FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Milestone tablosuna onay alanları ekle
ALTER TABLE "Milestone" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Milestone" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);
ALTER TABLE "Milestone" ADD COLUMN IF NOT EXISTS "approvedBy" TEXT;
