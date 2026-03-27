"use server";

import { prisma } from "@/lib/prisma";

// Puanlama (0-100) — yüksek skor = daha iyi müşteri adayı
export function calculateScore(item: {
  website?: string | null;
  mobileScore?: number | null;
  ssl?: boolean;
  reviewsCount?: number | null;
  phone?: string | null;
}): number {
  let score = 0;
  if (!item.website) score += 40;
  if (item.mobileScore && item.mobileScore < 50) score += 25;
  if (item.ssl === false) score += 15;
  if (item.reviewsCount && item.reviewsCount >= 50) score += 10;
  if (item.phone) score += 5;
  return Math.min(score, 100);
}

export function getIssueLabel(item: {
  website?: string | null;
  mobileScore?: number | null;
  ssl?: boolean;
}): string {
  if (!item.website) return "Site yok";
  if (item.mobileScore && item.mobileScore < 50)
    return `Mobil ${item.mobileScore}/100`;
  if (item.ssl === false) return "SSL yok";
  return "Düşük öncelik";
}

export async function startSearch(city: string, category: string) {
  const batch = await prisma.prospectBatch.create({
    data: {
      query: `${category} in ${city}`,
      city,
      category,
      status: "completed", // Mock: anında tamamlanmış
      totalFound: 0,
    },
  });
  return { batchId: batch.id };
}

export async function getRecentBatch() {
  return prisma.prospectBatch.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      prospects: { orderBy: { score: "desc" } },
    },
  });
}

export async function saveProspects(
  batchId: string,
  prospects: {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    googleRating?: number;
    googleReviews?: number;
    googleMapsUrl?: string;
    mobileScore?: number;
    hasWebsite: boolean;
    score: number;
    issue?: string;
  }[]
) {
  await prisma.prospect.createMany({
    data: prospects.map((p) => ({ ...p, batchId })),
  });
  await prisma.prospectBatch.update({
    where: { id: batchId },
    data: { totalFound: prospects.length, status: "completed" },
  });
}

export async function addProspectToLead(prospectId: string) {
  const prospect = await prisma.prospect.findUnique({
    where: { id: prospectId },
  });
  if (!prospect) throw new Error("Prospect bulunamadı");

  await prisma.lead.create({
    data: {
      name: prospect.name,
      phone: prospect.phone,
      email: prospect.email,
      website: prospect.website,
      address: prospect.address,
      googleRating: prospect.googleRating,
      googleReviews: prospect.googleReviews,
      googleMapsUrl: prospect.googleMapsUrl,
      mobileScore: prospect.mobileScore,
      hasWebsite: prospect.hasWebsite,
      score: prospect.score,
      source: "MAPS_SCRAPER",
      status: "COLD",
    },
  });

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { addedToLeads: true },
  });
}

export async function getProspectsByBatch(batchId: string) {
  return prisma.prospect.findMany({
    where: { batchId },
    orderBy: { score: "desc" },
  });
}
