"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { logLeadStatusChange } from "@/lib/lead-history";
// FAZ C — Madde 3.5: Client.acquisitionSource için LeadSource mapper
import { leadSourceToAcquisitionSource } from "@/lib/constants";

// ── Admin kullanıcıyı string olarak al ──
// auth() session'da user varsa email kullanır; yoksa "admin" fallback.
// Public endpoint'ler için "system" manuel geçilir (logLeadStatusChange'e).
async function getChangedByFromSession(): Promise<string> {
  try {
    const session = await auth();
    return session?.user?.email || "admin";
  } catch {
    return "admin";
  }
}

// ── Lead status'u için tek doğruluk kaynağı ──
// updateLeadStatus param type'ı ile form schema'nın drift etmesini önler.
// Prisma LeadStatus enum'unu burada aynalıyoruz (CONTRACTED dahil).
export const LeadStatusSchema = z.enum([
  "COLD",
  "TEMPLATE_ADDED",
  "WA_SENT",
  "CONTACTED",
  "MEETING",
  "QUOTED",
  "CONTRACTED",
  "WON",
  "LOST",
]);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

// ── Telefon: Türkiye cep formatı (opsiyonel) ──
// Kabul edilen formatlar:
//   +905551234567, 05551234567, 5551234567
// Boş string de kabul (form'da alan boşsa).
const PhoneOptionalSchema = z
  .string()
  .trim()
  .max(20)
  .refine(
    (v) => v === "" || /^(\+90|0)?5\d{9}$/.test(v.replace(/\s+/g, "")),
    { message: "Geçerli bir cep telefonu girin (örn: 05XX XXX XX XX)" }
  )
  .optional();

// ── Form şeması ──
// NOT: googleRating, googleReviews, mobileScore, hasWebsite, sslValid,
// waTemplate*, waSentAt gibi alanlar form'dan GELMEZ — scraper ya da
// iş akışı tarafından yazılır. Bilerek schema dışında tutuluyorlar.
const LeadFormSchema = z.object({
  name: z.string().trim().min(2, "İşletme adı en az 2 karakter olmalı").max(200),
  company: z.string().trim().max(200).optional(),
  phone: PhoneOptionalSchema,
  // Boş string input'u undefined'a çevir — DB'de "" yerine NULL tutmak için
  email: z
    .string()
    .trim()
    .email("Geçerli e-posta girin")
    .max(320)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  sector: z.string().trim().max(100).optional(),
  source: z.enum(["MAPS_SCRAPER", "SITE_FORM", "LINKEDIN", "REFERRAL", "MANUAL"]),
  budget: z.string().trim().max(100).optional(),
  notes: z.string().max(2000).optional(),
  status: LeadStatusSchema.optional(),
})
  // Sprint 3.6c — Madde 3.4: Lead oluştururken e-posta VEYA telefon zorunlu.
  // İkisi de boşsa satış ekibi iletişim kuramaz, lead ölü kayıt olur.
  // .refine() cross-field validation için Zod'un standart yolu; hata mesajı
  // phone alanına iliştirildi çünkü form'da daha belirgin.
  .refine(
    (data) =>
      (typeof data.email === "string" && data.email.length > 0) ||
      (typeof data.phone === "string" && data.phone.length > 0),
    {
      message: "E-posta veya telefon numarası zorunludur",
      path: ["phone"],
    }
  );

export type LeadFormData = z.infer<typeof LeadFormSchema>;

export async function createLeadAction(data: LeadFormData) {
  try {
    const parsed = LeadFormSchema.parse(data);
    const initialStatus = parsed.status || "COLD";
    const created = await prisma.lead.create({
      data: {
        name: parsed.name,
        company: parsed.company || null,
        phone: parsed.phone || null,
        email: parsed.email || null,
        sector: parsed.sector || null,
        source: parsed.source,
        budget: parsed.budget || null,
        notes: parsed.notes || null,
        status: initialStatus,
      },
    });
    // Sprint 3.2 — manuel lead oluşturma da history'ye düşer
    await logLeadStatusChange({
      leadId: created.id,
      fromStatus: null,
      toStatus: initialStatus,
      reason: "lead_created",
      changedBy: await getChangedByFromSession(),
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    console.error("Lead oluşturma hatası:", err);
    return { success: false, error: "Lead oluşturulamadı." };
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  // Runtime guard — admin UI'den bozuk veri gelirse Prisma fail olmadan
  // burada reddet. Geriye dönük uyum için throw atılır; mevcut kanban
  // caller'ı try/catch ile hatayı yakalıyor.
  const parsedStatus = LeadStatusSchema.parse(status);
  // Sprint 3.2 — önceki status'u oku (history için). findUnique + update
  // arası race olabilir ama tek admin kullanıcıda pratik sorun yok.
  const prev = await prisma.lead.findUnique({
    where: { id },
    select: { status: true },
  });
  const lead = await prisma.lead.update({
    where: { id },
    data: { status: parsedStatus },
  });
  await logLeadStatusChange({
    leadId: id,
    fromStatus: prev?.status ?? null,
    toStatus: parsedStatus,
    reason: "manual",
    changedBy: await getChangedByFromSession(),
  });
  revalidatePath("/admin/leads");
  return lead;
}

// ── WA Şablon ekle ──
export async function addWaTemplateToLead(
  leadId: string,
  waTemplate: string,
  waTemplateSector: string,
  waTemplateSlug: string
) {
  try {
    const prev = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { status: true },
    });
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        waTemplate,
        waTemplateSector,
        waTemplateSlug,
        status: "TEMPLATE_ADDED",
      },
    });
    await logLeadStatusChange({
      leadId,
      fromStatus: prev?.status ?? null,
      toStatus: "TEMPLATE_ADDED",
      reason: "wa_template_added",
      changedBy: await getChangedByFromSession(),
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err) {
    console.error("Şablon ekleme hatası:", err);
    return { success: false, error: "Şablon eklenemedi." };
  }
}

