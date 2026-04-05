import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json([], { status: 401 });
    if ((session.user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json([], { status: 403 });
    }

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json([], { status: 400 });

    const messages = await prisma.portalMessage.findMany({
      where: { portalUserId: userId },
      orderBy: { createdAt: "asc" },
    });

    // Müşteri mesajlarını okundu yap
    await prisma.portalMessage.updateMany({
      where: { portalUserId: userId, senderType: "CUSTOMER", isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json(
      messages.map((m) => ({
        id: m.id,
        content: m.content,
        senderType: m.senderType,
        isRead: m.isRead,
        createdAt: m.createdAt.toISOString(),
      }))
    );
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    if ((session.user as Record<string, unknown>).role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { portalUserId, content } = await req.json();
    if (!portalUserId || !content?.trim()) {
      return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const message = await prisma.portalMessage.create({
      data: {
        portalUserId,
        content: content.trim(),
        senderType: "ADMIN",
      },
    });

    return NextResponse.json({
      id: message.id,
      content: message.content,
      senderType: message.senderType,
      isRead: false,
      createdAt: message.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Mesaj gönderilemedi" }, { status: 500 });
  }
}
