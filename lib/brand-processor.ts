/**
 * Brand Asset Post-Processor
 *
 * Gemini'den gelen 1024x1024 master logo PNG'sini alir, sharp ile islenip
 * butun standart ölcülere donusturur, transparent background uygular,
 * manifest.json yazar.
 *
 * VERSIONED FILENAMES — Cache busting ve revizyon gecmisi icin her onayda
 * yeni bir version token (epoch ms) uretilir. Dosya adlari:
 *   primary-1024-v{ts}.png
 * Boylece browser/CDN ayni URL'yi cache'lese bile yeni onay yeni URL uretir.
 * Eski versionlar diskte kalir (revizyon gecmisi). Cleanup ileride ayri job.
 *
 * Cikti yapisi:
 *   public/uploads/brand/{firmSlug}/
 *     ├─ primary-1024-v{ts}.png         # Master, transparent BG
 *     ├─ primary-512-v{ts}.png
 *     ├─ primary-256-v{ts}.png
 *     ├─ horizontal-1200x400-v{ts}.png  # Wide header
 *     ├─ icon-512-v{ts}.png             # Sembol/marker
 *     ├─ favicon-64-v{ts}.png           # Tarayici sekmesi
 *     ├─ light-on-dark-1024-v{ts}.png   # Koyu zemin onizleme
 *     └─ manifest.json                  # Canonical, her onayda overwrite
 */

import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

export interface BrandColors {
  primary?: string | null;
  secondary?: string | null;
  accent?: string | null;
}

export interface BrandFonts {
  display?: string | null;
  body?: string | null;
}

export interface BrandManifestAsset {
  url: string;
  w?: number;
  h?: number;
  format?: string;
}

export interface BrandManifest {
  schemaVersion: string;
  firmName: string;
  firmSlug: string;
  portalUserId: string;
  logoProjectId: string;
  approvedAt: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  assets: {
    primary: BrandManifestAsset;
    primary512: BrandManifestAsset;
    primary256: BrandManifestAsset;
    horizontal: BrandManifestAsset;
    icon: BrandManifestAsset;
    favicon: BrandManifestAsset;
    lightOnDark: BrandManifestAsset;
  };
}

interface ProcessOptions {
  firmName: string;
  firmSlug: string;
  portalUserId: string;
  logoProjectId: string;
  colors: BrandColors;
  fonts?: BrandFonts;
}

const BRAND_ROOT = join(process.cwd(), "public", "uploads", "brand");

/**
 * Ana giris noktasi: master PNG buffer'i alir, butun varyantlari uretir,
 * manifest yazar, BrandManifest objesini doner.
 */
export async function processLogoToBrandAssets(
  masterPng: Buffer,
  opts: ProcessOptions
): Promise<BrandManifest> {
  const dir = join(BRAND_ROOT, opts.firmSlug);
  await mkdir(dir, { recursive: true });

  // Version token: epoch ms. Browser cache'inin ayni URL'yi tekrar
  // sunmamasi icin her onayda dosya adlari benzersiz hale gelir.
  const v = Date.now();
  const tag = (name: string, ext = "png") => `${name}-v${v}.${ext}`;

  // 1) Beyaz arkaplan -> transparent (chroma key + edge feathering)
  const transparentBuffer = await removeWhiteBackground(masterPng);

  // 2) Primary varyantlar (square, transparent BG)
  const primary1024 = tag("primary-1024");
  const primary512 = tag("primary-512");
  const primary256 = tag("primary-256");
  const horizontal = tag("horizontal-1200x400");
  const icon512 = tag("icon-512");
  const favicon64 = tag("favicon-64");
  const lightOnDark = tag("light-on-dark-1024");

  await sharp(transparentBuffer)
    .resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(dir, primary1024));

  await sharp(transparentBuffer)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(dir, primary512));

  await sharp(transparentBuffer)
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(dir, primary256));

  // 3) Horizontal header (1200x400) — logo orta, transparent canvas
  await sharp(transparentBuffer)
    .resize(360, 360, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 20,
      bottom: 20,
      left: 420,
      right: 420,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(join(dir, horizontal));

  // 4) Icon (sembol) — su an primary ile ayni; future: AI ile sadece-sembol versiyonu
  await sharp(transparentBuffer)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(dir, icon512));

  // 5) Favicon
  await sharp(transparentBuffer)
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(dir, favicon64));

  // 6) Light-on-dark — koyu zeminli onizleme (transparent + dark BG composite)
  // Naive invert renkli logoda kotu sonuc verir; bunun yerine #0a0a0a uzerine yerlestir
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(transparentBuffer)
          .resize(820, 820, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toFile(join(dir, lightOnDark));

  // 7) Manifest yaz — manifest.json kendisi versionsuz, her onayda overwrite.
  // Icindeki asset URL'leri versionlu, browser/CDN dogru shekilde refresh eder.
  const baseUrl = `/api/uploads/brand/${opts.firmSlug}`;
  const manifest: BrandManifest = {
    schemaVersion: "1.0",
    firmName: opts.firmName,
    firmSlug: opts.firmSlug,
    portalUserId: opts.portalUserId,
    logoProjectId: opts.logoProjectId,
    approvedAt: new Date().toISOString(),
    colors: {
      primary: opts.colors.primary || "#FF4500",
      secondary: opts.colors.secondary || "#1A1A1A",
      accent: opts.colors.accent || "#FFFFFF",
    },
    fonts: {
      display: opts.fonts?.display || "Inter",
      body: opts.fonts?.body || "Inter",
    },
    assets: {
      primary: { url: `${baseUrl}/${primary1024}`, w: 1024, h: 1024 },
      primary512: { url: `${baseUrl}/${primary512}`, w: 512, h: 512 },
      primary256: { url: `${baseUrl}/${primary256}`, w: 256, h: 256 },
      horizontal: { url: `${baseUrl}/${horizontal}`, w: 1200, h: 400 },
      icon: { url: `${baseUrl}/${icon512}`, w: 512, h: 512 },
      favicon: { url: `${baseUrl}/${favicon64}`, w: 64, h: 64 },
      lightOnDark: { url: `${baseUrl}/${lightOnDark}`, w: 1024, h: 1024 },
    },
  };

  await writeFile(
    join(dir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  return manifest;
}

/**
 * Beyaz arkaplan kaldirma — chroma key + soft edge.
 *
 * Strateji: Raw piksel buffer'i tara, RGB esikleri:
 *  - Saf beyaz (R,G,B > 245): tamamen transparent
 *  - Ackin beyaz (R,G,B > 220): edge feathering, alpha 0..255 lineer interpolate
 *  - Aksi: olduğu gibi birak
 *
 * Bu yaklasim Gemini'nin urettigi temiz beyaz BG'ler icin guvenli;
 * logo icindeki ufak beyaz alanlar (ornegin "O" harfi ortasi) da
 * "cevresi tarafindan baglanmadiklari icin" silinir — bu kabul edilebilir
 * cunku transparent BG'de zaten gozukmezdi.
 */
async function removeWhiteBackground(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const minRgb = Math.min(r, g, b);

    if (r > 245 && g > 245 && b > 245) {
      // Saf beyaz: tamamen transparent
      data[i + 3] = 0;
    } else if (minRgb > 220) {
      // Ackin beyaz: lineer fade (220 -> 255 alpha, 245 -> 0 alpha)
      const fade = (245 - minRgb) / 25; // 0..1
      data[i + 3] = Math.max(0, Math.min(255, Math.round(255 * fade)));
    }
    // Geri kalan: dokunma
  }

  return await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}
