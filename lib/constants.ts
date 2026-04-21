// ═══════════════════════════════════════════════════════════════════════
// VORTE STUDIO — Proje-wide kanonik sabit değerler
// ═══════════════════════════════════════════════════════════════════════
//
// Bu dosya string literal union'lar yerine tek referans sözlük sağlar.
// Yeni kaynak/tür eklerken buraya bir giriş ekle → TypeScript tüm
// kullanım noktalarında tip güvenliği verir.
//
// NOT: `as const` + `keyof typeof` pattern'ı — enum kullanmıyoruz çünkü
// Prisma'da `String?` ile tutuyoruz (migration gerektirmeden yeni
// değer eklenebilsin). Derleme zamanı tip güvenliği `Source` tipinden
// gelir, DB'de serbest metin.
//
// ═══════════════════════════════════════════════════════════════════════

// ── FAZ C Madde 3.5: Client acquisition source (kanonik sözlük) ──
// `Client.acquisitionSource` alanına yazılan değerler bu tuple'dan gelir.
// UI'de Türkçe etiket göstermek için bu dict'i kullan:
//   CLIENT_ACQUISITION_SOURCES[client.acquisitionSource as ClientAcquisitionSource]
//
// Yeni kanal eklemek: buraya satır ekle + ilgili client.create noktasında
// kullan. Migration gerekmez (DB tarafı String?).
export const CLIENT_ACQUISITION_SOURCES = {
  MAPS_SCRAPER: "Google Maps",
  SITE_FORM: "Site Formu",
  CHAT_WIDGET: "Chat Widget",
  LINKEDIN: "LinkedIn",
  REFERRAL: "Tavsiye",
  MANUAL_ADMIN: "Manuel (Admin)",
  PROPOSAL_PAYMENT: "Ödeme Sonrası",
  MAINTENANCE: "Bakım Akışı",
} as const;

export type ClientAcquisitionSource = keyof typeof CLIENT_ACQUISITION_SOURCES;

// Runtime guard — DB'den okunan String? değeri bilinen bir source mu?
// UI'de Türkçe etiket göstermek için kullan (bilinmeyen değerde fallback).
export function isClientAcquisitionSource(
  value: string | null | undefined
): value is ClientAcquisitionSource {
  return typeof value === "string" && value in CLIENT_ACQUISITION_SOURCES;
}

// UI label helper — null/bilinmeyen değerde "Bilinmiyor" döner.
export function acquisitionSourceLabel(
  value: string | null | undefined
): string {
  if (isClientAcquisitionSource(value)) {
    return CLIENT_ACQUISITION_SOURCES[value];
  }
  return "Bilinmiyor";
}

// ── LeadSource → ClientAcquisitionSource mapper ──
// Prisma `LeadSource` enum: MAPS_SCRAPER, SITE_FORM, LINKEDIN, REFERRAL, MANUAL
// `ClientAcquisitionSource` üst kümesi: + CHAT_WIDGET, PROPOSAL_PAYMENT,
// MAINTENANCE + MANUAL yerine MANUAL_ADMIN.
//
// Tek dönüşüm: MANUAL → MANUAL_ADMIN (diğer 4 değer 1:1 match eder).
// Lead'den oluşan Client'ın kaynağını tutarlı şekilde işaretleriz.
export function leadSourceToAcquisitionSource(
  source: string | null | undefined
): ClientAcquisitionSource {
  if (source === "MANUAL") return "MANUAL_ADMIN";
  if (
    source === "MAPS_SCRAPER" ||
    source === "SITE_FORM" ||
    source === "LINKEDIN" ||
    source === "REFERRAL"
  ) {
    return source;
  }
  // Bilinmeyen / null → manuel admin fallback (conservative)
  return "MANUAL_ADMIN";
}
