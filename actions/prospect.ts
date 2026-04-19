"use server";

import { prisma } from "@/lib/prisma";
import { auditWebsite } from "@/lib/pagespeed";
import {
  findExistingScraperLead,
  logDuplicate,
  matchReasonLabel,
} from "@/lib/lead-dedup";

// Sprint 3.6b — Aşama 1 temizlik
// Prospect/ProspectBatch tabloları fiilen kullanılmadığı için
// aşağıdaki server action'lar kaldırıldı (hiçbir UI çağırmıyordu):
//   - calculateScore / getIssueLabel  → scoring artık client-side
//   - startSearch / getRecentBatch / saveProspects / getProspectsByBatch
//     → ProspectBatch akışı hiç kullanılmadı (0 kayıt)
//   - addProspectToLead → addRawProspectToLead yerine geçti
//
// Prisma modeli korundu (ProspectPage/Event/OptOut altyapısı bu ailededir),
// ileride scraper batch sistemi tekrar lazım olursa şema hazır.

// Tek site PageSpeed audit — UI'de kullanılıyor
export async function auditSingleWebsite(
  website: string
): Promise<{ mobileScore: number | null; sslValid: boolean }> {
  return auditWebsite(website);
}

// Scraper sonucundan lead oluşturma — Sprint 3.6a: 3-seviye dedup.
// Öncelik: googleMapsUrl → phone → (name+sector).
// Duplicate bulunursa LeadDuplicateLog'a yaz, kullanıcıya eşleşme
// sebebi + mevcut lead id'sini dön.
export async function addRawProspectToLead(data: {
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  googleRating: number | null;
  googleReviews: number | null;
  googleMapsUrl?: string | null;   // UI henüz göndermiyor ama tip uyumlu
  score: number;
  issue: string | null;
  hasWebsite: boolean;
  mobileScore: number | null;
  sector: string | null;
}) {
  try {
    // 3-seviye dedup
    const match = await findExistingScraperLead({
      name: data.name,
      phone: data.phone,
      googleMapsUrl: data.googleMapsUrl ?? null,
      sector: data.sector,
    });

    if (match) {
      await logDuplicate({
        attemptedName: data.name,
        attemptedPhone: data.phone,
        attemptedGoogleMapsUrl: data.googleMapsUrl ?? null,
        attemptedSector: data.sector,
        matchedLeadId: match.leadId,
        matchReason: match.matchReason,
        duplicateSource: "MAPS_SCRAPER",
      });
      return {
        success: false,
        error: "duplicate",
        matchedLeadId: match.leadId,
        matchedLeadName: match.leadName,
        matchReason: match.matchReason,
        message: `${data.name} zaten Soğuk Lead olarak ekli (eşleşme: ${matchReasonLabel(match.matchReason)}).`,
      };
    }

    const created = await prisma.lead.create({
      data: {
        name: data.name,
        company: data.name,
        phone: data.phone,
        website: data.website,
        address: data.address,
        googleRating: data.googleRating,
        googleReviews: data.googleReviews,
        googleMapsUrl: data.googleMapsUrl ?? null,
        mobileScore: data.mobileScore,
        hasWebsite: data.hasWebsite,
        score: data.score,
        sector: data.sector,
        source: "MAPS_SCRAPER",
        status: "COLD",
      },
    });
    return { success: true, leadId: created.id };
  } catch (err) {
    // Partial unique index ihlali → race condition (iki paralel request)
    // Prisma P2002 döner; kullanıcıya "duplicate" olarak göster.
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      console.warn("[addRawProspectToLead] DB-level unique index yakaladı:", err);
      return {
        success: false,
        error: "duplicate",
        message: `${data.name} aynı anda eklendi (eşzamanlı istek).`,
      };
    }
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

// ── Google Maps Link veya Firma Adı ile Tek Firma Arama ──

/**
 * Google Maps share linki (maps.app.goo.gl/xxx) veya firma adı ile arama yapar.
 * Link ise → redirect takip edip firma adını çıkarır → scraper'a gönderir
 * İsim ise → direkt scraper'a query olarak gönderir
 */
export async function resolveGoogleMapsLink(input: string): Promise<{
  success: boolean;
  query?: string;
  error?: string;
}> {
  const trimmed = input.trim();

  // Google Maps short link mi?
  if (trimmed.includes("maps.app.goo.gl") || trimmed.includes("goo.gl/maps")) {
    try {
      // Short link'i takip et — redirect'i manual al
      const res = await fetch(trimmed, { redirect: "manual" });
      const location = res.headers.get("location");
      if (!location) {
        return { success: false, error: "Link çözümlenemedi." };
      }

      // İkinci redirect olabilir (maps.app.goo.gl → google.com/maps/...)
      let finalUrl = location;
      if (finalUrl.includes("goo.gl") || !finalUrl.includes("/maps/")) {
        try {
          const res2 = await fetch(finalUrl, { redirect: "manual" });
          const loc2 = res2.headers.get("location");
          if (loc2) finalUrl = loc2;
        } catch { /* ilk location'ı kullan */ }
      }

      // URL'den firma adını çıkar: /maps/place/FIRMA+ADI/@...
      const placeMatch = decodeURIComponent(finalUrl).match(/\/place\/([^/@]+)/);
      if (placeMatch) {
        const name = placeMatch[1].replace(/\+/g, " ");
        return { success: true, query: name };
      }

      // place yoksa search query'den dene
      const searchMatch = decodeURIComponent(finalUrl).match(/[?&]q=([^&]+)/);
      if (searchMatch) {
        return { success: true, query: searchMatch[1].replace(/\+/g, " ") };
      }

      return { success: false, error: "Link'ten firma adı çıkarılamadı." };
    } catch (err) {
      console.error("Maps link resolve hatası:", err);
      return { success: false, error: "Link çözümlenirken hata oluştu." };
    }
  }

  // Normal Google Maps linki (google.com/maps/place/...)
  if (trimmed.includes("google.com/maps") || trimmed.includes("google.com.tr/maps")) {
    const placeMatch = decodeURIComponent(trimmed).match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      const name = placeMatch[1].replace(/\+/g, " ");
      return { success: true, query: name };
    }
    return { success: false, error: "Maps linkinden firma adı çıkarılamadı." };
  }

  // Düz metin — firma adı olarak kullan
  if (trimmed.length < 2) {
    return { success: false, error: "En az 2 karakter girin." };
  }

  return { success: true, query: trimmed };
}

