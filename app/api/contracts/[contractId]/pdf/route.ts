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
    // Admin kontrolü — portal user'ların başka firmaların contract PDF'ine
    // erişmemesi için role === "admin" şartı zorunlu (IDOR koruması).
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
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

    // HTTP header'lar ISO-8859-1 — Türkçe karakter (ş, ı, ö, ç, ü, ğ, İ)
    // doğrudan yazılamaz (ByteString exception). RFC 5987 ile çift alan:
    //   filename="..."      → ASCII fallback (eski tarayıcı)
    //   filename*=UTF-8''.. → tam Türkçe (modern tarayıcı + indirme adı)
    const rawName = `Vorte_Studio_Sozlesme_${contract.proposal.firmName.replace(/\s+/g, "_")}`;
    const asciiName = rawName
      .replace(/[ışŞİı]/g, "i")
      .replace(/[İ]/g, "I")
      .replace(/[şŞ]/g, "s")
      .replace(/[çÇ]/g, "c")
      .replace(/[öÖ]/g, "o")
      .replace(/[üÜ]/g, "u")
      .replace(/[ğĞ]/g, "g")
      .replace(/[^\x20-\x7E]/g, "_"); // kalan her non-ASCII → _
    const utf8Name = encodeURIComponent(rawName);
    const isDownload = req.nextUrl.searchParams.get("download") === "1";
    const disposition = isDownload ? "attachment" : "inline";

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${asciiName}.pdf"; filename*=UTF-8''${utf8Name}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF olusturma hatasi:", error);
    // Admin debug için gerçek hata mesajı — prod'da sadece auth'lu admin
    // bu endpoint'i çağırabildiği için PII sızıntısı riski yok.
    const msg = error instanceof Error ? error.message : "bilinmeyen hata";
    return NextResponse.json({ error: "PDF olusturulamadi", detail: msg }, { status: 500 });
  }
}
