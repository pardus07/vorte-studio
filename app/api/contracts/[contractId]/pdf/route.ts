import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContractPDF } from "@/lib/contract-pdf";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  try {
    // Admin kontrolü
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { contractId } = await params;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { proposal: true },
    });

    if (!contract) {
      return NextResponse.json({ error: "Sozlesme bulunamadi" }, { status: 404 });
    }

    if (contract.status !== "SIGNED") {
      return NextResponse.json({ error: "Sozlesme henuz imzalanmamis" }, { status: 400 });
    }

    // KDV hesaplama
    const totalPrice = contract.proposal.totalPrice;
    const kdvAmount = Math.round(totalPrice * 0.20);
    const totalWithKdv = totalPrice + kdvAmount;

    const signedAtStr = contract.signedAt
      ? contract.signedAt.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

    const pdfBuffer = await generateContractPDF({
      contractText: contract.contractText,
      firmName: contract.proposal.firmName,
      signerName: contract.signerName,
      signerCompany: contract.signerCompany || undefined,
      signatureData: contract.signatureData || "",
      signedAt: signedAtStr,
      signerIp: contract.signerIp || "bilinmiyor",
      signerAgent: contract.signerAgent || "bilinmiyor",
      contractHash: contract.contractHash,
      items: contract.proposal.items as Array<{ label: string; cost: number }>,
      totalPrice,
      kdvAmount,
      totalWithKdv,
      paymentPlan: contract.proposal.paymentPlan as Array<{
        label: string;
        percent: number;
        amount: number;
        description: string;
      }>,
      ownerName: process.env.VORTE_OWNER_NAME || "Vorte Studio",
      ownerIban: process.env.VORTE_IBAN || "",
    });

    const fileName = `Vorte_Studio_Sozlesme_${contract.proposal.firmName.replace(/\s+/g, "_")}.pdf`;
    const isDownload = req.nextUrl.searchParams.get("download") === "1";

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PDF olusturma hatasi:", error);
    return NextResponse.json({ error: "PDF olusturulamadi" }, { status: 500 });
  }
}
