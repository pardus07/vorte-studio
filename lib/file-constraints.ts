/**
 * Portal Dosya Yükleme Kısıtları — Single Source of Truth
 *
 * Hem backend (route validation) hem frontend (UI bilgi bantı + accept attribute)
 * bu dosyadan okur. Yeni format eklerken SADECE buradan değiştir.
 *
 * Tasarım kararları:
 *  - Kategori bazlı max boyut: video 50 MB değil 200 MB olabilsin diye.
 *  - MIME + extension iki katmanlı kontrol: tarayıcı bazen TIFF gibi formatlarda
 *    `application/octet-stream` döndürür, extension fallback şart.
 *  - Arşiv (.zip/.rar) YASAK: içerik opak, MIME-sniff atlanabilir, malware riski.
 *  - Yürütülebilir (.exe/.bat/.sh) YASAK: bariz güvenlik.
 *  - Tek request toplamı 500 MB: RAM koruması (formData() her şeyi RAM'e alır).
 *  - Tek seferde max 10 dosya: UI'da sayaç ve kota hissi.
 */

export type FileCategory = "document" | "image" | "video";

export interface FileCategoryRule {
  category: FileCategory;
  label: string;
  icon: string;
  maxBytes: number;
  maxLabel: string;
  extensions: string[]; // ".pdf" formatında, lowercase, leading dot
  mimes: string[]; // tam MIME veya prefix (sonu /)
  formatLabel: string; // UI'da gösterilecek format listesi
}

export const FILE_CATEGORIES: FileCategoryRule[] = [
  {
    category: "document",
    label: "Belge",
    icon: "📄",
    maxBytes: 25 * 1024 * 1024,
    maxLabel: "25 MB",
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"],
    mimes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
    formatLabel: "PDF, Word, Excel, TXT",
  },
  {
    category: "image",
    label: "Görsel",
    icon: "🖼",
    maxBytes: 50 * 1024 * 1024,
    maxLabel: "50 MB",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".tif", ".tiff"],
    mimes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "image/tiff",
    ],
    formatLabel: "JPG, PNG, WebP, SVG, GIF, TIFF",
  },
  {
    category: "video",
    label: "Video",
    icon: "🎬",
    maxBytes: 200 * 1024 * 1024,
    maxLabel: "200 MB",
    extensions: [".mp4", ".mov", ".webm"],
    mimes: ["video/mp4", "video/quicktime", "video/webm"],
    formatLabel: "MP4, MOV, WebM",
  },
];

/** Bir request'te toplam veri sınırı — RAM koruması */
export const MAX_TOTAL_REQUEST_BYTES = 500 * 1024 * 1024;
export const MAX_TOTAL_REQUEST_LABEL = "500 MB";

/** Bir request'te max dosya adedi */
export const MAX_FILES_PER_REQUEST = 10;

/** <input accept="..."> attribute'u — tarayıcı file picker filtresi */
export const ACCEPT_ATTRIBUTE = FILE_CATEGORIES.flatMap((c) => [
  ...c.extensions,
  ...c.mimes,
]).join(",");

/** MIME veya extension'dan kategori bul — bulamazsa null (= reddet) */
export function detectCategory(
  fileName: string,
  mimeType: string
): FileCategoryRule | null {
  const lowerName = fileName.toLowerCase();
  const lowerMime = (mimeType || "").toLowerCase();

  for (const rule of FILE_CATEGORIES) {
    // Önce MIME — daha güvenilir
    if (rule.mimes.includes(lowerMime)) return rule;
    // Extension fallback (TIFF gibi octet-stream dönen durumlar için)
    if (rule.extensions.some((ext) => lowerName.endsWith(ext))) return rule;
  }
  return null;
}

/** Tek dosya validasyonu — backend'in kullandığı saf fonksiyon */
export type FileRejectReason =
  | { type: "unsupported"; message: string }
  | { type: "tooLarge"; message: string };

export interface FileValidationResult {
  ok: boolean;
  category?: FileCategoryRule;
  reason?: FileRejectReason;
}

export function validateFile(
  fileName: string,
  mimeType: string,
  size: number
): FileValidationResult {
  const category = detectCategory(fileName, mimeType);
  if (!category) {
    return {
      ok: false,
      reason: {
        type: "unsupported",
        message: `desteklenmeyen format`,
      },
    };
  }
  if (size > category.maxBytes) {
    const sizeMb = (size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      category,
      reason: {
        type: "tooLarge",
        message: `${sizeMb} MB > ${category.maxLabel} (${category.label.toLowerCase()} limiti)`,
      },
    };
  }
  return { ok: true, category };
}
