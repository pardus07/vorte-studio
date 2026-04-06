/**
 * Logo uretimi icin AI prompt olusturur (v2 — Pro Edition)
 *
 * Geliştirmeler:
 *   1. HEX renkler ONCELIKLE — Gemini'ye serbest metin yerine kesin HEX kodlari ver
 *   2. Notlar prompt'un BASINA — admin'in ozel talimatlari en yuksek oncelik
 *   3. Turkce sektor normalize — "tekstil ic giyim" gibi compound terimler eslesir
 *   4. Daha agresif kalite kurallari — vector-style, transparent BG, no artifacts
 *   5. Forbidden list — gibberish text, mockups, multiple logos engellendi
 */

interface LogoPromptInput {
  firmName: string;
  sector?: string | null;
  style?: string | null;
  brandColors?: string | null; // serbest metin (legacy fallback)
  primaryColor?: string | null; // #hex
  secondaryColor?: string | null; // #hex
  accentColor?: string | null; // #hex
  includeText?: boolean;
  notes?: string | null;
  revisionFeedback?: string | null;
}

const STYLE_MAP: Record<string, string> = {
  minimal: "minimalist, clean lines, geometric shapes, flat design, lots of negative space",
  modern: "modern, sleek, contemporary typography, bold and confident",
  vintage: "vintage, retro, classic emblem style, ornamental details, hand-crafted feel",
  playful: "playful, colorful, rounded shapes, friendly and approachable, joyful energy",
  luxury: "luxury, elegant, refined typography, premium feel, sophisticated",
  tech: "tech-forward, digital, geometric precision, futuristic, innovative",
};

/**
 * Sektor map — Turkce keyword -> ingilizce gorsel ipucu.
 * Coklu eslesme destegi: "tekstil ic giyim" hem `tekstil` hem `icgiyim` matchler.
 */
const SECTOR_HINTS: Record<string, string> = {
  saglik: "medical cross or caduceus, trust and care",
  tip: "stethoscope, medical symbol",
  teknoloji: "digital elements, innovation, connectivity, circuit motifs",
  yazilim: "code brackets, abstract data flow",
  egitim: "knowledge, growth, book or graduation cap",
  okul: "academic, learning, classroom",
  insaat: "building silhouette, construction, strong foundations",
  yapi: "architectural lines, blueprint geometry",
  mimari: "architectural lines, blueprint geometry",
  hukuk: "scales of justice, pillar, authority",
  avukat: "scales of justice, classical column",
  yiyecek: "fork/spoon, fresh ingredients, appetizing",
  restoran: "plate, chef hat, culinary",
  cafe: "coffee bean, cup, warm atmosphere",
  moda: "elegant silhouette, fashion-forward, runway feel",
  giyim: "fabric, fashion, garment silhouette",
  tekstil: "thread, fabric weave, textile pattern",
  icgiyim: "soft, intimate, elegant minimalism",
  spor: "dynamic, energetic, motion lines",
  fitness: "strength, muscle, energy",
  finans: "stability, growth chart, trust, vault",
  banka: "stability, classical strength",
  otopark: "car silhouette, parking symbol, urban grid",
  guzellik: "beauty, elegance, floral elements",
  kuafor: "scissors, hair styling, beauty",
  turizm: "compass, travel, adventure, destination",
  seyahat: "compass, suitcase, exploration",
  emlak: "house silhouette, building, roof, key",
  enerji: "sun, leaf, power, renewable, lightning",
  tarim: "plant, leaf, field, harvest, organic",
  organik: "leaf, natural, eco-friendly",
  lojistik: "truck, box, route, speed lines",
  kargo: "package, arrow, delivery",
  medya: "camera, play button, broadcast wave",
  reklam: "megaphone, creative spark",
  danismanlik: "handshake, chart, strategic arrow",
  oto: "car silhouette, wheel, automotive",
  araba: "car silhouette, wheel, automotive",
  tamir: "wrench, gear, mechanical",
};

/**
 * Turkce karakterli sektor input'unu ASCII normalize eder ve
 * butun keyword'leri tek tek match eder, ipuclarini birlestirir.
 *
 * Ornek: "tekstil ic giyim" -> [tekstil, icgiyim] -> "thread, fabric weave + soft intimate elegant"
 */
