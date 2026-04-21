"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// FAZ C — Madde 3.5: LeadSource → ClientAcquisitionSource mapper
import { leadSourceToAcquisitionSource } from "@/lib/constants";

/**
 * Site tipine göre yıllık hosting paketi tutarı (TL).
 * Kaynak: CLAUDE.md → Hosting & VDS Kapasite Bilgileri
 * DB alanı aylık tutuyor → client tarafında 12'ye bölünerek kaydedilir.
 */
const YEARLY_HOSTING_BY_SITE_TYPE: Record<string, { yearly: number; plan: string }> = {
  tanitim:     { yearly: 2490, plan: "starter" },
  portfoy:     { yearly: 2490, plan: "starter" },
  katalog:     { yearly: 2490, plan: "starter" },
  randevu:     { yearly: 4490, plan: "business" },
  "e-ticaret": { yearly: 8190, plan: "pro" },
};

function getHostingPackageForSiteType(siteType: string | null | undefined) {
  if (!siteType) return YEARLY_HOSTING_BY_SITE_TYPE.tanitim;
  return YEARLY_HOSTING_BY_SITE_TYPE[siteType] || YEARLY_HOSTING_BY_SITE_TYPE.tanitim;
}

const MaintenanceFormSchema = z.object({
  clientId: z.string().min(1, "Müşteri seçin"),
  websiteUrl: z.string().min(1, "Website URL girin"),
  monthlyFee: z.number().min(1, "Ücret girin"),
  startDate: z.string().optional(),
  renewalDate: z.string().optional(),
  domainExpiry: z.string().optional(),
  sslExpiry: z.string().optional(),
  plan: z.string().optional(),
});

export async function createMaintenanceAction(data: z.infer<typeof MaintenanceFormSchema>) {
  try {
    const parsed = MaintenanceFormSchema.parse(data);
    await prisma.maintenance.create({
      data: {
        clientId: parsed.clientId,
        websiteUrl: parsed.websiteUrl,
        monthlyFee: parsed.monthlyFee,
        startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
        renewalDate: parsed.renewalDate ? new Date(parsed.renewalDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        domainExpiry: parsed.domainExpiry ? new Date(parsed.domainExpiry) : undefined,
        sslExpiry: parsed.sslExpiry ? new Date(parsed.sslExpiry) : undefined,
        plan: parsed.plan || "standard",
        isActive: true,
      },
    });
    await prisma.client.update({
      where: { id: parsed.clientId },
      data: { status: "MAINTENANCE" },
    });
    revalidatePath("/admin/maintenance");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: err.issues[0].message };
    console.error("Bakım oluşturma hatası:", err);
    return { success: false, error: "Bakım paketi oluşturulamadı." };
  }
}

export async function renewSSL(maintenanceId: string) {
  try {
    const m = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: { client: { select: { id: true, name: true } } },
    });
    if (!m) return { success: false, error: "Kayıt bulunamadı." };

    const newExpiry = new Date();
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    await prisma.maintenance.update({
      where: { id: maintenanceId },
      data: { sslExpiry: newExpiry },
    });

    await prisma.activity.create({
      data: {
        clientId: m.clientId,
        type: "ssl_renewed",
        description: `SSL yenilendi: ${m.websiteUrl} — yeni bitiş: ${newExpiry.toLocaleDateString("tr-TR")}`,
      },
    });

    revalidatePath("/admin/maintenance");
    return { success: true };
  } catch {
    return { success: false, error: "SSL yenilenemedi." };
  }
}

