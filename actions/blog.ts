"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ── Slug oluşturma (Turkce-safe) ──
function turkishToSlug(text: string): string {
  const charMap: Record<string, string> = {
    ş: "s", Ş: "s",
    ç: "c", Ç: "c",
    ö: "o", Ö: "o",
    ü: "u", Ü: "u",
    ğ: "g", Ğ: "g",
    ı: "i", İ: "i",
  };
  return text
    .toLowerCase()
    .replace(/[şŞçÇöÖüÜğĞıİ]/g, (ch) => charMap[ch] || ch)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let counter = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }
    counter++;
    candidate = `${slug}-${counter}`;
  }
}

// ── Blog yazılarını listele ──
export async function getBlogPosts(opts?: {
  published?: boolean;
  search?: string;
}) {
  try {
    const where: Record<string, unknown> = {};

    if (opts?.published !== undefined) {
      where.published = opts.published;
    }

    if (opts?.search) {
      where.OR = [
        { title: { contains: opts.search, mode: "insensitive" } },
        { excerpt: { contains: opts.search, mode: "insensitive" } },
        { tags: { hasSome: [opts.search] } },
      ];
    }

    return await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Blog yazıları getirme hatası:", err);
    return [];
  }
}

// ── Tek blog yazısı getir ──
export async function getBlogPost(id: string) {
  try {
    return await prisma.blogPost.findUnique({ where: { id } });
  } catch (err) {
    console.error("Blog yazısı getirme hatası:", err);
    return null;
  }
}

// ── Blog yazısı oluştur ──
export async function createBlogPost(data: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  published?: boolean;
  authorName?: string;
}) {
  try {
    const rawSlug = data.slug?.trim()
      ? turkishToSlug(data.slug)
      : turkishToSlug(data.title);
    const slug = await ensureUniqueSlug(rawSlug);

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: data.tags || [],
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
        authorName: data.authorName || "Vorte Studio",
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { success: true, id: post.id, slug: post.slug };
  } catch (err) {
    console.error("Blog yazısı oluşturma hatası:", err);
    return { success: false, error: "Blog yazısı oluşturulamadı." };
  }
}

// ── Blog yazısı güncelle ──
export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
    published?: boolean;
    authorName?: string;
  }
) {
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Yazı bulunamadı." };

    const updateData: Record<string, unknown> = { ...data };

    // Slug güncellemesi varsa unique kontrol
    if (data.slug !== undefined) {
      const rawSlug = turkishToSlug(data.slug);
      updateData.slug = await ensureUniqueSlug(rawSlug, id);
    }

    // publishedAt mantığı: false → true geçişinde now() ata
    if (data.published !== undefined) {
      if (data.published && !existing.published) {
        updateData.publishedAt = new Date();
      }
      // Zaten published ise mevcut publishedAt'i koru (dokunma)
      // published → false ise publishedAt'i null yap
      if (!data.published) {
        updateData.publishedAt = null;
      }
    }

    await prisma.blogPost.update({ where: { id }, data: updateData });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    if (updateData.slug && updateData.slug !== existing.slug) {
      revalidatePath(`/blog/${updateData.slug}`);
    }
    return { success: true };
  } catch (err) {
    console.error("Blog yazısı güncelleme hatası:", err);
    return { success: false, error: "Blog yazısı güncellenemedi." };
  }
}

// ── Blog yazısı sil ──
export async function deleteBlogPost(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.blogPost.delete({ where: { id } });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    if (post) revalidatePath(`/blog/${post.slug}`);
    return { success: true };
  } catch (err) {
    console.error("Blog yazısı silme hatası:", err);
    return { success: false, error: "Blog yazısı silinemedi." };
  }
}

// ── Yayın durumunu değiştir ──
export async function togglePublishBlogPost(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { success: false, error: "Yazı bulunamadı." };

    const newPublished = !post.published;
    await prisma.blogPost.update({
      where: { id },
      data: {
        published: newPublished,
        publishedAt: newPublished
          ? post.publishedAt || new Date()
          : null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, published: newPublished };
  } catch (err) {
    console.error("Yayın durumu değiştirme hatası:", err);
    return { success: false, error: "Yayın durumu değiştirilemedi." };
  }
}
