"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateContractText, hashContractText } from "@/lib/contract-template";
import {
  sendVerificationEmail,
  sendContractNotification,
} from "@/lib/email";
import { createPortalAccount } from "@/actions/portal";

// ── Feature labels (sözleşme metni için) ──
const FEATURE_LABELS: Record<string, string> = {
  "online-randevu": "Online Randevu Sistemi",
  "urun-katalogu": "Ürün Kataloğu / Admin Paneli",
  whatsapp: "WhatsApp Entegrasyonu",
  harita: "Google Harita",
  galeri: "Fotoğraf Galerisi",
  blog: "Blog Sistemi",
  yorumlar: "Müşteri Yorumları",
  "sosyal-medya": "Sosyal Medya Entegrasyonu",
  "online-odeme": "Online Ödeme Sistemi",
  "cok-dilli": "Çok Dilli Site",
  "canli-destek": "Canlı Destek",
  seo: "SEO Optimizasyonu",
  "fiyat-listesi": "Fiyat / Hizmet Listesi",
  "ekip-tanitim": "Ekip / Kadro Tanıtımı",
  "portfoy-referans": "Proje Portföyü / Referanslar",
  "online-siparis": "Online Sipariş / Paket Servis",
  "teklif-formu": "Teklif İsteme Formu",
  sss: "SSS (Sıkça Sorulan Sorular)",
  "once-sonra": "Önce / Sonra Galerisi",
  "video-galeri": "Video Galeri",
  "bolge-harita": "Hizmet Bölgeleri Haritası",
  kampanya: "Kampanya / İndirim Sistemi",
  rezervasyon: "Rezervasyon Sistemi",
  "e-bulten": "E-Bülten Abonelik",
};

// ── Sözleşme taslağı oluştur ──
export async function createContractDraft(
  proposalToken: string,
  signerInfo: {
    signerName: string;
    signerTcNo?: string;
    signerTaxNo?: string;
    signerTitle?: string;
    signerCompany?: string;
    signerEmail: string;
    signerPhone?: string;
    signerAddress?: string;
  }
) {
  try {
    // Teklifi bul
    const proposal = await prisma.proposal.findUnique({
      where: { token: proposalToken },
      include: { contract: true },
    });
    if (!proposal) return { success: false, error: "Teklif bulunamadı" };
    if (proposal.status !== "ACCEPTED") return { success: false, error: "Teklif henüz onaylanmamış" };
    if (proposal.contract) {
      return { success: true, contractId: proposal.contract.id, existing: true };
    }

    // KDV hesapla
    const kdvRate = 0.20;
    const kdvAmount = Math.round(proposal.totalPrice * kdvRate);
    const totalWithKdv = proposal.totalPrice + kdvAmount;

    // Sözleşme metnini oluştur
    const contractDate = new Date().toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const contractText = generateContractText({
      ownerName: process.env.VORTE_OWNER_NAME || "Vorte Studio",
      ownerTcNo: process.env.VORTE_OWNER_TCKN || "",
      ownerAddress:
        process.env.VORTE_ADDRESS ||
        "Mansuroğlu Mah. Ankara Caddesi No:81/012 Bayraklı Tower, 35030 Bayraklı / İzmir",
      ownerPhone: process.env.VORTE_PHONE || "05431883425",
      ownerEmail: process.env.SMTP_USER || "info@vortestudio.com",
      ownerIban: process.env.VORTE_IBAN || "",
      ownerTaxOffice: process.env.VORTE_TAX_OFFICE || "",
      signerName: signerInfo.signerName,
      signerTcNo: signerInfo.signerTcNo,
      signerTaxNo: signerInfo.signerTaxNo,
      signerTitle: signerInfo.signerTitle,
      signerCompany: signerInfo.signerCompany,
      signerEmail: signerInfo.signerEmail,
      signerPhone: signerInfo.signerPhone,
      signerAddress: signerInfo.signerAddress,
      firmName: proposal.firmName,
      siteType: proposal.siteType || "tanitim",
      features: (proposal.features as string[]) || [],
      pageCount: proposal.pageCount || undefined,
      totalPrice: proposal.totalPrice,
      kdvAmount,
      totalWithKdv,
      paymentPlan: proposal.paymentPlan as Array<{
        label: string;
        percent: number;
        amount: number;
        description: string;
      }>,
      timeline: proposal.timeline || undefined,
      validUntil: new Date(proposal.validUntil).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      contractDate,
      featureLabels: FEATURE_LABELS,
    });

    const contractHash = await hashContractText(contractText);

    const contract = await prisma.contract.create({
      data: {
        proposalId: proposal.id,
        signerName: signerInfo.signerName,
        signerTcNo: signerInfo.signerTcNo,
        signerTaxNo: signerInfo.signerTaxNo,
        signerTitle: signerInfo.signerTitle,
        signerCompany: signerInfo.signerCompany,
        signerEmail: signerInfo.signerEmail,
        signerPhone: signerInfo.signerPhone,
        signerAddress: signerInfo.signerAddress,
        contractText,
        contractHash,
      },
    });

    return { success: true, contractId: contract.id };
  } catch (error) {
    console.error("Sözleşme oluşturma hatası:", error);
    return { success: false, error: "Sözleşme oluşturulamadı" };
  }
}

