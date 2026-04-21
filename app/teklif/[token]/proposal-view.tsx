"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { acceptProposal, rejectProposal } from "@/actions/proposals";
import { getContractByProposal } from "@/actions/contracts";
import ContractSigning from "./contract-signing";

// ── Label Maps ──
const SITE_TYPE_LABELS: Record<string, string> = {
  tanitim: "Tanıtım Sitesi",
  "e-ticaret": "E-Ticaret Sitesi",
  portfoy: "Portföy Sitesi",
  randevu: "Randevu Sistemi",
  katalog: "Katalog Sitesi",
  belirsiz: "Özel Proje",
};

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

const TIMELINE_LABELS: Record<string, string> = {
  acil: "2 hafta içinde",
  "1-ay": "1 ay içinde",
  "2-3-ay": "2-3 ay içinde",
  esnek: "Esnek zamanlama",
};

// ── Sektöre göre Problem → Çözüm metinleri ──
function getProblemSolution(
  sector: string | null,
  siteType: string | null,
  contentStatus: string | null
) {
  const hasSite = contentStatus === "mevcut-site";
  const sectorLower = (sector || "").toLowerCase();

  // Sektöre özel problem/çözüm
  const sectorTexts: Record<
    string,
    { problemExisting: string; problemNew: string; solution: string }
  > = {
    avukat: {
      problemExisting:
        "Eski ve güncel olmayan bir web sitesi, potansiyel müvekkillerinizin güvenini zedeliyor. İlk izlenim dijitalde başlıyor.",
      problemNew:
        "Web sitesi olmayan bir hukuk bürosu, potansiyel müvekkillerinin gözünde görünmez kalıyor. Müşterilerinizin %90'ı avukat ararken interneti kullanıyor.",
      solution:
        "Profesyonel ve güven veren bir web sitesi ile müvekkilleriniz sizi ilk bakışta ciddiye alacak. Online randevu ve iletişim formları ile yeni müvekkil kazanımınız artacak.",
    },
    doktor: {
      problemExisting:
        "Mobil uyumsuz veya eski bir site, hastalarınızın online randevu almasını zorlaştırıyor.",
      problemNew:
        "Dijital varlığı olmayan bir sağlık profesyoneli, hasta portföyünü büyütmekte zorlanıyor. Hastaların %70'i doktor seçerken online araştırma yapıyor.",
      solution:
        "Modern, mobil uyumlu ve online randevu sistemi olan bir site ile hasta memnuniyetinizi ve randevu sayınızı artırın.",
    },
    restoran: {
      problemExisting:
        "Güncel olmayan menü ve fotoğraflar, müşterilerinizin beklentilerini karşılamıyor.",
      problemNew:
        "Restoranınızın web sitesi yoksa, Google'da arayan potansiyel müşterileriniz rakiplerinizi buluyor. Online sipariş ve menü görüntüleme artık standart bir beklenti.",
      solution:
        "İştah açan fotoğraflar, güncel menü ve online sipariş sistemi ile müşteri trafiğinizi ve siparişlerinizi artırın.",
    },
    emlak: {
      problemExisting:
        "İlan güncellenmesi zor olan eski bir site, müşterilerinize profesyonel bir izlenim vermiyor.",
      problemNew:
        "Emlak sektöründe dijital varlığı olmayan bir ofis, portföyündeki ilanları etkili şekilde sergileyemiyor.",
      solution:
        "Filtrelenebilir ilan listesi, detaylı galeri ve harita entegrasyonu ile gayrimenkul portföyünüzü profesyonelce sergileyin.",
    },
    "e-ticaret": {
      problemExisting:
        "Yavaş yüklenen ve kullanıcı deneyimi zayıf bir e-ticaret sitesi, sepet terk oranını artırıyor.",
      problemNew:
        "Online satış kanalınız yoksa, 7/24 satış yapma fırsatını kaçırıyorsunuz. Türkiye'de e-ticaret her yıl %30+ büyüyor.",
      solution:
        "Hızlı, güvenli ve mobil uyumlu bir e-ticaret sitesi ile 7/24 satış yapın. Güvenli ödeme altyapısı ve kolay yönetim paneli ile işletmenizi büyütün.",
    },
  };

  // Sektör eşleşmesi bul
  let matched = sectorTexts["e-ticaret"]; // varsayılan
  if (siteType === "e-ticaret") {
    matched = sectorTexts["e-ticaret"];
  } else {
    for (const key of Object.keys(sectorTexts)) {
      if (sectorLower.includes(key)) {
        matched = sectorTexts[key];
        break;
      }
    }
  }

  // Eşleşme bulunamazsa genel metin
  if (!matched || matched === sectorTexts["e-ticaret"] && siteType !== "e-ticaret") {
    matched = {
      problemExisting:
        "Eski ve mobil uyumsuz bir web sitesi, ziyaretçilerinizin %60'ını ilk 3 saniyede kaybetmenize neden oluyor.",
      problemNew:
        "Dijital dünyada var olmayan bir işletme, potansiyel müşterilerinin büyük çoğunluğunu kaybediyor. Web siteniz 7/24 çalışan satış temsilciniz olacak.",
      solution:
        "Modern, hızlı ve profesyonel bir web sitesi ile markanızı güçlendirin, yeni müşteriler kazanın ve işletmenizi büyütün.",
    };
  }

  const problem = hasSite ? matched.problemExisting : matched.problemNew;

  // Web sitesinin artıları (sitesi olmayanlara ek bilgi)
  const benefits = !hasSite
    ? [
        "7/24 erişilebilir dijital vitrin",
        "Google'da bulunabilirlik ve SEO avantajı",
        "Profesyonel marka imajı ve güven",
        "Otomatik müşteri kazanım kanalı",
      ]
    : null;

  return { problem, solution: matched.solution, benefits };
}

