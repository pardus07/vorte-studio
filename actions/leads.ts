"use server";

import { prisma } from "@/lib/prisma";

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
  return prisma.lead.update({
    where: { id },
    data: { status },
  });
}
