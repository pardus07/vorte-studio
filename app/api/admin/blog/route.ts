import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBlogPosts, createBlogPost } from "@/actions/blog";

// GET /api/admin/blog?search=...&published=true|false
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const publishedParam = searchParams.get("published");
  const published =
    publishedParam === "true" ? true : publishedParam === "false" ? false : undefined;

  const posts = await getBlogPosts({ search, published });
  return NextResponse.json({ posts });
}

// POST /api/admin/blog
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await createBlogPost(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek verisi." },
      { status: 400 }
    );
  }
}
