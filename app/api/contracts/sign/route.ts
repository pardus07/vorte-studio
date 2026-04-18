import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContractNotification, sendContractEmail } from "@/lib/email";
import { generateContractPDF } from "@/lib/contract-pdf";
import { generateMesafeliPDF } from "@/lib/mesafeli-pdf";
import { createPortalAccount } from "@/actions/portal";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit: 3 imza denemesi/saat/IP — hassas işlem, brute force koruması
  const limited = checkRateLimit(req, "contract-sign", 3, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { contractId, signatureData, userAgent, device, mesafeliAccepted } = body;

    if (!contractId || !signatureData) {
      return NextResponse.json(
        { success: false, error: "Eksik bilgi" },
        { status: 400 }
      );
    }

    // Mesafeli Satış Sözleşmesi onayı zorunlu (Mesafeli Sözleşmeler Yönetmeliği)
    if (!mesafeliAccepted) {
      return NextResponse.json(
        {
          success: false,
          error: "Mesafeli Satış Sözleşmesini kabul etmeniz gerekmektedir.",
        },
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

    const now = new Date();
    const signedAtStr = now.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Sözleşmeyi imzala
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        signatureData,
        signedAt: now,
        signerIp: ip,
        signerAgent: userAgent || "",
        signerDevice: device || "",
        status: "SIGNED",
      },
    });

    // 2. KDV hesaplama
    const kdvRate = 0.20;
    const totalPrice = contract.proposal.totalPrice;
    const kdvAmount = Math.round(totalPrice * kdvRate);
    const totalWithKdv = totalPrice + kdvAmount;
    const paymentPlan = contract.proposal.paymentPlan as Array<{
      label: string;
      percent: number;
      amount: number;
      description: string;
    }>;
    const items = contract.proposal.items as Array<{ label: string; cost: number }>;

    // 3. Ödeme kayıtları oluştur (3 dilim)
    const paymentRecords = paymentPlan.map((pay, i) => ({
      proposalId: contract.proposal.id,
      stage: i + 1,
      label: `${pay.label} (%${pay.percent})`,
      amount: pay.amount,
      status: "PENDING",
    }));

    for (const record of paymentRecords) {
      await prisma.proposalPayment.create({ data: record });
    }

    // 4. Lead durumunu CONTRACTED yap
    if (contract.proposal.leadId) {
      try {
        await prisma.lead.update({
          where: { id: contract.proposal.leadId },
          data: { status: "CONTRACTED" },
        });
      } catch {
        // Lead bulunamazsa sessizce devam et
      }
    }

    // 5. PDF oluştur
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateContractPDF({
        contractText: contract.contractText,
        firmName: contract.proposal.firmName,
        signerName: contract.signerName,
        signerCompany: contract.signerCompany || undefined,
        signatureData,
        signedAt: signedAtStr,
        signerIp: ip,
        signerAgent: userAgent || "bilinmiyor",
        contractHash: contract.contractHash,
        items,
        totalPrice,
        kdvAmount,
        totalWithKdv,
        paymentPlan,
        ownerName: process.env.VORTE_OWNER_NAME || "Vorte Studio",
        ownerIban: process.env.VORTE_IBAN || "",
      });
    } catch (pdfError) {
      console.error("PDF olusturma hatasi:", pdfError);
      // PDF oluşturulamazsa bile imzalama başarılı
    }

    // 5.b Mesafeli Satış Sözleşmesi PDF — 6502 sayılı Kanun ve Mesafeli
    //     Sözleşmeler Yönetmeliği m.5/1-a ve m.6 uyarınca tüketiciye
    //     kalıcı veri saklayıcısı üzerinden iletilmesi zorunlu.
    let mesafeliBuffer: Buffer | null = null;
    try {
      const siteType = (contract.proposal.siteType || "").toLowerCase();
      const packagePlan =
        siteType === "e-ticaret" || siteType === "eticaret"
          ? "E-Ticaret"
          : siteType === "randevu" || siteType === "rezervasyon" || siteType === "profesyonel"
          ? "Profesyonel"
          : siteType
          ? "Starter"
          : "Teklife göre";

      mesafeliBuffer = await generateMesafeliPDF({
        firmName: contract.proposal.firmName,
        signerName: contract.signerName,
        signerEmail: contract.signerEmail || "",
        signerCompany: contract.signerCompany || undefined,
        signedAt: signedAtStr,
        signerIp: ip,
        signerAgent: userAgent || "bilinmiyor",
        contractHash: contract.contractHash,
        packagePlan,
        totalPrice,
        ownerName: process.env.VORTE_OWNER_NAME || "Vorte Studio",
      });
    } catch (mesafeliError) {
      console.error("Mesafeli PDF olusturma hatasi (kritik degil):", mesafeliError);
      // Hizmet sözleşmesi yine gönderilir; mesafeli eksik kalırsa admin
      // manuel gönderebilir.
    }

    // 6. Müşteriye e-posta gönder (PDF ekli — hizmet + mesafeli)
    if (pdfBuffer && contract.signerEmail) {
      await sendContractEmail(
        contract.signerEmail,
        contract.proposal.firmName,
        pdfBuffer,
        mesafeliBuffer || undefined
      );
    }

    // 7. Admin'e bildirim gönder
    await sendContractNotification(
      contract.proposal.firmName,
      contract.signerName
    );

    // 8. Portal hesabını PASİF olarak oluştur (peşinat ödenince aktive olacak)
    //    Mail HENÜZ atılmıyor — müşteri önce ödemeli, sonra giriş bilgisi gelir.
    try {
      await createPortalAccount(contract.proposal.id, {
        activateImmediately: false,
      });
    } catch (portalError) {
      console.error("Portal hesap oluşturma hatası (kritik değil):", portalError);
      // Portal oluşturulamazsa imzalama yine başarılı sayılır;
      // admin daha sonra manuel oluşturabilir.
    }

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");
    revalidatePath("/admin/portal");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sozlesme imzalama hatasi:", error);
    return NextResponse.json(
      { success: false, error: "Imzalama basarisiz" },
      { status: 500 }
    );
  }
}
