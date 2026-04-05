import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json([], { status: 401 });

    const user = session.user as Record<string, unknown>;
    const portalUserId = user.portalUserId as string | undefined;
    const role = user.role as string;

    if (role !== "portal" || !portalUserId) {
      return NextResponse.json([], { status: 403 });
    }

    const messages = await prisma.portalMessage.findMany({
      where: { portalUserId },
      orderBy: { createdAt: "asc" },
    });

    // Admin mesajlarını okundu yap
    await prisma.portalMessage.updateMany({
      where: { portalUserId, senderType: "ADMIN", isRead: false },
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

    const user = session.user as Record<string, unknown>;
    const portalUserId = user.portalUserId as string | undefined;
    const role = user.role as string;

    if (role !== "portal" || !portalUserId) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Mesaj boş olamaz" }, { status: 400 });
    }

    const message = await prisma.portalMessage.create({
      data: {
        portalUserId,
        content: content.trim(),
        senderType: "CUSTOMER",
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
