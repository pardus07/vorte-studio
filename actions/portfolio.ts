"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPortfolioItem(data: {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  techStack: string[];
  liveUrl?: string;
  thumbnail?: string;
  featured: boolean;
  isPublished: boolean;
}) {
  try {
    const maxOrder = await prisma.portfolioItem.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    await prisma.portfolioItem.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        category: data.category || null,
        techStack: data.techStack,
        liveUrl: data.liveUrl || null,
        thumbnail: data.thumbnail || null,
        featured: data.featured,
        isPublished: data.isPublished,
        order: (maxOrder?.order ?? 0) + 1,
      },
    });
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Portfolyo oluşturma hatası:", err);
    return { success: false, error: "Proje oluşturulamadı." };
  }
}

export async function updatePortfolioItem(id: string, data: {
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  techStack?: string[];
  liveUrl?: string;
  thumbnail?: string;
  featured?: boolean;
  isPublished?: boolean;
}) {
  try {
    await prisma.portfolioItem.update({ where: { id }, data });
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Portfolyo güncelleme hatası:", err);
    return { success: false, error: "Güncellenemedi." };
  }
}

export async function togglePublishPortfolio(id: string) {
  try {
    const item = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!item) return { success: false, error: "Bulunamadı." };
    await prisma.portfolioItem.update({
      where: { id },
      data: { isPublished: !item.isPublished },
    });
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Güncellenemedi." };
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    await prisma.portfolioItem.delete({ where: { id } });
    revalidatePath("/admin/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Silinemedi." };
  }
}

export async function getPortfolioItems() {
  try {
    return await prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}
