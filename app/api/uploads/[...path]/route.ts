import { readFile } from "fs/promises";
import { join, resolve, sep } from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Yüklenen dosyaları serve eden tek noktadan geçiş (gateway).
 *
 * Güvenlik katmanları:
 *  1. Path traversal guard — resolved absolute path upload root'un DIŞINDA
 *     olamaz. `join` tek başına yeterli değil çünkü path params
 *     `..%2F..%2Fetc%2Fpasswd` gibi encoded dizinleri kabul ediyor.
 *  2. X-Content-Type-Options: nosniff — tarayıcının MIME-sniff edip
 *     dosyayı farklı tipte yorumlamasını engeller.
 *  3. Content-Disposition — tehlikeli/aşina olmayan tipler inline render
 *     edilmesin, tarayıcı download penceresi açsın.
 *  4. Portal klasörü (`/portal/:userId/...`) için AUTH zorunlu; kullanıcı
 *     sadece kendi klasörüne erişebilir.
 *
 * NOT: Admin-yüklediği public görseller (örn. portfolio/, templates/)
 * auth'suz kalmaya devam ediyor çünkü bunlar public site render'ında
 * <img src> ile çekiliyor.
 */

const UPLOAD_ROOT = resolve(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  // Görsel
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  tif: "image/tiff",
  tiff: "image/tiff",
  // SVG KALDIRILDI — inline render edilirse XSS. Yeni upload'lar zaten
  // engellenecek; eski SVG'ler varsa force-download ile serve edilir (aşağı).
  // Belge
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain; charset=utf-8",
  // Video
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

// Inline açılmasında sakınca yok → browser preview yapabilir
const INLINE_SAFE = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "tif",
  "tiff",
  "pdf",
  "mp4",
  "mov",
  "webm",
  "txt",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path || path.length === 0) {
    return NextResponse.json({ error: "Geçersiz yol" }, { status: 400 });
  }

  // Portal dosyaları private — sahibi olmayan erişemez
  // Path örüntüsü: ["portal", portalUserId, ...file]
  if (path[0] === "portal") {
    const pathUserId = path[1];
    if (!pathUserId) {
      return NextResponse.json({ error: "Geçersiz yol" }, { status: 400 });
    }
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    const user = session.user as Record<string, unknown>;
    const role = user.role as string;
    const sessionPortalId = user.portalUserId as string | undefined;

    // Admin her portal dosyasına erişebilir, portal user sadece kendi klasörüne
    if (role === "portal") {
      if (sessionPortalId !== pathUserId) {
        return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
      }
    } else if (role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }
  }

  // Path traversal guard — resolved path UPLOAD_ROOT içinde olmalı
  const rawPath = join(UPLOAD_ROOT, ...path);
  const resolved = resolve(rawPath);
  if (!resolved.startsWith(UPLOAD_ROOT + sep) && resolved !== UPLOAD_ROOT) {
    return NextResponse.json({ error: "Geçersiz yol" }, { status: 400 });
  }

  try {
    const buffer = await readFile(resolved);
    const fileName = path[path.length - 1];
    const ext = fileName.split(".").pop()?.toLowerCase() || "";

    // Bilmediğimiz/izinli olmayan ext → octet-stream + attachment
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const inline = INLINE_SAFE.has(ext);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": inline
          ? `inline; filename="${encodeURIComponent(fileName)}"`
          : `attachment; filename="${encodeURIComponent(fileName)}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
  }
}
