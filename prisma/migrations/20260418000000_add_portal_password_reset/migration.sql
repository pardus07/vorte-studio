-- CreateTable
CREATE TABLE "PortalPasswordReset" (
    "id" TEXT NOT NULL,
    "portalUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "PortalPasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortalPasswordReset_token_key" ON "PortalPasswordReset"("token");

-- CreateIndex
CREATE INDEX "PortalPasswordReset_portalUserId_createdAt_idx" ON "PortalPasswordReset"("portalUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "PortalPasswordReset" ADD CONSTRAINT "PortalPasswordReset_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "PortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