export async function getMaintenanceData() {
  try {
    const [maintenances, clients] = await Promise.all([
      prisma.maintenance.findMany({
        where: { isActive: true },
        include: { client: { select: { id: true, name: true } } },
        orderBy: { renewalDate: "asc" },
      }),
      prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);

    const now = new Date();
    const totalFee = maintenances.reduce((s, m) => s + m.monthlyFee, 0);
    const sslWarnings = maintenances.filter(
      (m) => m.sslExpiry && Math.ceil((m.sslExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) <= 30
    ).length;

    return {
      stats: { activeCount: maintenances.length, totalFee, sslWarnings },
      maintenances: maintenances.map((m) => ({
        id: m.id, clientId: m.client.id, clientName: m.client.name,
        websiteUrl: m.websiteUrl, monthlyFee: m.monthlyFee,
        renewalDate: m.renewalDate?.toISOString() || null,
        domainExpiry: m.domainExpiry?.toISOString() || null,
        sslExpiry: m.sslExpiry?.toISOString() || null,
        plan: m.plan,
      })),
      clients,
    };
  } catch (err) {
    console.error("Bakım veri hatası:", err);
    return null;
  }
}

/**
 * Tamamlanan bir proposal'dan bakım kaydı oluşturur.
 * Akış:
 *   1. Proposal + portalUser oku
 *   2. Email ile mevcut Client ara; yoksa proposal bilgilerinden yeni Client yarat
 *   3. Client'ta aktif Maintenance varsa hata döndür (duplicate önle)
 *   4. siteType → yıllık hosting ücreti → /12 = aylık ücret
 *   5. Maintenance oluştur (1 yıl renewal)
 *   6. Client.status = MAINTENANCE, totalRevenue += proposal.totalPrice
 *   7. Activity log + revalidate
 */
export async function createMaintenanceFromProposal(proposalId: string) {
  if (!proposalId || typeof proposalId !== "string") {
    return { success: false, error: "Proposal ID geçersiz." };
  }

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { portalUser: true },
    });

    if (!proposal) {
      return { success: false, error: "Teklif bulunamadı." };
    }

    // Client bul veya oluştur
    let client = null;
    if (proposal.contactEmail) {
      client = await prisma.client.findFirst({
        where: { email: proposal.contactEmail },
      });
    }

    if (!client) {
      // FAZ C 3.5: Bakım akışından oluşan Client için kaynak önceliği:
      //   1) Proposal.leadId varsa Lead.source (ör MAPS_SCRAPER)
      //   2) Lead yoksa "MAINTENANCE" (manuel bakım kaydı)
      // Schema'da Proposal ↔ Lead relation tanımlı değil (yalnız leadId scalar),
      // bu yüzden ayrı findUnique.
      const lead = proposal.leadId
        ? await prisma.lead.findUnique({ where: { id: proposal.leadId } })
        : null;
      const acquisitionSource = lead
        ? leadSourceToAcquisitionSource(lead.source)
        : "MAINTENANCE";
      client = await prisma.client.create({
        data: {
          name: proposal.contactName || proposal.firmName,
          company: proposal.firmName,
          email: proposal.contactEmail,
          phone: proposal.contactPhone,
          sector: proposal.sector,
          status: "MAINTENANCE",
          totalRevenue: proposal.totalPrice,
          notes: `Bakım kaydı otomatik oluşturuldu (proposal ${proposal.id.slice(0, 8)})`,
          acquisitionSource,
          acquisitionDate: lead?.createdAt ?? new Date(),
          originalLeadId: lead?.id ?? null,
        },
      });
    } else {
      // Mevcut müşteri — revenue ekle ve statü güncelle
      await prisma.client.update({
        where: { id: client.id },
        data: {
          status: "MAINTENANCE",
          totalRevenue: { increment: proposal.totalPrice },
        },
      });
    }

    // Aktif bakım var mı kontrol et
    const existing = await prisma.maintenance.findFirst({
      where: { clientId: client.id, isActive: true },
    });
    if (existing) {
      return {
        success: false,
        error: "Bu müşteri için zaten aktif bir bakım kaydı var.",
        maintenanceId: existing.id,
      };
    }

    // Site tipi → paket → ücret
    const pkg = getHostingPackageForSiteType(proposal.siteType);
    const monthlyFee = Math.round((pkg.yearly / 12) * 100) / 100; // 2 ondalık

    // Website URL: domainName > stagingUrl > firmName
    const websiteUrl =
      proposal.domainName?.trim() ||
      proposal.portalUser?.stagingUrl?.trim() ||
      `${proposal.firmName.toLowerCase().replace(/\s+/g, "-")}.com.tr`;

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    const maintenance = await prisma.maintenance.create({
      data: {
        clientId: client.id,
        websiteUrl,
        monthlyFee,
        plan: pkg.plan,
        startDate: now,
        renewalDate: oneYearLater,
        domainExpiry: oneYearLater,
        sslExpiry: oneYearLater,
        isActive: true,
        notes: `${pkg.plan.toUpperCase()} paket — ${pkg.yearly.toLocaleString("tr-TR")} ₺/yıl`,
      },
    });

    // Activity log
    await prisma.activity.create({
      data: {
        clientId: client.id,
        type: "maintenance_created",
        description: `Bakım kaydı açıldı: ${websiteUrl} — ${pkg.plan} paket (${pkg.yearly.toLocaleString("tr-TR")} ₺/yıl)`,
      },
    });

    revalidatePath("/admin/maintenance");
    revalidatePath(`/admin/portal/${proposal.portalUser?.id}`);
    revalidatePath("/admin/crm");

    return {
      success: true,
      maintenanceId: maintenance.id,
      clientId: client.id,
      monthlyFee,
      yearlyFee: pkg.yearly,
      plan: pkg.plan,
    };
  } catch (err) {
    console.error("createMaintenanceFromProposal hatası:", err);
    return { success: false, error: "Bakım kaydı oluşturulamadı." };
  }
}

export async function getClientActivities(clientId: string) {
  try {
    const activities = await prisma.activity.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return activities.map((a) => ({
      id: a.id, type: a.type, description: a.description,
      createdAt: a.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}
