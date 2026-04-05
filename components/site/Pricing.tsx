"use client";

import { motion } from "framer-motion";

const packages = [
  {
    name: "Başlangıç",
    desc: "Yeni kurulan işletmeler için tanıtım sitesi",
    price: "14.990",
    popular: false,
    features: [
      { text: "5 sayfa tanıtım sitesi", included: true },
      { text: "Mobil uyumlu tasarım", included: true },
      { text: "Temel SEO optimizasyonu", included: true },
      { text: "SSL sertifikası", included: true },
      { text: "İletişim formu", included: true },
      { text: "Google Harita entegrasyonu", included: true },
      { text: "WhatsApp butonu", included: true },
      { text: "1 yıl ücretsiz hosting", included: true },
      { text: "Blog sistemi", included: false },
      { text: "Admin paneli", included: false },
      { text: "Çoklu dil desteği", included: false },
    ],
  },
  {
    name: "Profesyonel",
    desc: "Büyüyen firmalar için kurumsal web sitesi",
    price: "29.990",
    popular: true,
    features: [
      { text: "15+ sayfa kurumsal site", included: true },
      { text: "Mobil uyumlu tasarım", included: true },
      { text: "Gelişmiş SEO & Analytics", included: true },
      { text: "SSL sertifikası", included: true },
      { text: "Blog sistemi", included: true },
      { text: "Admin paneli", included: true },
      { text: "Çoklu dil desteği", included: true },
      { text: "Hız optimizasyonu (95+ skor)", included: true },
      { text: "WhatsApp entegrasyonu", included: true },
      { text: "1 yıl hosting + bakım", included: true },
      { text: "Özel API entegrasyonları", included: false },
    ],
  },
  {
    name: "E-Ticaret",
    desc: "Online satış yapan işletmeler için altyapı",
    price: "89.990",
    popular: false,
    features: [
      { text: "Sınırsız ürün kapasitesi", included: true },
      { text: "Mobil uyumlu tasarım", included: true },
      { text: "Premium SEO paketi", included: true },
      { text: "İyzico ödeme entegrasyonu", included: true },
      { text: "Stok & sipariş yönetimi", included: true },
      { text: "Kargo entegrasyonu", included: true },
      { text: "Müşteri paneli", included: true },
      { text: "Admin paneli", included: true },
      { text: "Kupon & kampanya sistemi", included: true },
      { text: "1 yıl hosting + bakım", included: true },
      { text: "7/24 öncelikli destek", included: false },
    ],
  },
  {
    name: "Kurumsal B2B",
    desc: "Büyük ölçekli firmalar için özel çözümler",
    price: "139.990",
    popular: false,
    features: [
      { text: "Tamamen özel tasarım", included: true },
      { text: "Mobil uyumlu tasarım", included: true },
      { text: "Enterprise SEO & Analytics", included: true },
      { text: "Özel API entegrasyonları", included: true },
      { text: "CRM / ERP entegrasyonu", included: true },
      { text: "Özel modüller & dashboard", included: true },
      { text: "AI chatbot entegrasyonu", included: true },
      { text: "Özel hesap yöneticisi", included: true },
      { text: "7/24 öncelikli destek", included: true },
      { text: "1 yıl hosting + bakım", included: true },
      { text: "Sınırsız revizyon hakkı", included: true },
    ],
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
              <div className="flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-syne)] text-[36px] font-extrabold leading-none tracking-tight">
                  {pkg.price}
                </span>
                <span className="text-[15px] font-semibold text-muted">₺</span>
              </div>
              <p className="mt-1 text-[12px] text-muted2">
                &apos;den başlayan fiyatlarla
              </p>
            </div>

            {/* Özellik listesi */}
            <ul className="relative mt-6 flex-1 space-y-3" role="list">
              {pkg.features.map((f, i) => (
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

            {/* CTA Butonu */}
            <a
              href="#contact"
              className={`relative mt-8 flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-[14px] font-semibold transition-all duration-300 ${
                pkg.popular
                  ? "bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30"
                  : "border border-border bg-white/[0.03] text-white/70 hover:border-accent/30 hover:text-white"
              }`}
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Teklif Al</span>
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
            </a>
          </motion.article>
        ))}
      </motion.div>

      {/* Alt bilgi */}
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
    </section>
  );
}
