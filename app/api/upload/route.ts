import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyMagicBytes } from "@/lib/file-magic";

/**
 * Admin görsel yükleme endpoint'i
 *
 * Güvenlik katmanları:
 *  1. Session (admin)
 *  2. Rate limit (15/h/IP) — disk doldurma saldırısı
 *  3. MIME whitelist — sadece raster image
 *  4. Extension whitelist — client-supplied name'den gelen ext güvensiz
 *  5. Boyut limiti (5 MB)
 *  6. Magic-byte doğrulama — MIME header sahteciliğini engeller
 *  7. Path sanitize — folder adı ASCII [a-z0-9-] ile sınırlı
 *  8. Filename deterministic — user input'tan gelmiyor (timestamp + rand)
 */

// MIME ↔ extension eşleşmesi — sabit, whitelist. SVG YOK (XSS riski).
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // Rate limit: 15 upload/saat/IP — disk doldurma saldırısına karşı
  const limited = checkRateLimit(request, "upload", 15, 60 * 60 * 1000);
  if (limited) return limited;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WebP, GIF desteklenir" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Maksimum dosya boyutu 5MB" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Magic-byte doğrulama: MIME sahteciliğini engeller
  if (!verifyMagicBytes(buffer, file.type, file.name)) {
    return NextResponse.json(
      { error: "Dosya içeriği belirtilen tiple eşleşmiyor" },
      { status: 400 }
    );
  }

  // Folder: client-supplied, sıkı whitelist
  const folderRaw = (formData.get("folder") as string) || "portfolio";
  const safeFolderName = folderRaw.replace(/[^a-z0-9-]/gi, "").slice(0, 32) || "portfolio";

  // Filename: user input hiç kullanılmaz — timestamp + random suffix
  const timestamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const filename = `${safeFolderName}-${timestamp}-${rand}.${ext}`;

  const uploadDir = join(process.cwd(), "public", "uploads", safeFolderName);
  await mkdir(uploadDir, { recursive: true });

  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: `/api/uploads/${safeFolderName}/${filename}`,
    filename,
  });
}