function getSectorHints(sector: string): string[] {
  // Turkce -> ASCII normalize
  const normalized = sector
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i").replace(/i̇/g, "i")
    .replace(/[^a-z0-9\s]/g, " ");

  const hints: string[] = [];
  for (const [key, hint] of Object.entries(SECTOR_HINTS)) {
    if (normalized.includes(key)) {
      hints.push(hint);
    }
  }
  return hints;
}

export function generateLogoPrompt(input: LogoPromptInput): string {
  const parts: string[] = [];

  // ── 1. HIGHEST PRIORITY: Admin notlari (en yukseklere) ──
  if (input.notes && input.notes.trim()) {
    parts.push(`HIGHEST PRIORITY DESIGNER NOTE: ${input.notes.trim()}.`);
  }

  // ── 2. Revizyon geri bildirimi (varsa, en kritik) ──
  if (input.revisionFeedback && input.revisionFeedback.trim()) {
    parts.push(
      `CRITICAL REVISION REQUEST from client (must be addressed): "${input.revisionFeedback.trim()}". Adjust the entire design to satisfy this feedback.`
    );
  }

  // ── 3. Ana yonerge ──
  parts.push("Create a PROFESSIONAL VECTOR-STYLE LOGO suitable for a real, established business.");
  parts.push("This logo will be the OFFICIAL brand mark used on websites, business cards, signage, and merchandise.");

  // ── 4. Critical requirements ──
  parts.push("CRITICAL REQUIREMENTS:");
  parts.push("- Pure white background (#FFFFFF), no shadows, no gradients on the background itself");
  parts.push("- Logo must be perfectly centered with generous symmetrical padding");
  parts.push("- Crisp vector-style edges, no blur, no photographic textures, no 3D rendering");
  parts.push("- Single iconic mark — instantly recognizable, memorable at small sizes");
  parts.push("- Print-ready quality, suitable for both digital and physical media");

  // ── 5. Logo type (sembol mu, wordmark mi) ──
  if (input.includeText !== false) {
    parts.push(
      `Include the company name "${input.firmName}" rendered in elegant, well-kerned typography as part of the logo composition.`
    );
  } else {
    parts.push(
      `Create a SYMBOL/ICON-ONLY logo (NO TEXT, NO LETTERS) for a company named "${input.firmName}". The mark should evoke the brand without spelling its name.`
    );
  }

  // ── 6. Stil ──
  if (input.style && STYLE_MAP[input.style]) {
    parts.push(`Style direction: ${STYLE_MAP[input.style]}.`);
  } else {
    parts.push("Style direction: modern, clean, professional.");
  }

  // ── 7. Sektor (Turkce-aware) ──
  if (input.sector && input.sector.trim()) {
    const hints = getSectorHints(input.sector);
    if (hints.length > 0) {
      parts.push(`Industry context (${input.sector}): incorporate visual cues like ${hints.join("; ")}.`);
    } else {
      parts.push(`Industry context: this is for a "${input.sector}" business — design accordingly.`);
    }
  }

  // ── 8. Renkler (HEX oncelikli) ──
  const hexColors: string[] = [];
  if (input.primaryColor) hexColors.push(`primary ${input.primaryColor}`);
  if (input.secondaryColor) hexColors.push(`secondary ${input.secondaryColor}`);
  if (input.accentColor) hexColors.push(`accent ${input.accentColor}`);

  if (hexColors.length > 0) {
    parts.push(
      `BRAND COLORS — use ONLY these EXACT hex values, do not deviate: ${hexColors.join(", ")}. The logo must visually reflect these specific colors.`
    );
  } else if (input.brandColors && input.brandColors.trim()) {
    parts.push(`Brand color palette: ${input.brandColors.trim()}.`);
  }

  // ── 9. Forbidden ──
  parts.push(
    "FORBIDDEN: gibberish text, mis-spelled letters, mockups, business card scenes, multiple logos in one image, watermarks, signatures, photographic backgrounds, drop shadows on the background, stock-photo elements."
  );

  // ── 10. Output ──
  parts.push("Output: ONE single, finished, polished logo, centered, on a pure white background, no border, no frame.");

  return parts.join(" ");
}
