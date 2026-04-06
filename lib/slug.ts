/**
 * Turkce-aware ASCII slugify.
 *
 * `firmName` (orn. "VORTE TEKSTIL", "Akar Insaat & Yapi A.S.")
 * gibi serbest metni dosya/URL guvenli slug'a cevirir.
 *
 * Kurallar:
 * - Tum Turkce karakterleri ASCII karsiligiyla degistir (i, c, g, o, s, u, I)
 * - Kucuk harfe cevir
 * - Bosluk ve noktalama tire (-) ile degistir
 * - Sadece [a-z0-9-] kalsin
 * - Coklu tire tek tireye indir
 * - Bas/son tire temizle
 *
 * Ornekler:
 *   "VORTE TEKSTIL"        -> "vorte-tekstil"
 *   "Akar Insaat & Yapi"   -> "akar-insaat-yapi"
 *   "Cigdem'in Cicekleri"  -> "cigdem-in-cicekleri"
 */

const TR_MAP: Record<string, string> = {
  "ş": "s", "Ş": "s",
  "ç": "c", "Ç": "c",
  "ğ": "g", "Ğ": "g",
  "ü": "u", "Ü": "u",
  "ö": "o", "Ö": "o",
  "ı": "i", "İ": "i",
  "â": "a", "Â": "a",
  "î": "i", "Î": "i",
  "û": "u", "Û": "u",
};

/** Tek bir slug uret (cakisma kontrolu yok) */
export function slugify(input: string): string {
  if (!input) return "";

  let s = input;

  // Turkce karakterleri once degistir (lowercase oncesi, cunku map case-sensitive)
  for (const [tr, ascii] of Object.entries(TR_MAP)) {
    s = s.split(tr).join(ascii);
  }

  // Lowercase
  s = s.toLowerCase();

  // ASCII olmayan her seyi tireye cevir (& gibi karakterler dahil)
  s = s.replace(/[^a-z0-9]+/g, "-");

  // Bas/son tire temizle, coklu tireleri tek yap
  s = s.replace(/^-+|-+$/g, "").replace(/-+/g, "-");

  return s;
}

/**
 * Cakisma-aware slug uretir.
 * `existingSlugs` listesinde aynisi varsa "-2", "-3" suffix ekler.
 *
 * Ornek:
 *   uniqueSlug("Akar Insaat", ["akar-insaat"]) -> "akar-insaat-2"
 */
export function uniqueSlug(input: string, existingSlugs: string[]): string {
  const base = slugify(input) || "firma";
  if (!existingSlugs.includes(base)) return base;

  let counter = 2;
  while (existingSlugs.includes(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}