// ── Timeline'a göre süreç hafta dağılımı ──
function getProcessSteps(timeline: string | null) {
  const steps = [
    {
      title: "Keşif & Planlama",
      desc: "İhtiyaç analizi, içerik planı ve site haritası oluşturma",
      icon: "🔍",
    },
    {
      title: "Tasarım & Onay",
      desc: "Marka kimliğine uygun modern tasarım ve revizyon süreci",
      icon: "🎨",
    },
    {
      title: "Geliştirme",
      desc: "Kodlama, entegrasyonlar ve tüm özelliklerin aktifleştirilmesi",
      icon: "⚙️",
    },
    {
      title: "Test & Canlıya Alma",
      desc: "Performans testi, mobil uyumluluk kontrolü ve yayına alma",
      icon: "🚀",
    },
  ];

  let weeks: string[];
  switch (timeline) {
    case "acil":
      weeks = ["1-2. Gün", "3-5. Gün", "6-10. Gün", "11-14. Gün"];
      break;
    case "1-ay":
      weeks = ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"];
      break;
    case "2-3-ay":
      weeks = ["1-2. Hafta", "3-4. Hafta", "5-8. Hafta", "9-10. Hafta"];
      break;
    default:
      weeks = ["1-2. Hafta", "3-4. Hafta", "5-6. Hafta", "7-8. Hafta"];
  }

  return steps.map((s, i) => ({ ...s, week: weeks[i] }));
}

