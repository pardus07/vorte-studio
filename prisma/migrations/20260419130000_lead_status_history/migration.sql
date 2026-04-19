-- Sprint 3.2 — Lead Status History
-- Status değişimlerinin audit log'u. Satış funnel analytics için gerekli.
-- Cascade delete: Lead silinirse history de gider (veri bütünlüğü).

CREATE TABLE "LeadStatusHistory" (
    "id"         TEXT NOT NULL,
    "leadId"     TEXT NOT NULL,
    "fromStatus" "LeadStatus",
    "toStatus"   "LeadStatus" NOT NULL,
    "changedBy"  TEXT,
    "reason"     TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LeadStatusHistory_leadId_createdAt_idx"
    ON "LeadStatusHistory"("leadId", "createdAt");

ALTER TABLE "LeadStatusHistory"
    ADD CONSTRAINT "LeadStatusHistory_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
