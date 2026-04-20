// Sprint 3.2 — Lead Status History helper
// Idempotent + try/catch sarmalı: history bozulsa bile ana akış durmaz.

import { prisma } from "@/lib/prisma";
// Circular import önleme: LeadStatus type'ını doğrudan Prisma'dan al,
// actions/leads'ten değil (leads.ts zaten bu dosyayı import ediyor).
import type { LeadStatus } from "@/app/generated/prisma/client";

export type StatusChangeReason =
  | "manual"              // kanban drag
  | "lead_created"        // yeni lead oluşturma (fromStatus null)
  | "wa_template_added"   // WA şablonu eklendi
  | "wa_sent"             // WA gönderildi
  | "contract_signed"     // sözleşme imzalandı (public endpoint)
  | "client_conversion"   // CRM'e taşındı
  | "opt_out";            // KVKK m.7 veri silme talebi (public endpoint)

/**
 * logLeadStatusChange — status değişimini audit tablosuna yazar.
 *
 * Idempotency: fromStatus === toStatus ise yazmaz (kanban kartı aynı
 * kolona bırakınca gürültü yapmasın diye).
 *
 * Hata yutar: history yazımı başarısız olsa bile ana iş akışı
 * (updateLeadStatus, contract sign, vb.) kesilmez. Sadece console'a düşer.
 */
export async function logLeadStatusChange(params: {
  leadId: string;
  fromStatus: LeadStatus | null;
  toStatus: LeadStatus;
  reason: StatusChangeReason;
  changedBy?: string | null;
}): Promise<void> {
  const { leadId, fromStatus, toStatus, reason, changedBy } = params;

  // Idempotency: aynı status'a geçişte log yazma
  if (fromStatus !== null && fromStatus === toStatus) return;

  try {
    await prisma.leadStatusHistory.create({
      data: {
        leadId,
        fromStatus,
        toStatus,
        reason,
        changedBy: changedBy || null,
      },
    });
  } catch (err) {
    console.error("[lead-history] log hatası (kritik değil):", err);
  }
}
