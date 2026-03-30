import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Türkçe karakterleri ASCII'ye çevirip URL-safe slug üretir */
export function turkishToSlug(text: string): string {
  const charMap: Record<string, string> = {
    ş: "s", Ş: "s", ç: "c", Ç: "c", ö: "o", Ö: "o",
    ü: "u", Ü: "u", ğ: "g", Ğ: "g", ı: "i", İ: "i",
  };
  return text
    .toLowerCase()
    .replace(/[şŞçÇöÖüÜğĞıİ]/g, (ch) => charMap[ch] || ch)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
