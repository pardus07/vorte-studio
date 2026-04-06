// ════════════════════════════════════════════════════════════════
// Brand Colors Parser
// ────────────────────────────────────────────────────────────────
// Chatbot'tan gelen "brandColors" alani CSV string olarak saklanir:
//   "#FF4500,#1A1A1A,#FFFFFF"
// Bu helper string'i normalize edip ilk 3 HEX'i {primary, secondary,
// accent} tuple'ina cevirir. Eksik olanlar icin notr fallback kullanir.
// ════════════════════════════════════════════════════════════════

const NEUTRAL_FALLBACK = {
  primary: "#000000",
  secondary: "#FFFFFF",
  accent: "#808080",
} as const;

export type BrandColorTuple = {
  primary: string;
  secondary: string;
  accent: string;
};

/** Tek bir HEX token'i normalize eder. Gecersizse null doner. */
function normalizeHex(raw: string): string | null {
  const trimmed = raw.trim().toUpperCase();
  if (!trimmed) return null;
  // # yoksa ekle
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  // 3-haneli kisaltmayi 6-haneye genislet (#F40 -> #FF4400)
  if (/^#[0-9A-F]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#[0-9A-F]{6}$/.test(withHash)) return withHash;
  return null;
}

/**
 * CSV ya da virgulle ayrilmis brand colors string'ini parse eder.
 * Bos veya null girdi -> notr fallback.
 * 1 renk varsa primary; secondary/accent fallback'ten gelir.
 * 2 renk varsa primary + secondary; accent fallback.
 * 3+ renk varsa ilk 3'unu kullanir.
 */
export function parseBrandColors(input?: string | null): BrandColorTuple {
  if (!input || typeof input !== "string") return { ...NEUTRAL_FALLBACK };

  const tokens = input
    .split(",")
    .map((t) => normalizeHex(t))
    .filter((t): t is string => t !== null);

  if (tokens.length === 0) return { ...NEUTRAL_FALLBACK };

  return {
    primary: tokens[0] ?? NEUTRAL_FALLBACK.primary,
    secondary: tokens[1] ?? NEUTRAL_FALLBACK.secondary,
    accent: tokens[2] ?? NEUTRAL_FALLBACK.accent,
  };
}

/** Bir tuple'i tekrar CSV'ye cevirir (legacy brandColors text alani icin). */
export function stringifyBrandColors(t: BrandColorTuple): string {
  return `${t.primary},${t.secondary},${t.accent}`;
}
