import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { turkishToSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const dynamic = "force-dynamic";

/** Blog oluşturma şeması — AI asistanın gönderdiği formatla uyumlu */
const CreateBlogSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  content: z.string().min(1, "İçerik zorunludur"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
  authorName: z.string().optional(),
});

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
    const raw = await request.json();
    const parsed = CreateBlogSchema.safeParse(raw);

    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const body = parsed.data;

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
