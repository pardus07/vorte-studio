"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { PricingItem } from "@/lib/pricing-constants";

export async function getPricingConfigs(): Promise<PricingItem[]> {
  try {
    const rows = await prisma.pricingConfig.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return rows.map((r) => ({
      id: r.id,
      category: r.category,
      key: r.key,
      label: r.label,
      value: r.value,
      unit: r.unit,
      sortOrder: r.sortOrder,
      isActive: r.isActive,
    }));
  } catch {
    return [];
  }
}

export async function updatePricingValue(id: string, value: number) {
  try {
    await prisma.pricingConfig.update({
      where: { id },
      data: { value },
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (err) {
    console.error("Fiyat güncelleme hatası:", err);
    return { success: false, error: "Fiyat güncellenemedi." };
  }
}

export async function togglePricingActive(id: string, isActive: boolean) {
  try {
    await prisma.pricingConfig.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (err) {
    console.error("Fiyat aktiflik hatası:", err);
    return { success: false, error: "Güncellenemedi." };
  }
}

export async function createPricingConfig(data: {
  category: string;
  key: string;
  label: string;
  value: number;
  unit?: string;
  sortOrder?: number;
}) {
  try {
    await prisma.pricingConfig.create({
      data: {
        category: data.category,
        key: data.key,
        label: data.label,
        value: data.value,
        unit: data.unit || null,
        sortOrder: data.sortOrder || 0,
        isActive: true,
      },
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (err) {
    console.error("Fiyat ekleme hatası:", err);
    return { success: false, error: "Eklenemedi." };
  }
}

export async function updatePricingByKey(key: string, value: number) {
  try {
    await prisma.pricingConfig.update({
      where: { key },
      data: { value },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deletePricingConfig(id: string) {
  try {
    await prisma.pricingConfig.delete({
      where: { id },
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (err) {
    console.error("Fiyat silme hatası:", err);
    return { success: false, error: "Silinemedi." };
  }
}
