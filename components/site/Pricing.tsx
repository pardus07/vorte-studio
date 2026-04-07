"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

type Feature = { text: string; included: boolean };
type Section = { title: string; items: Feature[] };

interface Package {
  name: string;
  desc: string;
  /** Sayısal fiyat (Kurumsal için null) */
  price: string | null;
  /** Kurumsal gibi fiyatı gizlenen paketler için metin */
  priceLabel?: string;
  /** Fiyat altı ek açıklama (Kurumsal için "Ücretsiz keşif görüşmesi...") */
  priceSubLabel?: string;
  popular: boolean;
  sections: Section[];
  hostingNote: string;
}

const packages: Package[] = [
  {
    name: "Starter",
    desc: "Yeni kurulan işletmeler için dijital vitrin",
    price: "9.990",
    popular: false,
    sections: [
      {
        title: "Tasarım & Geliştirme",
        items: [
          { text: "5 sayfaya kadar özel tasarım", included: true },
          { text: "Next.js ile sıfırdan kodlama — şablon değil", included: true },
          { text: "Mobil öncelikli responsive tasarım", included: true },
          { text: "Otomatik görsel optimizasyonu", included: true },
        ],
      },
      {
        title: "SEO & Performans",
        items: [
          { text: "Temel SEO altyapısı (meta, Open Graph, sitemap)", included: true },
          { text: "Google Analytics entegrasyonu", included: true },
          { text: "Lighthouse 90+ performans skoru", included: true },
          { text: "1 saniye altı sayfa yüklenme hızı", included: true },
        ],
      },
      {
        title: "Özellikler",
        items: [
          { text: "İletişim formu (e-posta bildirimi)", included: true },
          { text: "WhatsApp iletişim butonu", included: true },
          { text: "Google Harita entegrasyonu", included: true },
          { text: "SSL sertifikası", included: true },
          { text: "Admin paneli", included: false },
          { text: "Blog sistemi", included: false },
          { text: "Veritabanı", included: false },
        ],
      },
      {
        title: "Teslim & Sahiplik",
        items: [
          { text: "Kaynak kodlar tamamen size ait", included: true },
          { text: "1 yıl hosting + domain + SSL dahil", included: true },
          { text: "2–3 hafta teslim süresi", included: true },
        ],
      },
    ],
    hostingNote:
      "2. yıldan itibaren yıllık yenileme: 2.490 ₺ (hosting, domain, SSL ve teknik bakım dahil)",
  },
  {
    name: "Profesyonel",
    desc: "Büyüyen firmalar için yönetim panelli kurumsal site",
    price: "24.990",
    popular: true,
    sections: [
      {
        title: "Tasarım & Geliştirme",
        items: [
          { text: "15+ sayfa özel tasarım", included: true },
          { text: "Next.js + Prisma + PostgreSQL tam yığın", included: true },
          { text: "Mobil öncelikli responsive tasarım", included: true },
          { text: "Otomatik görsel optimizasyonu", included: true },
        ],
      },
      {
        title: "SEO & Performans",
        items: [
          { text: "Gelişmiş SEO (structured data, JSON-LD, canonical)", included: true },
          { text: "Google Analytics + Search Console", included: true },
          { text: "Lighthouse 95+ performans skoru", included: true },
          { text: "1 saniye altı sayfa yüklenme hızı", included: true },
        ],
      },
      {
        title: "Özellikler",
        items: [
          { text: "Admin paneli (içerik, sayfa, görsel yönetimi)", included: true },
          { text: "Blog sistemi (kategorili, SEO uyumlu)", included: true },
          { text: "İletişim + teklif formu", included: true },
          { text: "WhatsApp entegrasyonu", included: true },
          { text: "Çoklu dil desteği (TR + EN)", included: true },
          { text: "Google Harita", included: true },
          { text: "SSL sertifikası", included: true },
        ],
      },
      {
        title: "Teslim & Sahiplik",
        items: [
          { text: "Kaynak kodlar tamamen size ait", included: true },
          { text: "1 yıl hosting + domain + bakım dahil", included: true },
          { text: "3–4 hafta teslim süresi", included: true },
        ],
      },
    ],
    hostingNote:
      "2. yıldan itibaren yıllık yenileme: 4.490 ₺ (hosting, domain, SSL, veritabanı bakımı ve güvenlik güncellemeleri dahil)",
  },
  {
    name: "E-Ticaret",
    desc: "Online satış yapan işletmeler için tam donanımlı altyapı",
    price: "59.990",
    popular: false,
    sections: [
      {
        title: "Tasarım & Geliştirme",
        items: [
          { text: "Özel tasarım e-ticaret arayüzü", included: true },
          { text: "Next.js + Prisma + PostgreSQL tam yığın", included: true },
          { text: "Mobil öncelikli responsive tasarım", included: true },
          { text: "Otomatik görsel optimizasyonu", included: true },
        ],
      },
      {
        title: "SEO & Performans",
        items: [
          { text: "Premium SEO (ürün schema, JSON-LD, sitemap)", included: true },
          { text: "Google Analytics + e-ticaret izleme", included: true },
          { text: "Lighthouse 90+ performans skoru", included: true },
          { text: "Hızlı sayfa yüklenme (SSR + ISR)", included: true },
        ],
      },
      {
        title: "E-Ticaret Özellikleri",
        items: [
          { text: "Sınırsız ürün kapasitesi", included: true },
          { text: "İyzico ödeme (kredi kartı + taksit)", included: true },
          { text: "Stok yönetimi + sipariş takibi", included: true },
          { text: "Kargo entegrasyonu", included: true },
          { text: "Ürün arama, filtreleme, kategoriler", included: true },
          { text: "Kupon ve kampanya sistemi", included: true },
        ],
      },
      {
        title: "Paneller",
        items: [
          { text: "Admin paneli (ürün, sipariş, stok, müşteri)", included: true },
          { text: "Müşteri hesap paneli (sipariş geçmişi, adres)", included: true },
          { text: "WhatsApp sipariş bildirimi", included: true },
          { text: "SSL sertifikası", included: true },
        ],
      },
      {
        title: "Teslim & Sahiplik",
        items: [
          { text: "Kaynak kodlar tamamen size ait", included: true },
          { text: "1 yıl hosting + domain + öncelikli destek", included: true },
          { text: "4–6 hafta teslim süresi", included: true },
        ],
      },
    ],
    hostingNote:
      "2. yıldan itibaren yıllık yenileme: 8.190 ₺ (özel sunucu, domain, SSL, veritabanı bakımı, yedekleme ve güvenlik güncellemeleri dahil)",
  },
  {
    name: "Kurumsal",
    desc: "Büyük ölçekli projeler için özel çözümler",
    price: null,
    priceLabel: "Projenize özel fiyat",
    priceSubLabel: "Ücretsiz keşif görüşmesi ile belirleyelim",
    popular: false,
    sections: [
      {
        title: "Starter + Profesyonel + E-Ticaret'teki her şey dahil, ek olarak",
        items: [
          { text: "Tamamen özel UI/UX tasarım", included: true },
          { text: "API / CRM / ERP entegrasyonu", included: true },
          { text: "Özel modüller (randevu, rezervasyon, bayi paneli)", included: true },
          { text: "AI chatbot entegrasyonu", included: true },
          { text: "Çoklu dil desteği (sınırsız dil)", included: true },
          { text: "Enterprise SEO + Analytics", included: true },
          { text: "Özel hesap yöneticisi", included: true },
          { text: "7/24 öncelikli destek", included: true },
          { text: "Sınırsız revizyon hakkı", included: true },
        ],
      },
      {
        title: "Teslim & Sahiplik",
        items: [
          { text: "Kaynak kodlar tamamen size ait", included: true },
          { text: "1 yıl hosting + domain + premium destek", included: true },
          { text: "Teslim süresi projeye özel", included: true },
        ],
      },
    ],
    hostingNote:
      "Projenizin ihtiyacına göre özel yapılandırma. Fiyat keşif görüşmesinde belirlenir.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Pricing() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  return (
    <section id="fiyatlandirma" className="px-6 py-24 md:px-12 lg:px-20 md:py-32">
      {/* Section header */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
        >
          <span className="h-px w-8 bg-accent" />
          Fiyatlandırma
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-syne)] text-[clamp(32px,4vw,52px)] font-bold leading-tight tracking-[-0.03em]"
        >
          Şeffaf <span className="text-white/25">Fiyatlandırma</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 max-w-lg text-sm leading-relaxed text-muted"
        >
          İşletmenize en uygun paketi seçin. Tüm paketlere özel ihtiyaçlarınıza
          göre ek özellikler eklenebilir.
        </motion.p>
      </div>

      {/* Paket kartları */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {packages.map((pkg) => (
          <motion.article
            key={pkg.name}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            data-cursor
            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-bg2 p-7 transition-colors duration-300 hover:bg-bg3 ${
              pkg.popular
                ? "border-accent/60 ring-1 ring-accent/20"
                : "border-border"
            }`}
          >
            {/* Gradient top border */}
            <div
              className={`absolute inset-x-0 top-0 h-px transition-opacity duration-500 ${
                pkg.popular
                  ? "bg-gradient-to-r from-accent via-accent/80 to-accent/30 opacity-100"
                  : "bg-gradient-to-r from-accent via-accent/50 to-transparent opacity-0 group-hover:opacity-100"
              }`}
            />

            {/* Hover glow */}
            <div
              className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 ${
                pkg.popular
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              style={{ background: "rgba(255,69,0,0.06)" }}
            />

            {/* Popüler badge */}
            {pkg.popular && (
              <div className="mb-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  En Popüler
                </span>
              </div>
            )}

            {/* Paket adı & açıklama */}
            <div className="relative">
              <h3 className="font-[family-name:var(--font-syne)] text-[20px] font-bold tracking-[-0.02em]">
                {pkg.name}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                {pkg.desc}
              </p>
            </div>

            {/* Fiyat */}
            <div className="relative mt-6 border-t border-border/50 pt-6">
              {pkg.price ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-syne)] text-[36px] font-extrabold leading-none tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-[15px] font-semibold text-muted">
                      ₺
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted2">
                    &apos;den başlayan fiyatlarla
                  </p>
                </>
              ) : (
                <>
                  <div className="font-[family-name:var(--font-syne)] text-[22px] font-extrabold leading-tight tracking-tight text-accent">
                    {pkg.priceLabel}
                  </div>
                  {pkg.priceSubLabel && (
                    <p className="mt-1.5 text-[12px] text-muted2">
                      {pkg.priceSubLabel}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Gruplu özellik listesi */}
            <div className="relative mt-6 flex-1 space-y-5">
              {pkg.sections.map((section, sIdx) => (
                <div key={sIdx}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                    {section.title}
                  </p>
                  <ul className="space-y-2" role="list">
                    {section.items.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {f.included ? (
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                          </svg>
                        ) : (
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/15"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            aria-hidden="true"
                          >
                            <path d="M4 8h8" />
                          </svg>
                        )}
                        <span
                          className={`text-[13px] leading-snug ${
                            f.included ? "text-white/80" : "text-white/25"
                          }`}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Hosting yenileme notu */}
            <p className="relative mt-6 rounded-lg border border-border/50 bg-white/[0.02] px-3 py-2.5 text-[10.5px] leading-relaxed text-muted2">
              {pkg.hostingNote}
            </p>

            {/* CTA Butonu */}
            <button
              onClick={() =>
                setSelectedPackage(
                  pkg.price
                    ? `${pkg.name} — ${pkg.price}₺`
                    : `${pkg.name} — Projenize özel fiyat`
                )
              }
              className={`relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-[14px] font-semibold transition-all duration-300 ${
                pkg.popular
                  ? "bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30"
                  : "border border-border bg-white/[0.03] text-white/70 hover:border-accent/30 hover:text-white"
              }`}
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Ücretsiz Teklif Al</span>
              <svg
                className="relative h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M10 4l4 4-4 4" />
              </svg>
            </button>
          </motion.article>
        ))}
      </motion.div>

      {/* Alt bilgi — kısa badge'ler */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[11px] text-muted2"
      >
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Tüm paketlerde SSL dahil
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          KDV hariç fiyatlardır
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Taksit seçenekleri mevcuttur
        </span>
      </motion.div>

      {/* İkinci satır — teknik vurgu */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="mt-3 text-center text-[11px] text-muted2"
      >
        Next.js ile özel kodlama · Kaynak kodlar size ait · WordPress değil,
        gerçek kod
      </motion.p>

      {/* Hosting açıklama bloğu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mx-auto mt-14 max-w-3xl rounded-2xl border border-border/60 bg-bg2/50 p-6 md:p-8"
      >
        <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-accent">
          Hosting nasıl çalışır?
        </h3>
        <div className="space-y-3 text-[13px] leading-relaxed text-muted">
          <p>
            Siteniz Türkiye lokasyonlu yüksek performanslı sunucularda
            barındırılır. Kurulum, teknik yönetim, güvenlik güncellemeleri ve
            yedekleme Vorte Studio tarafından yapılır — siz hiçbir teknik
            detayla uğraşmazsınız.
          </p>
          <p>
            İlk yıl hosting, domain ve SSL ücretsiz olarak dahildir. 2. yıldan
            itibaren yıllık yenileme ücreti uygulanır (paket detaylarında
            belirtilmiştir). İstediğiniz zaman kaynak kodlarınızı alıp başka
            bir sunucuya taşıyabilirsiniz.
          </p>
        </div>
      </motion.div>

      {/* Paket seçildiğinde ContactForm aç */}
      {selectedPackage && (
        <ContactForm
          onClose={() => setSelectedPackage(null)}
          selectedPackage={selectedPackage}
        />
      )}
    </section>
  );
}