// ── 3 Paket türetme ──
// FAZ C — Madde 3.3: kdvRate artık DB'den geliyor, parametre olarak geçer.
// Hardcoded 0.20 kaldırıldı; çağıran (ProposalView main) prop'u forward eder.
function generatePackages(
  totalPrice: number,
  features: string[],
  estimatedHours: number | null,
  kdvRate: number
) {
  // Profesyonel = mevcut fiyat (100%)
  // Başlangıç = temel özellikler (%70)
  // Kurumsal = premium özellikler (%150)

  const basicMultiplier = 0.7;
  const premiumMultiplier = 1.5;

  // Temel özellikler — sadece en temel olanlar
  const coreFeatures = new Set([
    "urun-katalogu",
    "whatsapp",
    "harita",
    "galeri",
    "seo",
    "teklif-formu",
    "fiyat-listesi",
  ]);

  // Başlangıç: sadece core özellikler (müşterinin seçtiklerinden)
  const basicSlice = features.filter((f) => coreFeatures.has(f));
  // En az 2 özellik olsun
  if (basicSlice.length < 2) {
    const remaining = features.filter((f) => !coreFeatures.has(f));
    basicSlice.push(...remaining.slice(0, 2 - basicSlice.length));
  }

  // Başlangıçta olmayan ama Profesyonelde olan
  const proOnlyFeatures = features.filter(
    (f) => !basicSlice.includes(f)
  );

  // kdvRate parametreden gelir (FAZ C 3.3) — DB kaynaklı temporal değer

  const basicPrice = Math.round(totalPrice * basicMultiplier);
  const basicWithKdv = Math.round(basicPrice * (1 + kdvRate));
  const proPrice = totalPrice;
  const proWithKdv = Math.round(proPrice * (1 + kdvRate));
  const premiumPrice = Math.round(totalPrice * premiumMultiplier);
  const premiumWithKdv = Math.round(premiumPrice * (1 + kdvRate));

  return [
    {
      name: "Başlangıç",
      subtitle: "Temel ihtiyaçlar için",
      price: basicWithKdv,
      priceRaw: basicPrice,
      features: basicSlice.map((f) => FEATURE_LABELS[f] || f),
      excluded: proOnlyFeatures.map((f) => FEATURE_LABELS[f] || f),
      extras: [
        { label: "Temel SEO ayarları", included: true },
        { label: "1 ay teknik destek", included: true },
        { label: "2 tur tasarım revizyonu", included: true },
        { label: "Performans optimizasyonu", included: false },
        { label: "Aylık analiz raporu", included: false },
      ],
      recommended: false,
      color: "white" as const,
    },
    {
      name: "Profesyonel",
      subtitle: "En çok tercih edilen",
      price: proWithKdv,
      priceRaw: proPrice,
      features: features.map((f) => FEATURE_LABELS[f] || f),
      excluded: [],
      extras: [
        { label: "Kapsamlı SEO optimizasyonu", included: true },
        { label: "3 ay teknik destek", included: true },
        { label: "4 tur tasarım revizyonu", included: true },
        { label: "Performans optimizasyonu", included: false },
        { label: "Aylık analiz raporu", included: false },
      ],
      recommended: true,
      color: "orange" as const,
    },
    {
      name: "Kurumsal",
      subtitle: "Tam kapsamlı çözüm",
      price: premiumWithKdv,
      priceRaw: premiumPrice,
      features: features.map((f) => FEATURE_LABELS[f] || f),
      excluded: [],
      extras: [
        { label: "Gelişmiş SEO + Google Ads desteği", included: true },
        { label: "6 ay teknik destek & bakım", included: true },
        { label: "Sınırsız tasarım revizyonu", included: true },
        { label: "Performans & hız optimizasyonu", included: true },
        { label: "Aylık trafik & dönüşüm raporu", included: true },
        { label: "Admin paneli özel tasarım", included: true },
        { label: "AI chatbot entegrasyonu", included: true },
        { label: "Profesyonel analiz dashboard", included: true },
      ],
      recommended: false,
      color: "purple" as const,
    },
  ];
}

