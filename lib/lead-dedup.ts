// Sprint 3.6a — Lead Dedup helper
// 3-seviye öncelikli eşleşme: googleMapsUrl → phone → (name+sector).
// Her biri null-safe: alan yoksa sonraki seviyeye düşer.
//
// Eşleşme bulunursa logDuplicate() ile LeadDuplicateLog'a audit kaydı.
// Log hatası yutulur (try/catch) → ana akış durmaz.

import { prisma } from "@/lib/prisma";

export type DedupMatchReason = "GOOGLE_MAPS_URL" | "PHONE" | "NAME_SECTOR";
export type DedupSource = "MAPS_SCRAPER" | "MANUAL_ADMIN";

export type DedupMatch = {
  leadId: string;
  leadName: string;
  matchReason: DedupMatchReason;
};

/**
 * MAPS_SCRAPER kaynaklı lead'lerde duplicate arar.
 * Öncelik sırası:
 *   1) googleMapsUrl — Google Places ID, en güvenilir
 *   2) phone — raw string eşleşmesi (formatla bozulmasın diye temizlik
 *      çağıran tarafta yapılmalı)
 *   3) name (case-insensitive) + sector — son çare
 *
 * Not: source filtresi MAPS_SCRAPER — SITE_FORM veya MANUAL ayrı akış;
 * aynı telefon farklı kaynaklarda olabilir (örn. aynı kişi hem chat'e
 * hem scrape'ten gelir, bunlar aynı firma ama farklı olay).
 */
export async function findExistingScraperLead(input: {
  name: string;
  phone: string | null;
  googleMapsUrl: string | null;
  sector: string | null;
}): Promise<DedupMatch | null> {
  // 1. googleMapsUrl — Google Places URL ID
  if (input.googleMapsUrl) {
    const m = await prisma.lead.findFirst({
      where: {
        googleMapsUrl: input.googleMapsUrl,
        source: "MAPS_SCRAPER",
      },
      select: { id: true, name: true },
    });
    if (m) return { leadId: m.id, leadName: m.name, matchReason: "GOOGLE_MAPS_URL" };
  }

  // 2. phone — raw eşleşme. Temizlik çağıran tarafta:
  //    genelde +90xxx / 0xxx / boşluklu format gelir, ileride normalize
  //    yardımcısı eklenebilir. Şu an DB'ye ne yazıldıysa onu arıyoruz.
  if (input.phone) {
    const m = await prisma.lead.findFirst({
      where: { phone: input.phone, source: "MAPS_SCRAPER" },
      select: { id: true, name: true },
    });
    if (m) return { leadId: m.id, leadName: m.name, matchReason: "PHONE" };
  }

  // 3. name (case-insensitive) + sector fallback
  const m = await prisma.lead.findFirst({
    where: {
      name: { equals: input.name, mode: "insensitive" },
      sector: input.sector,
      source: "MAPS_SCRAPER",
    },
    select: { id: true, name: true },
  });
  if (m) return { leadId: m.id, leadName: m.name, matchReason: "NAME_SECTOR" };

  return null;
}

/**
 * Duplicate reddini audit tablosuna yazar.
 * Hata yutar — log başarısız olsa bile ana akış (reddetme/cevap dönme)
 * kesilmez. Sadece console'a düşer.
 */
export async function logDuplicate(params: {
  attemptedName: string;
  attemptedPhone: string | null;
  attemptedGoogleMapsUrl: string | null;
  attemptedSector: string | null;
  matchedLeadId: string;
  matchReason: DedupMatchReason;
  duplicateSource: DedupSource;
}): Promise<void> {
  try {
    await prisma.leadDuplicateLog.create({
      data: params,
    });
  } catch (err) {
    console.error("[lead-dedup] log hatası (kritik değil):", err);
  }
}

/**
 * Kullanıcıya gösterilebilecek Türkçe eşleşme sebebi.
 */
export function matchReasonLabel(r: DedupMatchReason): string {
  switch (r) {
    case "GOOGLE_MAPS_URL": return "Google Maps linki";
    case "PHONE":           return "telefon";
    case "NAME_SECTOR":     return "isim + sektör";
  }
}
