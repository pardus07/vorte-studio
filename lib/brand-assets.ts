/**
 * Brand Asset Discovery Helper
 *
 * Site building (admin tarafindan musteriye ozel proje olusturulurken)
 * "VORTE TEKSTIL'in logosu nerede?" sorusunu deterministik cevaplar.
 *
 * Iki ana giris noktasi:
 *   - getBrandAssetsBySlug("vorte-tekstil")    -> hizli, dogrudan
 *   - findBrandAssetsByFirmName("VORTE TEKSTIL") -> bulanik, tum manifest'leri tarar
 *
 * Bonus:
 *   - listAllBrands() -> tum onaylanmis markalarin manifest'lerini doner
 *
 * Onemli: Bu helper FILESYSTEM uzerinden okur, HTTP fetch yapmaz.
 * Server Component / Server Action / API Route icinde kullanilabilir.
 */

import { readFile, readdir } from "fs/promises";
import { join } from "path";
import type { BrandManifest } from "./brand-processor";

const BRAND_ROOT = join(process.cwd(), "public", "uploads", "brand");

/**
 * Slug ile direkt manifest cek (en hizli yol).
 * Bulamazsa null doner.
 */
export async function getBrandAssetsBySlug(slug: string): Promise<BrandManifest | null> {
  if (!slug) return null;
  try {
    const json = await readFile(join(BRAND_ROOT, slug, "manifest.json"), "utf8");
    return JSON.parse(json) as BrandManifest;
  } catch {
    return null;
  }
}

/**
 * Firma adi ile bulanik arama (case-insensitive, trim).
 * Tum manifest'leri tarar — buyuk markalar listesinde yavaslayabilir
 * ama VORTE STUDIO icin (max ~100 musteri) sorun degil.
 */
export async function findBrandAssetsByFirmName(
  firmName: string
): Promise<BrandManifest | null> {
  if (!firmName) return null;
  const target = firmName.toLowerCase().trim();

  let dirs: string[] = [];
  try {
    dirs = await readdir(BRAND_ROOT);
  } catch {
    return null; // brand klasoru hic yok
  }

  for (const dir of dirs) {
    const manifest = await getBrandAssetsBySlug(dir);
    if (manifest && manifest.firmName.toLowerCase().trim() === target) {
      return manifest;
    }
  }
  return null;
}

/**
 * Tum onaylanmis markalari listele.
 * Admin overview / debug icin.
 */
export async function listAllBrands(): Promise<BrandManifest[]> {
  let dirs: string[] = [];
  try {
    dirs = await readdir(BRAND_ROOT);
  } catch {
    return [];
  }

  const all = await Promise.all(dirs.map((dir) => getBrandAssetsBySlug(dir)));
  return all.filter((b): b is BrandManifest => b !== null);
}

/**
 * Portal user ID ile ara (DB lookup yerine manifest tarama).
 * actions/portal'dan cagrilirken kullanisli.
 */
export async function findBrandAssetsByPortalUserId(
  portalUserId: string
): Promise<BrandManifest | null> {
  if (!portalUserId) return null;
  const all = await listAllBrands();
  return all.find((b) => b.portalUserId === portalUserId) || null;
}
