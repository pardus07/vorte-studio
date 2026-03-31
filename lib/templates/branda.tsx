'use client'

import { Oswald, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function BrandaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#F1F5F9] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Industrial Tarp + B2B Strong ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1E3A5F] pb-20 pt-16 text-white">
        {/* Industrial grid SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="industrial-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
                <circle cx="20" cy="20" r="2" fill="#F59E0B" opacity="0.3" />
                <circle cx="0" cy="0" r="1.5" fill="#F59E0B" opacity="0.2" />
                <circle cx="40" cy="0" r="1.5" fill="#F59E0B" opacity="0.2" />
                <circle cx="0" cy="40" r="1.5" fill="#F59E0B" opacity="0.2" />
                <circle cx="40" cy="40" r="1.5" fill="#F59E0B" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#industrial-grid)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* B2B strip */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-[#F59E0B] px-6 py-3 shadow-lg">
              <span className="font-[family-name:var(--font-oswald)] text-lg font-700 uppercase tracking-wider text-[#1E3A5F]">
                Endüstriyel Branda
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#F59E0B]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#F59E0B]">
                  {props.city} &bull; İmalat
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Endüstriyel
                <br />
                Branda
                <br />
                <span className="text-[#F59E0B]">Çözümleri</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — TIR brandası, çadır, örtü ve
                baskılı branda imalatı. Toptan ve kurumsal sipariş. Hızlı teslimat.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#1E3A5F] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#FBBF24] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with industrial border */}
            <motion.div variants={scaleIn} className="relative">
              <div className="overflow-hidden border-2 border-[#F59E0B]/30 bg-[#162D4A]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} branda`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F59E0B]/5">
                      <div className="text-center">
                        <div className="text-6xl">🏭</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-white/30">Branda Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product specs */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: 'TIR Brandası', icon: '🚛' },
                  { label: 'Baskılı Branda', icon: '🖨️' },
                  { label: 'Çadır Örtü', icon: '⛺' },
                  { label: 'Toptan Sipariş', icon: '📦' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#F59E0B]/10 px-3 py-2">
                    <span>{item.icon}</span>
                    <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 text-[#F59E0B]">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F59E0B] py-20 text-[#1E3A5F]">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#1E3A5F] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Branda İhtiyacı Olanlar
            <br />
            <span className="text-[#7C2D12]">Toptan Fiyat ve Teslimat Süresi Soruyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-[#1E3A5F]/70">
            Kurumsal branda alıcılarının <strong className="text-[#1E3A5F]">%58&apos;i</strong> minimum
            sipariş miktarı, fiyat ve teslimat bilgisi için online araştırma yapıyor.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#1E3A5F]/20">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏭', stat: '%58', text: 'Online araştırıyor' },
              { emoji: '📦', stat: '100+', text: 'Minimum sipariş' },
              { emoji: '🚛', stat: '3-5 Gün', text: 'Teslimat süresi' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-[#1E3A5F]/10 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#1E3A5F]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-[#1E3A5F]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#1E3A5F]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Branda Firmaları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#1E3A5F]/20 bg-[#1E3A5F]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1E3A5F]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/70">
                {['Ürün katalog ve fiyat listesi online', 'Minimum sipariş bilgisi net', 'B2B müşterilere güven veriyor', 'Google\'da "branda imalatı" çıkıyor', 'Toptan talepler 7/24 geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#1E3A5F]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/30">
                {['Ürün çeşitlerini gösteremiyor', 'Kurumsal güven oluşturamıyor', 'Toptan müşteri bulamıyor', 'Rekabette geride kalıyor', 'Baskılı branda hizmeti bilinmiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#1E3A5F] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏭</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Endüstriyel Branda <span className="text-[#F59E0B]">Tek Adresten</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz fiyat teklifi alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F59E0B] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-[#1E3A5F] shadow-xl shadow-[#F59E0B]/20 transition-all hover:bg-[#FBBF24] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1E3A5F]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏭', title: 'Fabrika Üretim', desc: 'Kendi tesisimizde yüksek kapasite ile üretim.' },
            { icon: '🚛', title: 'Hızlı Teslimat', desc: '3-5 iş gününde Türkiye geneline kargo.' },
            { icon: '🖨️', title: 'Baskılı Branda', desc: 'Logo ve görsel baskılı özel üretim.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#1E3A5F]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#1E3A5F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1E3A5F]/10 bg-[#F1F5F9] py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
