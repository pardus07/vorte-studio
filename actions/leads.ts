"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const LeadFormSchema = z.object({
  name: z.string().min(2, "İşletme adı en az 2 karakter olmalı"),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Geçerli e-posta girin").optional().or(z.literal("")),
  sector: z.string().optional(),
  source: z.enum(["MAPS_SCRAPER", "SITE_FORM", "LINKEDIN", "REFERRAL", "MANUAL"]),
  budget: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["COLD", "CONTACTED", "MEETING", "QUOTED", "WON", "LOST"]).optional(),
});

export type LeadFormData = z.infer<typeof LeadFormSchema>;

export async function createLeadAction(data: LeadFormData) {
  try {
    const parsed = LeadFormSchema.parse(data);
    await prisma.lead.create({
      data: {
        name: parsed.name,
        company: parsed.company || null,
        phone: parsed.phone || null,
        email: parsed.email || null,
        sector: parsed.sector || null,
        source: parsed.source,
        budget: parsed.budget || null,
        notes: parsed.notes || null,
        status: parsed.status || "COLD",
      },
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

export async function updateLeadStatus(
  id: string,
  status: "COLD" | "CONTACTED" | "MEETING" | "QUOTED" | "WON" | "LOST"
) {
  const lead = await prisma.lead.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/leads");
  return lead;
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

    const client = await prisma.client.create({
      data: {
        name: lead.name,
        company: lead.company ?? undefined,
        email: lead.email ?? undefined,
        phone: lead.phone ?? undefined,
        sector: lead.sector ?? undefined,
        status: "ACTIVE",
        notes: lead.budget ? `Bütçe: ${lead.budget}` : undefined,
      },
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "WON" },
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
