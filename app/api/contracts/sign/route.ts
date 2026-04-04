import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContractNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, signatureData, userAgent, device } = body;

    if (!contractId || !signatureData) {
      return NextResponse.json(
        { success: false, error: "Eksik bilgi" },
        { status: 400 }
      );
    }

    // IP adresini header'dan al
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "bilinmiyor";

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { proposal: true },
    });

    if (!contract) {
      return NextResponse.json(
        { success: false, error: "Sozlesme bulunamadi" },
        { status: 404 }
      );
    }
    if (!contract.emailVerified) {
      return NextResponse.json(
        { success: false, error: "E-posta dogrulanmamis" },
        { status: 400 }
      );
    }
    if (contract.status === "SIGNED") {
      return NextResponse.json(
        { success: false, error: "Sozlesme zaten imzalanmis" },
        { status: 400 }
      );
    }

    // Sözleşmeyi imzala
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        signatureData,
        signedAt: new Date(),
        signerIp: ip,
        signerAgent: userAgent || "",
        signerDevice: device || "",
        status: "SIGNED",
      },
    });

    // Admin'e bildirim gönder
    await sendContractNotification(
      contract.proposal.firmName,
      contract.signerName
    );

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sozlesme imzalama hatasi:", error);
    return NextResponse.json(
      { success: false, error: "Imzalama basarisiz" },
      { status: 500 }
    );
  }
}
