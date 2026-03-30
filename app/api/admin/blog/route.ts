import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

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

// GET /api/admin/blog
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const publishedParam = searchParams.get("published");

    const where: Record<string, unknown> = {};
    if (publishedParam === "true") where.published = true;
    if (publishedParam === "false") where.published = false;
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[blog GET] Hata:", err);
    return NextResponse.json({ error: "Blog yazıları yüklenemedi." }, { status: 500 });
  }
}

// POST /api/admin/blog — Prisma doğrudan (Server Action değil)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Başlık ve içerik zorunludur." },
        { status: 400 }
      );
    }

    // Slug oluştur
    let slug = body.slug?.trim()
      ? turkishToSlug(body.slug)
      : turkishToSlug(body.title);

    // Slug benzersizliği
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug: finalSlug }, select: { id: true } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Tags: string → array dönüşümü
    let tags: string[] = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags;
    } else if (typeof body.tags === "string" && body.tags.trim()) {
      tags = body.tags.split(",").map((t: string) => t.trim());
    }

    const published = body.published === true;

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: finalSlug,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        tags,
        published,
        publishedAt: published ? new Date() : null,
        authorName: body.authorName || "Vorte Studio",
      },
    });

    // revalidatePath ayrı try/catch — başarısız olsa bile blog oluşmuş olur
    try {
      revalidatePath("/admin/blog");
      revalidatePath("/blog");
      revalidatePath(`/blog/${finalSlug}`);
    } catch {
      console.warn("[blog POST] revalidatePath başarısız ama blog oluşturuldu");
    }

    return NextResponse.json(
      { success: true, id: post.id, slug: post.slug },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[blog POST] Hata:", msg, err);
    return NextResponse.json(
      { error: `Blog oluşturma hatası: ${msg}` },
      { status: 500 }
    );
  }
}
