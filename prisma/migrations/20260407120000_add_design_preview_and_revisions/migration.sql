-- AlterTable: PortalUser'a tasarım önizleme alanları
ALTER TABLE "PortalUser" ADD COLUMN "stagingUrl" TEXT;
ALTER TABLE "PortalUser" ADD COLUMN "designApprovedAt" TIMESTAMP(3);

-- CreateTable: DesignRevision (append-only revizyon talep geçmişi)
CREATE TABLE "DesignRevision" (
    "id" TEXT NOT NULL,
    "portalUserId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "stagingUrlAtTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignRevision_portalUserId_createdAt_idx" ON "DesignRevision"("portalUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "DesignRevision" ADD CONSTRAINT "DesignRevision_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
