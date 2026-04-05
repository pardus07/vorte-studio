import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    // Max 10MB per file
    const MAX_SIZE = 10 * 1024 * 1024;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "portal", portalUserId);
    await mkdir(uploadDir, { recursive: true });

    const savedFiles = [];

    for (const file of fileEntries) {
      if (file.size > MAX_SIZE) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);

      const dbFile = await prisma.portalFile.create({
        data: {
          portalUserId,
          fileName: file.name,
          filePath: `/uploads/portal/${portalUserId}/${safeName}`,
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

    return NextResponse.json({ files: savedFiles });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 });
  }
}