// Manuel lead ekleme — Sprint 3.6a: 3-seviye dedup (MANUAL_ADMIN source).
// Admin panelden tek firma eklerken de duplicate kontrol çalışsın ki
// scraper olmadan manuel ekleyen kullanıcı aynı firmayı iki kez girmesin.
export async function addManualLead(data: {
  name: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  googleRating: number | null;
  googleReviews: number | null;
  googleMapsUrl: string | null;
  sector?: string | null;
}) {
  try {
    const match = await findExistingScraperLead({
      name: data.name,
      phone: data.phone,
      googleMapsUrl: data.googleMapsUrl,
      sector: data.sector ?? null,
    });

    if (match) {
      await logDuplicate({
        attemptedName: data.name,
        attemptedPhone: data.phone,
        attemptedGoogleMapsUrl: data.googleMapsUrl,
        attemptedSector: data.sector ?? null,
        matchedLeadId: match.leadId,
        matchReason: match.matchReason,
        duplicateSource: "MANUAL_ADMIN",
      });
      return {
        success: false,
        error: "duplicate",
        matchedLeadId: match.leadId,
        matchedLeadName: match.leadName,
        matchReason: match.matchReason,
        message: `${data.name} zaten Lead olarak ekli (eşleşme: ${matchReasonLabel(match.matchReason)}).`,
      };
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        company: data.name,
        phone: data.phone,
        website: data.website,
        address: data.address,
        googleRating: data.googleRating,
        googleReviews: data.googleReviews,
        googleMapsUrl: data.googleMapsUrl,
        sector: data.sector || null,
        source: "MAPS_SCRAPER",
        status: "COLD",
        hasWebsite: !!data.website,
        score: data.website ? 0 : 40,
      },
    });
    return { success: true, id: lead.id };
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      console.warn("[addManualLead] DB-level unique index yakaladı:", err);
      return {
        success: false,
        error: "duplicate",
        message: `${data.name} aynı anda eklendi (eşzamanlı istek).`,
      };
    }
    console.error("Manuel lead kayıt hatası:", err);
    return { success: false, error: "Lead kaydedilemedi." };
  }
}
