import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    // Paralel sorgular — performans için
    const [unreadSubmissions, signedContracts, paidPayments, recentLeads] =
      await Promise.all([
        // Okunmamış chatbot başvuruları
        prisma.chatSubmission.count({
          where: { isRead: false },
        }),

        // İmzalanmış sözleşmeler (toplam)
        prisma.contract.count({
          where: { status: "SIGNED" },
        }),

        // Tamamlanmış ödemeler (toplam)
        prisma.proposalPayment.count({
          where: { status: "PAID" },
        }),

        // Son 24 saatteki lead sayısı
        prisma.lead.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    return NextResponse.json({
      unreadSubmissions,
      signedContracts,
      paidPayments,
      recentLeads,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Bildirim sayıları alınamadı:", error);
    return NextResponse.json(
      { error: "Bildirim verileri alınamadı" },
      { status: 500 }
    );
  }
}
