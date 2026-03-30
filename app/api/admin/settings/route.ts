import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/settings — Tüm ayarları döndür
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("Ayarlar getirme hatası:", err);
    return NextResponse.json(
      { error: "Ayarlar yüklenemedi." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/settings — Tek ayar güncelle { key, value }
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { key, value } = await request.json();

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Geçerli bir anahtar (key) gerekli." },
        { status: 400 }
      );
    }

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: "Değer (value) gerekli." },
        { status: 400 }
      );
    }

    await prisma.siteSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    return NextResponse.json({ success: true, key, value: String(value) });
  } catch (err) {
    console.error("Ayar güncelleme hatası:", err);
    return NextResponse.json(
      { error: "Ayar güncellenemedi." },
      { status: 500 }
    );
  }
}