// ── Renk parse — artık hex kodları virgülle ayrılmış geliyor ──
function parseColors(brandColors: string | null): string[] {
  if (!brandColors) return [];
  // Hex kodlarını çıkar
  const hexMatches = brandColors.match(/#[0-9a-fA-F]{3,8}/g);
  if (hexMatches && hexMatches.length > 0) return hexMatches;
  // Virgülle ayrılmış hex kodları (# olmadan da olabilir)
  return brandColors
    .split(",")
    .map((c) => c.trim())
    .filter((c) => /^#?[0-9a-fA-F]{3,8}$/.test(c))
    .map((c) => (c.startsWith("#") ? c : `#${c}`));
}

// ── Renk açıklığı hesapla ──
function isColorDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.4;
}

interface ProposalData {
  id: string;
  token: string;
  firmName: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  sector: string | null;
  city: string | null;
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
  hostingStatus: string | null;
  hostingProvider: string | null;
  domainStatus: string | null;
  domainName: string | null;
  timeline: string | null;
  brandColors: string | null;
  businessGoals: string | null;
  targetAudience: string | null;
  items: Array<{ label: string; hours?: number; cost: number }>;
  totalPrice: number;
  estimatedHours: number | null;
  paymentPlan: Array<{
    label: string;
    percent: number;
    amount: number;
    description: string;
  }>;
  status: string;
  validUntil: string;
  viewedAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  liveUrl: string | null;
  category: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const fmt = (n: number) => n.toLocaleString("tr-TR");

export default function ProposalView({
  proposal,
  portfolioItems = [],
  kdvRate,
  showAccessWarning = false,
}: {
  proposal: ProposalData;
  portfolioItems?: PortfolioItem[];
  // FAZ C — Madde 3.3: KDV oranı SSR'da getPricingValue ile çekilir
  // ve buraya prop olarak geçer. Client tarafı DB'ye erişemediği için
  // bu zorunlu (use server async fn client'tan çağrılamaz).
  kdvRate: number;
  // FAZ B — Madde 2.4 (Q3-a): Proposal'da ne phone ne email kayıtlı
  // olduğunda gate devre dışı kalır ve bu prop true geçirilir — üstte
  // "doğrulamasız görüntüleme" uyarı bantı render edilir.
  showAccessWarning?: boolean;
}) {
  const [accepted, setAccepted] = useState(proposal.status === "ACCEPTED");
  const [rejected, setRejected] = useState(proposal.status === "REJECTED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);

  // Sözleşme durumunu kontrol et
  useEffect(() => {
    if (accepted) {
      getContractByProposal(proposal.token).then((c) => {
        if (c?.status === "SIGNED") setContractSigned(true);
      });
    }
  }, [accepted, proposal.token]);

  const isExpired = new Date(proposal.validUntil) < new Date();
  const canAccept =
    !accepted && !rejected && !isExpired && proposal.status !== "DRAFT";
  const validDate = new Date(proposal.validUntil).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const createdDate = new Date(proposal.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(proposal.validUntil).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  // KDV hesaplama — FAZ C 3.3: kdvRate prop'u SSR'da getPricingValue ile,
  // teklifin createdAt'ine göre çekilir (temporal — teklif imzalandığı
  // andaki oran sabitlenir, bugün rate değişse bile bu teklif etkilenmez).
  const kdvAmount = Math.round(proposal.totalPrice * kdvRate);
  const totalWithKdv = proposal.totalPrice + kdvAmount;

  // Türetilmiş veriler
  const { problem, solution, benefits } = getProblemSolution(
    proposal.sector,
    proposal.siteType,
    proposal.contentStatus
  );
  const processSteps = getProcessSteps(proposal.timeline);
  const packages = generatePackages(
    proposal.totalPrice,
    proposal.features,
    proposal.estimatedHours,
    kdvRate
  );
  const colors = parseColors(proposal.brandColors);

  async function handleAccept() {
    setLoading(true);
    setError(null);
    const res = await acceptProposal(proposal.token);
    if (res.success) {
      setAccepted(true);
    } else {
      setError(res.error || "Bir hata oluştu");
    }
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    setError(null);
    const res = await rejectProposal(proposal.token);
    if (res.success) {
      setRejected(true);
      setShowRejectConfirm(false);
    } else {
      setError(res.error || "Bir hata oluştu");
    }
    setLoading(false);
  }

  let sectionIndex = 0;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header Bar */}
      <div className="border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4500] to-orange-600 text-sm font-bold">
              V
            </div>
            <span className="text-sm font-semibold tracking-tight">
              VORTE<span className="text-[#FF4500]">.</span>STUDIO
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            {!isExpired && !accepted && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {daysLeft} gün geçerli
              </span>
            )}
            {accepted && (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400 border border-emerald-500/20">
                Onaylandı
              </span>
            )}
            {isExpired && !accepted && (
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-red-400 border border-red-500/20">
                Süresi doldu
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FAZ B — Madde 2.4 (Q3-a): Doğrulamasız erişim uyarı bantı.
          Proposal'da phone/email bilgisi yoksa gate uygulanamadığı için
          kullanıcı direkt render görür — bu bant müşteriye/sahibine linkin
          ikinci faktör olmadığını hatırlatır. Dismiss YOK (SSR kalıcı). */}
      {showAccessWarning && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 text-amber-100">
          <div className="mx-auto flex max-w-4xl items-start gap-3 px-6 py-3 text-xs">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="font-medium">
                Bu teklif bağlantısı doğrulamasız görüntülenmektedir.
              </p>
              <p className="mt-0.5 opacity-80">
                Teklifinizde telefon veya e-posta bilgisi bulunmadığı için ek
                doğrulama adımı uygulanamamıştır. Bağlantınızı yalnızca güvendiğiniz
                kişilerle paylaşmanızı öneririz.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* ═══ 1. HERO ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            Teklif · {createdDate}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {proposal.firmName}
          </h1>
          <p className="mt-3 text-sm text-white/40">
            {proposal.siteType
              ? SITE_TYPE_LABELS[proposal.siteType] || proposal.siteType
              : "Web Projesi"}
            {proposal.sector && ` · ${proposal.sector}`}
            {proposal.city && ` · ${proposal.city}`}
          </p>
        </motion.div>

        {/* ═══ 2. PROBLEM → ÇÖZÜM ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
        >
          {/* Problem */}
          <div className="border-b border-white/5 p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <svg
                  className="h-4 w-4 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-1">
                  Mevcut Durum
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {problem}
                </p>
              </div>
            </div>
          </div>

          {/* Çözüm */}
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <svg
                  className="h-4 w-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 mb-1">
                  Çözümümüz
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {solution}
                </p>
              </div>
            </div>

            {/* Web sitesinin artıları (sadece sitesi olmayanlara) */}
            {benefits && (
              <div className="mt-4 ml-11 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2"
                  >
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs text-emerald-300/70">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* İş hedefleri + hedef kitle (varsa) */}
          {(proposal.businessGoals || proposal.targetAudience) && (
            <div className="border-t border-white/5 p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {proposal.businessGoals && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/25 mb-1">
                    İş Hedefleriniz
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {proposal.businessGoals}
                  </p>
                </div>
              )}
              {proposal.targetAudience && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/25 mb-1">
                    Hedef Kitleniz
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {proposal.targetAudience}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ═══ 3. RENK PALETİ ═══ */}
        {colors.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            custom={sectionIndex++}
            variants={fadeUp}
            className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Marka Renk Paletiniz
            </h2>
            <div className="flex flex-wrap gap-5">
              {colors.map((hex, i) => {
                const dark = isColorDark(hex);
                return (
                  <div key={i} className="text-center">
                    <div
                      className="h-16 w-16 rounded-xl sm:h-20 sm:w-20"
                      style={{
                        backgroundColor: hex,
                        border: dark
                          ? "2px solid rgba(255,255,255,0.3)"
                          : "1px solid rgba(255,255,255,0.1)",
                        boxShadow: `0 4px 15px ${hex}40`,
                      }}
                    />
                    <div className="mt-2 text-xs text-white/40 font-mono">
                      {hex}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-white/25">
              Bu renkler sitenizin tasarımında ana palet olarak kullanılacaktır.
            </p>
          </motion.div>
        )}

        {/* ═══ 4. PROJE KAPSAMI ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
            Proje Kapsamı
          </h2>

          {/* Özellikler */}
          {proposal.features.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 text-xs text-white/30 uppercase tracking-wider">
                Dahil Özellikler
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {proposal.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-[#FF4500]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-white/70">
                      {FEATURE_LABELS[f] || f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proje Detayları Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Sayfa Sayısı", value: proposal.pageCount },
              {
                label: "Zamanlama",
                value: proposal.timeline
                  ? TIMELINE_LABELS[proposal.timeline] || proposal.timeline
                  : null,
              },
              {
                label: "Hosting",
                value: proposal.hostingProvider || proposal.hostingStatus,
              },
              {
                label: "Domain",
                value: proposal.domainName || proposal.domainStatus,
              },
            ].map(
              (item) =>
                item.value && (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-white/25">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                      {item.value}
                    </div>
                  </div>
                )
            )}
          </div>
        </motion.div>

        {/* ═══ 5. 3 PAKET SEÇENEĞİ ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8"
        >
          <div className="mb-4 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Paket Seçenekleri
            </h2>
            <p className="mt-1 text-xs text-white/25">
              İhtiyacınıza en uygun paketi seçin (KDV dahil fiyatlar)
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {packages.map((pkg) => {
              const isRecommended = pkg.recommended;
              const borderColor = isRecommended
                ? "border-[#FF4500]/40"
                : pkg.color === "purple"
                  ? "border-purple-500/20"
                  : "border-white/10";
              const bgColor = isRecommended
                ? "bg-[#FF4500]/[0.03]"
                : "bg-white/[0.02]";

              return (
                <div
                  key={pkg.name}
                  className={`relative rounded-2xl border ${borderColor} ${bgColor} p-5 transition-all hover:border-white/20`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF4500] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Önerilen
                    </div>
                  )}

                  <div className="text-center mb-4 pt-1">
                    <h3
                      className={`text-lg font-bold ${isRecommended ? "text-[#FF4500]" : "text-white/70"}`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="text-[10px] text-white/30 mt-0.5">
                      {pkg.subtitle}
                    </div>
                    <div
                      className={`mt-2 text-3xl font-bold tracking-tight ${isRecommended ? "text-white" : "text-white/60"}`}
                    >
                      {fmt(pkg.price)}{" "}
                      <span className="text-sm text-white/30">TL</span>
                    </div>
                    <div className="text-[10px] text-white/20 mt-0.5">
                      KDV dahil
                    </div>
                  </div>

                  {/* Dahil özellikler */}
                  <div className="space-y-1.5 mb-3">
                    {pkg.features.slice(0, 6).map((f) => (
                      <div
                        key={f}
                        className="flex items-start gap-2 text-xs text-white/60"
                      >
                        <svg
                          className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </div>
                    ))}
                    {pkg.features.length > 6 && (
                      <div className="text-[10px] text-emerald-400/40 pl-5.5">
                        +{pkg.features.length - 6} özellik daha
                      </div>
                    )}
                  </div>

                  {/* Hariç özellikler (Başlangıçta) */}
                  {pkg.excluded.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {pkg.excluded.slice(0, 3).map((f) => (
                        <div
                          key={f}
                          className="flex items-start gap-2 text-xs text-white/25 line-through"
                        >
                          <svg
                            className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-400/40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          {f}
                        </div>
                      ))}
                      {pkg.excluded.length > 3 && (
                        <div className="text-[10px] text-red-400/30 pl-5.5">
                          +{pkg.excluded.length - 3} özellik dahil değil
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ekstralar — daha okunaklı */}
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    {pkg.extras.map((e) => (
                      <div
                        key={e.label}
                        className={`flex items-center gap-2 text-xs ${e.included ? "text-white/50" : "text-white/20 line-through"}`}
                      >
                        {e.included ? (
                          <svg
                            className="h-3 w-3 shrink-0 text-[#FF4500]/60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-3 w-3 shrink-0 text-white/15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                        {e.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ 6. SÜREÇ AÇIKLAMASI ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
        >
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-white/50">
            4 Adımda Siteniz Hazır
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {processSteps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                {/* Bağlantı çizgisi (mobilde gizle) */}
                {i < processSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] border-t border-dashed border-white/10" />
                )}

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4500]/10 text-xl">
                  {step.icon}
                </div>
                <h4 className="text-sm font-semibold text-white/70">
                  {step.title}
                </h4>
                <div className="mt-1 rounded-full bg-[#FF4500]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#FF4500] inline-block">
                  {step.week}
                </div>
                <p className="mt-2 text-[11px] text-white/30 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ═══ 7. REFERANS PROJELER (koşullu) ═══ */}
        {portfolioItems.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            custom={sectionIndex++}
            variants={fadeUp}
            className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Benzer Projelerimiz
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {portfolioItems.map((item) => (
                <a
                  key={item.id}
                  href={item.liveUrl || `/portfolyo/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all hover:border-[#FF4500]/30"
                >
                  {item.thumbnail && (
                    <div className="aspect-video overflow-hidden bg-white/5">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-white/70 group-hover:text-[#FF4500] transition-colors">
                      {item.title}
                    </h4>
                    {item.category && (
                      <div className="mt-1 text-[10px] text-white/25">
                        {item.category}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ 8. FİYAT KARTI ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
        >
          <div className="text-xs uppercase tracking-widest text-white/30 mb-3">
            Profesyonel Paket · Toplam Proje Bedeli
          </div>
          <div className="text-5xl font-bold tracking-tight text-[#FF4500] sm:text-6xl">
            {fmt(totalWithKdv)}{" "}
            <span className="text-2xl text-white/30">TL</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-xs text-white/30">
              {fmt(proposal.totalPrice)} TL + %{Math.round(kdvRate * 100)} KDV (
              {fmt(kdvAmount)} TL)
            </div>
            <div className="text-[10px] text-white/15">
              Geçerlilik: {validDate}
            </div>
          </div>
        </motion.div>

        {/* ═══ 9. ÖDEME PLANI ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {proposal.paymentPlan.map((pay, i) => {
            const colors = [
              {
                border: "border-emerald-500/20",
                bg: "bg-emerald-500/5",
                text: "text-emerald-400",
              },
              {
                border: "border-amber-500/20",
                bg: "bg-amber-500/5",
                text: "text-amber-400",
              },
              {
                border: "border-blue-500/20",
                bg: "bg-blue-500/5",
                text: "text-blue-400",
              },
            ][i] || {
              border: "border-white/10",
              bg: "bg-white/5",
              text: "text-white/60",
            };

            return (
              <div
                key={pay.label}
                className={`rounded-xl border ${colors.border} ${colors.bg} p-5 text-center`}
              >
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                  {pay.label} (%{pay.percent})
                </div>
                <div className={`text-2xl font-bold ${colors.text}`}>
                  {fmt(pay.amount)} TL
                </div>
                <div className="mt-1.5 text-xs text-white/30">
                  {pay.description}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ═══ 10. FİYAT KIRILIMI ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
        >
          <div className="border-b border-white/5 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Fiyat Kırılımı
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {proposal.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#FF4500]/60" />
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-white/80">
                  {fmt(item.cost)} TL
                </span>
              </div>
            ))}
          </div>

          {/* Ara Toplam + KDV + Toplam */}
          <div className="border-t border-white/10 bg-white/[0.03] px-6 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">Ara Toplam</span>
              <span className="text-sm text-white/60">
                {fmt(proposal.totalPrice)} TL
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">
                KDV (%{Math.round(kdvRate * 100)})
              </span>
              <span className="text-sm text-white/60">
                {fmt(kdvAmount)} TL
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-sm font-semibold text-white/70">
                TOPLAM (KDV Dahil)
              </span>
              <span className="text-xl font-bold text-[#FF4500]">
                {fmt(totalWithKdv)} TL
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══ 11. CTA ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="mb-12"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {accepted ? (
            <div className="space-y-6">
              {/* Teklif onay mesajı */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg
                    className="h-6 w-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-emerald-400">
                  Teklif Onaylandı!
                </h3>
                {!contractSigned && (
                  <p className="mt-2 text-sm text-white/40">
                    Projeye başlamak için aşağıdaki sözleşmeyi imzalayın.
                  </p>
                )}
              </div>

              {/* Sözleşme imzalama bölümü */}
              {!contractSigned ? (
                <ContractSigning
                  proposalToken={proposal.token}
                  firmName={proposal.firmName}
                  contactName={proposal.contactName}
                  contactEmail={proposal.contactEmail}
                  contactPhone={proposal.contactPhone}
                />
              ) : (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                    <svg
                      className="h-6 w-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Sözleşme İmzalandı
                  </h3>
                  <p className="mt-2 text-sm text-white/40">
                    İmzalı sözleşme e-posta adresinize gönderilmiştir. Projeniz
                    en kısa sürede başlatılacaktır.
                  </p>
                </div>
              )}
            </div>
          ) : rejected ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-400">
                Teklif Reddedildi
              </h3>
              <p className="mt-2 text-sm text-white/40">
                Fikrinizi değiştirirseniz bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          ) : canAccept ? (
            <div className="space-y-3">
              {/* Red onay dialog'u */}
              {showRejectConfirm && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm text-red-300 mb-3">
                    Teklifi reddetmek istediğinizden emin misiniz?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={loading}
                      className="flex-1 rounded-lg bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {loading ? "İşleniyor..." : "Evet, Reddet"}
                    </button>
                    <button
                      onClick={() => setShowRejectConfirm(false)}
                      className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/5"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}

              {/* Kabul butonu */}
              <button
                onClick={handleAccept}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-8 py-5 text-lg font-semibold text-white shadow-2xl shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "İşleniyor..." : "Teklifi Kabul Ediyorum"}
              </button>

              {/* Red butonu */}
              {!showRejectConfirm && (
                <button
                  onClick={() => setShowRejectConfirm(true)}
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white/30 transition-colors hover:border-red-500/20 hover:text-red-400/60"
                >
                  Teklifi Reddet
                </button>
              )}
            </div>
          ) : isExpired ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <h3 className="text-lg font-semibold text-red-400">
                Teklifin süresi dolmuştur
              </h3>
              <p className="mt-2 text-sm text-white/40">
                Güncel teklif için bizimle iletişime geçin.
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* ═══ 12. İLETİŞİM ═══ */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={sectionIndex++}
          variants={fadeUp}
          className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 text-center"
        >
          <p className="text-xs text-white/25 mb-3">Sorularınız mı var?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/905431883425"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/10"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:info@vortestudio.com"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/10"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              E-posta
            </a>
          </div>
          <div className="mt-4 text-[10px] text-white/15">
            Vorte Studio · vortestudio.com
          </div>
        </motion.div>
      </main>
    </div>
  );
}
