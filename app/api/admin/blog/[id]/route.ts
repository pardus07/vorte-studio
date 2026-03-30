import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// Türkçe-safe slug
function turkishToSlug(text: string): string {
  const charMap: Record<string, string> = {
    ş: "s", Ş: "s", ç: "c", Ç: "c", ö: "o", Ö: "o",
    ü: "u", Ü: "u", ğ: "g", Ğ: "g", ı: "i", İ: "i",
  };
  return text
    .toLowerCase()
    .replace(/[şŞçÇöÖüÜğĞıİ]/g, (ch) => charMap[ch] || ch)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/admin/blog/[id]
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[blog GET id] Hata:", err);
    return NextResponse.json({ error: "Blog yazısı yüklenemedi." }, { status: 500 });
  }
}

// PATCH /api/admin/blog/[id] — Prisma doğrudan
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt || null;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage || null;
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle || null;
    if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription || null;

    // Slug güncelleme
    if (body.slug !== undefined) {
      let slug = turkishToSlug(body.slug);
      let finalSlug = slug;
      let counter = 1;
      while (true) {
        const found = await prisma.blogPost.findUnique({ where: { slug: finalSlug }, select: { id: true } });
        if (!found || found.id === id) break;
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData.slug = finalSlug;
    }

    // Tags
    if (body.tags !== undefined) {
      if (Array.isArray(body.tags)) {
        updateData.tags = body.tags;
      } else if (typeof body.tags === "string") {
        updateData.tags = body.tags.split(",").map((t: string) => t.trim());
      }
    }

    // Published
    if (body.published !== undefined) {
      updateData.published = body.published;
      if (body.published && !existing.published) {
        updateData.publishedAt = new Date();
      }
      if (!body.published) {
        updateData.publishedAt = null;
      }
    }

    await prisma.blogPost.update({ where: { id }, data: updateData });

    try {
      revalidatePath("/admin/blog");
      revalidatePath("/blog");
      revalidatePath(`/blog/${existing.slug}`);
    } catch {
      console.warn("[blog PATCH] revalidatePath başarısız");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[blog PATCH] Hata:", msg, err);
    return NextResponse.json(
      { error: `Blog güncelleme hatası: ${msg}` },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] — Prisma doğrudan
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id } });

    try {
      revalidatePath("/admin/blog");
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
    } catch {
      console.warn("[blog DELETE] revalidatePath başarısız");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[blog DELETE] Hata:", msg, err);
    return NextResponse.json(
      { error: `Blog silme hatası: ${msg}` },
      { status: 500 }
    );
  }
}