// ── E-posta doğrulama kodu gönder ──
export async function sendContractVerification(contractId: string) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { proposal: true },
    });
    if (!contract) return { success: false, error: "Sözleşme bulunamadı" };

    // Mevcut kullanılmamış kodları iptal et
    await prisma.verificationCode.updateMany({
      where: { email: contract.signerEmail, type: "contract", used: false },
      data: { used: true },
    });

    // 6 haneli kod oluştur
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika

    await prisma.verificationCode.create({
      data: {
        email: contract.signerEmail,
        code,
        type: "contract",
        expiresAt,
      },
    });

    // E-posta gönder
    const sent = await sendVerificationEmail(
      contract.signerEmail,
      code,
      contract.proposal.firmName
    );

    if (!sent) return { success: false, error: "E-posta gönderilemedi" };

    return { success: true };
  } catch (error) {
    console.error("Doğrulama kodu hatası:", error);
    return { success: false, error: "Doğrulama kodu gönderilemedi" };
  }
}

// ── Doğrulama kodunu kontrol et ──
export async function verifyContractEmail(contractId: string, code: string) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) return { success: false, error: "Sözleşme bulunamadı" };

    const verification = await prisma.verificationCode.findFirst({
      where: {
        email: contract.signerEmail,
        code,
        type: "contract",
        used: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!verification) {
      return { success: false, error: "Geçersiz veya süresi dolmuş kod" };
    }

    // Kodu kullanıldı olarak işaretle
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    // Sözleşmeyi doğrulanmış olarak güncelle
    await prisma.contract.update({
      where: { id: contractId },
      data: { emailVerified: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Doğrulama hatası:", error);
    return { success: false, error: "Doğrulama başarısız" };
  }
}

// ── Sözleşmeyi imzala ──
export async function signContract(
  contractId: string,
  signatureData: string,
  metadata: {
    ip: string;
    userAgent: string;
    device: string;
  }
) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { proposal: true },
    });
    if (!contract) return { success: false, error: "Sözleşme bulunamadı" };
    if (!contract.emailVerified) return { success: false, error: "E-posta doğrulanmamış" };
    if (contract.status === "SIGNED") return { success: false, error: "Sözleşme zaten imzalanmış" };

    // Sözleşmeyi imzala
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        signatureData,
        signedAt: new Date(),
        signerIp: metadata.ip,
        signerAgent: metadata.userAgent,
        signerDevice: metadata.device,
        status: "SIGNED",
      },
    });

    // Admin'e bildirim gönder
    await sendContractNotification(
      contract.proposal.firmName,
      contract.signerName
    );

    // Portal hesabı oluştur ve müşteriye giriş bilgilerini gönder
    await createPortalAccount(contract.proposalId);

    revalidatePath("/admin/proposals");
    revalidatePath("/admin/leads");
    revalidatePath("/admin/portal");

    return { success: true };
  } catch (error) {
    console.error("İmzalama hatası:", error);
    return { success: false, error: "İmzalama başarısız" };
  }
}

// ── Sözleşme bilgisini getir (public) ──
export async function getContractByProposal(proposalToken: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { token: proposalToken },
      include: { contract: true },
    });
    if (!proposal?.contract) return null;

    const c = proposal.contract;
    return {
      id: c.id,
      status: c.status,
      emailVerified: c.emailVerified,
      signerName: c.signerName,
      contractText: c.contractText,
      contractHash: c.contractHash,
      signedAt: c.signedAt?.toISOString() || null,
    };
  } catch {
    return null;
  }
}
