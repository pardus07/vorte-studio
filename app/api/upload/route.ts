import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WebP, GIF desteklenir" },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Maksimum dosya boyutu 5MB" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const folder = (formData.get("folder") as string) || "portfolio";
  const safeFolderName = folder.replace(/[^a-z0-9-]/gi, "");

  const timestamp = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${safeFolderName}-${timestamp}.${ext}`;

  const uploadDir = join(process.cwd(), "public", "uploads", safeFolderName);
  await mkdir(uploadDir, { recursive: true });

  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: `/api/uploads/${safeFolderName}/${filename}`,
    filename,
  });
}
