import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  const { id } = await params;
  try {
    const callLog = await prisma.callLog.findUnique({ where: { id } });
    if (!callLog) return NextResponse.json({ error: "Bulunamadi" }, { status: 404 });
    return NextResponse.json({ callLog });
  } catch (error) {
    console.error("[voice-calls] GET [id] error:", error);
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.isRead !== undefined) data.isRead = body.isRead;
    const callLog = await prisma.callLog.update({ where: { id }, data });
    return NextResponse.json({ callLog });
  } catch (error) {
    console.error("[voice-calls] PATCH error:", error);
    return NextResponse.json({ error: "Guncelleme hatasi" }, { status: 500 });
  }
}
