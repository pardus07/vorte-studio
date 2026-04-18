import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  validateFile,
  MAX_TOTAL_REQUEST_BYTES,
  MAX_TOTAL_REQUEST_LABEL,
  MAX_FILES_PER_REQUEST,
} from "@/lib/file-constraints";
import { verifyMagicBytes } from "@/lib/file-magic";

interface RejectedFile {
  fileName: string;
  reason: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const user = session.user as Record<string, unknown>;
    const portalUserId = user.portalUserId as string | undefined;
    const role = user.role as string;

    if (role !== "portal" || !portalUserId) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const formData = await req.formData();
    const fileEntries = formData.getAll("files") as File[];

    if (!fileEntries.length) {
      return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 });
    }

    if (fileEntries.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        {
          error: `Tek seferde en fazla ${MAX_FILES_PER_REQUEST} dosya yükleyebilirsiniz (${fileEntries.length} dosya seçildi).`,
        },
        { status: 400 }
      );
    }

    // Toplam request boyutu kontrolü — RAM koruması
    const totalBytes = fileEntries.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > MAX_TOTAL_REQUEST_BYTES) {
      const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Toplam yükleme boyutu ${totalMb} MB — limit ${MAX_TOTAL_REQUEST_LABEL}. Daha az dosya seçin.`,
        },
        { status: 413 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "portal", portalUserId);
    await mkdir(uploadDir, { recursive: true });

    const savedFiles = [];
    const rejected: RejectedFile[] = [];

    for (const file of fileEntries) {
      // Validasyon: kategori tespiti + boyut kontrolü
      const result = validateFile(file.name, file.type || "", file.size);
      if (!result.ok) {
        rejected.push({
          fileName: file.name,
          reason: result.reason!.message,
        });
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Magic-byte doğrulama — MIME header sahteciliğini engeller.
      // .txt gibi signature'ı olmayan formatlar verifyMagicBytes'ta zaten
      // true döner; image/video/pdf/office için gerçek içerik kontrolü yapılır.
      if (!verifyMagicBytes(buffer, file.type || "", file.name)) {
        rejected.push({
          fileName: file.name,
          reason: "içerik dosya tipiyle eşleşmiyor",
        });
        continue;
      }

      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);

      const dbFile = await prisma.portalFile.create({
        data: {
          portalUserId,
          fileName: file.name,
          // /api/uploads/[...path] generic handler üzerinden serve edilir.
          // Direkt /uploads/* path'leri Coolify volume mount yüzünden 404 verir.
          filePath: `/api/uploads/portal/${portalUserId}/${safeName}`,
          fileSize: file.size,
          fileType: file.type || "application/octet-stream",
          uploadedBy: "CUSTOMER",
        },
      });

      savedFiles.push({
        id: dbFile.id,
        fileName: dbFile.fileName,
        filePath: dbFile.filePath,
        fileSize: dbFile.fileSize,
        fileType: dbFile.fileType,
        uploadedBy: dbFile.uploadedBy,
        description: null,
        createdAt: dbFile.createdAt.toISOString(),
      });
    }

    return NextResponse.json({ files: savedFiles, rejected });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 });
  }
}
