/**
 * Logo üretimi için AI prompt oluşturur.
 * Firma adı, sektör, stil, renkler ve ek notlardan
 * Gemini/Imagen modeline gönderilecek prompt üretir.
 */

interface LogoPromptInput {
  firmName: string;
  sector?: string | null;
  style?: string | null;
  brandColors?: string | null;
  includeText?: boolean;
  notes?: string | null;
  revisionFeedback?: string | null;
}

const STYLE_MAP: Record<string, string> = {
  minimal: "minimalist, clean lines, geometric shapes, flat design",
  modern: "modern, sleek, gradient accents, contemporary typography",
  vintage: "vintage, retro, classic emblem style, ornamental details",
  playful: "playful, colorful, rounded shapes, friendly and approachable",
  luxury: "luxury, elegant, serif typography, gold/dark tones, premium feel",
  tech: "tech-forward, digital, circuit-inspired, futuristic",
};

const SECTOR_HINTS: Record<string, string> = {
  saglik: "medical cross or health symbol, trust and care",
  teknoloji: "digital elements, innovation, connectivity",
  egitim: "knowledge, growth, book or graduation cap",
  insaat: "building, construction, strong foundations",
  hukuk: "scales of justice, pillar, authority",
  yiyecek: "fork/spoon, fresh ingredients, appetizing",
  moda: "elegant, stylish, fashion-forward",
  spor: "dynamic, energetic, motion",
  finans: "stability, growth chart, trust",
  otopark: "car, parking symbol, urban",
  guzellik: "beauty, elegance, floral elements",
  turizm: "travel, compass, adventure, destination",
  emlak: "house, building, roof, key",
  enerji: "sun, leaf, power, renewable",
  tarim: "plant, field, nature, harvest",
  lojistik: "truck, box, route, speed",
  medya: "camera, play button, broadcast",
  danismanlik: "handshake, chart, strategy",
};

export function generateLogoPrompt(input: LogoPromptInput): string {
  const parts: string[] = [];

  // Ana yönerge
  parts.push("Create a professional logo design.");
  parts.push("The logo must be on a pure white background.");
  parts.push("Clean, high-quality, vector-style rendering.");
  parts.push("No mockups, no business cards, no background scenes — ONLY the logo itself.");

  // Firma adı
  if (input.includeText !== false) {
    parts.push(`Include the text "${input.firmName}" as part of the logo using elegant typography.`);
  } else {
    parts.push(`Create a symbol/icon-only logo (no text) for a company called "${input.firmName}".`);
  }

  // Stil
  if (input.style && STYLE_MAP[input.style]) {
    parts.push(`Style: ${STYLE_MAP[input.style]}.`);
  } else {
    parts.push("Style: modern, clean, professional.");
  }

  // Sektör ipucu
  if (input.sector) {
    const sectorKey = input.sector.toLowerCase().replace(/\s+/g, "");
    const hint = Object.entries(SECTOR_HINTS).find(([k]) => sectorKey.includes(k));
    if (hint) {
      parts.push(`Industry context: ${hint[1]}.`);
    } else {
      parts.push(`This is for a "${input.sector}" business.`);
    }
  }

  // Renkler
  if (input.brandColors) {
    parts.push(`Use these brand colors: ${input.brandColors}.`);
  }

  // Admin notları
  if (input.notes) {
    parts.push(`Additional requirements: ${input.notes}.`);
  }

  // Revizyon geri bildirimi
  if (input.revisionFeedback) {
    parts.push(`REVISION REQUEST from client: "${input.revisionFeedback}". Adjust the logo based on this feedback.`);
  }

  // Kalite kuralları
  parts.push("Output: single logo, centered, white background, no watermark, no border.");

  return parts.join(" ");
}
