"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  return prisma.lead.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function createLead(data: {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  sector?: string;
  source: "MAPS_SCRAPER" | "SITE_FORM" | "LINKEDIN" | "REFERRAL" | "MANUAL";
  budget?: string;
  notes?: string;
}) {
  return prisma.lead.create({ data });
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
