"use server";

import { prisma } from "@/lib/prisma";
import { auditWebsite } from "@/lib/pagespeed";

// Puanlama (0-100) — yüksek skor = daha iyi müşteri adayı
export async function calculateScore(item: {
  website?: string | null;
  mobileScore?: number | null;
  sslValid?: boolean;
  reviewsCount?: number | null;
  phone?: string | null;
}): Promise<number> {
  let score = 0;

  if (!item.website)                                    score += 40;
  if (item.mobileScore !== null && item.mobileScore !== undefined) {
    if (item.mobileScore < 50)                          score += 25;
    else if (item.mobileScore < 70)                     score += 15;
  }
  if (item.sslValid === false)                          score += 15;
  if (item.reviewsCount && item.reviewsCount >= 50)     score += 10;
  if (item.phone)                                       score += 5;

  return Math.min(score, 100);
}

export async function getIssueLabel(item: {
  website?: string | null;
  mobileScore?: number | null;
  sslValid?: boolean;
}): Promise<string> {
  if (!item.website) return "Site yok";
  if (item.mobileScore !== null && item.mobileScore !== undefined) {
    if (item.mobileScore < 50) return `Mobil ${item.mobileScore}/100`;
    if (item.mobileScore < 70) return `Yavaş site (${item.mobileScore}/100)`;
  }
  if (item.sslValid === false) return "SSL yok";
  return "Düşük öncelik";
}

// Tek site PageSpeed audit — server action
export async function auditSingleWebsite(
  website: string
): Promise<{ mobileScore: number | null; sslValid: boolean }> {
  return auditWebsite(website);
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

// Scraper sonucundan lead oluşturma — dublike kontrol ile
export async function addRawProspectToLead(data: {
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  googleRating: number | null;
  googleReviews: number | null;
  score: number;
  issue: string | null;
  hasWebsite: boolean;
  mobileScore: number | null;
}) {
  try {
    // Dublike kontrol — aynı isimde lead var mı?
    const existing = await prisma.lead.findFirst({
      where: { name: data.name, source: "MAPS_SCRAPER" },
    });
    if (existing) {
      return { success: false, error: "duplicate", message: `${data.name} zaten Soğuk Lead olarak ekli.` };
    }

    await prisma.lead.create({
      data: {
        name: data.name,
        company: data.name,
        phone: data.phone,
        website: data.website,
        address: data.address,
        googleRating: data.googleRating,
        googleReviews: data.googleReviews,
        mobileScore: data.mobileScore,
        hasWebsite: data.hasWebsite,
        score: data.score,
        source: "MAPS_SCRAPER",
        status: "COLD",
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Lead kayıt hatası:", err);
    return { success: false, error: "Lead kaydedilemedi." };
  }
}

// DB'deki mevcut lead isimlerini getir (dublike kontrolü için)
export async function getExistingLeadNames(): Promise<string[]> {
  try {
    const leads = await prisma.lead.findMany({
      where: { source: "MAPS_SCRAPER" },
      select: { name: true },
    });
    return leads.map((l) => l.name);
  } catch {
    return [];
  }
}