// ── WA gönderildi olarak işaretle ──
export async function markWaSent(leadId: string) {
  try {
    const prev = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { status: true },
    });
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "WA_SENT",
        waSentAt: new Date(),
      },
    });
    await logLeadStatusChange({
      leadId,
      fromStatus: prev?.status ?? null,
      toStatus: "WA_SENT",
      reason: "wa_sent",
      changedBy: await getChangedByFromSession(),
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err) {
    console.error("WA gönderim kaydı hatası:", err);
    return { success: false, error: "Gönderim kaydedilemedi." };
  }
}

export async function updateLeadSector(id: string, sector: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { sector },
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    return { success: false, error: "Sektör güncellenemedi." };
  }
}

// Birden fazla lead'e aynı sektörü topluca atar.
// Boş/geçersiz id dizisi gelirse güvenli şekilde 0 döner.
export async function bulkUpdateLeadsSector(ids: string[], sector: string) {
  try {
    if (!ids.length || !sector.trim()) {
      return { success: false, error: "ID listesi veya sektör boş." };
    }
    const result = await prisma.lead.updateMany({
      where: { id: { in: ids } },
      data: { sector },
    });
    revalidatePath("/admin/leads");
    return { success: true, count: result.count };
  } catch {
    return { success: false, error: "Sektörler güncellenemedi." };
  }
}

export async function updateLeadNotes(id: string, notes: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { notes },
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch {
    return { success: false, error: "Notlar kaydedilemedi." };
  }
}

export async function convertLeadToClient(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { success: false, error: "Lead bulunamadı." };

    // FAZ C 3.5: Acquisition izlenebilirliği — Lead.source'tan map et,
    // createdAt'i kaynak tarihi olarak sabitle, Lead.id ile FK bağla.
    const client = await prisma.client.create({
      data: {
        name: lead.name,
        company: lead.company ?? undefined,
        email: lead.email ?? undefined,
        phone: lead.phone ?? undefined,
        sector: lead.sector ?? undefined,
        status: "ACTIVE",
        notes: lead.budget ? `Bütçe: ${lead.budget}` : undefined,
        acquisitionSource: leadSourceToAcquisitionSource(lead.source),
        acquisitionDate: lead.createdAt,
        originalLeadId: lead.id,
      },
    });

    const prevLead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { status: true },
    });
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "WON" },
    });
    await logLeadStatusChange({
      leadId,
      fromStatus: prevLead?.status ?? null,
      toStatus: "WON",
      reason: "client_conversion",
      changedBy: await getChangedByFromSession(),
    });

    await prisma.activity.create({
      data: {
        clientId: client.id,
        type: "lead_converted",
        description: `Lead'den dönüştürüldü: ${lead.name}`,
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/crm");

    return { success: true, clientId: client.id, clientName: client.name };
  } catch (err) {
    console.error("Lead dönüştürme hatası:", err);
    return { success: false, error: "Lead CRM'e taşınamadı." };
  }
}

// Sprint 3.2 — Lead status geçmişini oku (detail modal için).
// En yeni değişim en üstte döner.
export async function getLeadHistory(leadId: string) {
  try {
    const history = await prisma.leadStatusHistory.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      take: 50, // 50'den fazla ihtiyaç olmaz; güvenlik limiti
    });
    return { success: true as const, history };
  } catch (err) {
    console.error("Lead history okuma hatası:", err);
    return { success: false as const, error: "Geçmiş yüklenemedi.", history: [] };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/admin/leads");
    revalidatePath("/admin/prospect");
    return { success: true };
  } catch (err) {
    console.error("Lead silme hatası:", err);
    return { success: false, error: "Lead silinemedi." };
  }
}
