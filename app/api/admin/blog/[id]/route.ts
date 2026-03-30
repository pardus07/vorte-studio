import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/actions/blog";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/admin/blog/[id]
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// PATCH /api/admin/blog/[id]
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
    const result = await updateBlogPost(id, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek verisi." },
      { status: 400 }
    );
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const result = await deleteBlogPost(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
