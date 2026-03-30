"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULTS: Record<string, string> = {
  whatsapp_number: "",
  email: "studio@vorte.com.tr",
  github_url: "",
  description: "WordPress değil, gerçek kod. Next.js ve Prisma ile yenilikçi web çözümleri üretiyoruz.",
};

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map: Record<string, string> = { ...DEFAULTS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function upsertSetting(key: string, value: string) {
  try {
    await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Ayar güncelleme hatası:", err);
    return { success: false, error: "Ayar güncellenemedi." };
  }
}
