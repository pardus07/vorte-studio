'use client'

import { Rajdhani, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rajdhani = Rajdhani({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
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

export default function OtoEgzozTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const workshopImg = props.images?.workshop

  return (
    <div className={`${rajdhani.variable} ${sourceSans.variable} min-h-screen bg-[#1C1917] text-[#F5F5F5]`}>
      {/* ═══════════════════ HERO — Chrome Mesh + Performance Gauge ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Chrome mesh pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="mesh" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1.5" fill="#C0C0C0" />
              <line x1="0" y1="15" x2="30" y2="15" stroke="#C0C0C0" strokeWidth="0.3" />
              <line x1="15" y1="0" x2="15" y2="30" stroke="#C0C0C0" strokeWidth="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#mesh)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#DC2626]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#DC2626]">
                  {props.city} &bull; Egzoz Uzmanı
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Egzoz
                <br />
                Sorunlarınız İçin
                <br />
                <span className="text-[#DC2626]">Uzman Adres</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-[#F5F5F5]/50">
                <strong className="text-[#F5F5F5]">{props.firmName}</strong> — tüm marka
                uyumlu egzoz sistemleri, muayene garantisi ve profesyonel montaj.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#DC2626] px-8 py-4 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#B91C1C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#DC2626]/20 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#DC2626]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-[#F5F5F5]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Performance gauge hero */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden bg-[#0F0E0D]" style={{ borderRadius: '8px' }}>
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} egzoz`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">💨</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-[#F5F5F5]/30">Egzoz Sistemi Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Red bottom stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#DC2626]" />
              </div>

              {/* Performance gauge badges */}
              <div className="absolute -left-3 top-8 border border-[#C0C0C0]/20 bg-[#1C1917] px-4 py-2 shadow-lg">
                <div className="font-[family-name:var(--font-rajdhani)] text-xs font-600 uppercase text-[#C0C0C0]">Muayene</div>
                <div className="font-[family-name:var(--font-rajdhani)] text-lg font-700 text-[#DC2626]">Garantili</div>
              </div>
              <div className="absolute -right-3 bottom-12 border border-[#C0C0C0]/20 bg-[#1C1917] px-4 py-2 shadow-lg">
                <div className="font-[family-name:var(--font-rajdhani)] text-xs font-600 uppercase text-[#C0C0C0]">Marka</div>
                <div className="font-[family-name:var(--font-rajdhani)] text-lg font-700 text-[#DC2626]">Uyumlu</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#DC2626] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Egzoz Sorunu Olan Araç Sahipleri
            <br />
            <span className="text-[#1C1917]">Hemen Online Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-white/70">
            Muayeneden kalan araç sahiplerinin <strong className="text-white">%78&apos;i</strong> acil
            egzoz tamiri arıyor. Web siteniz yoksa sizi bulamıyorlar.
          </motion.p>

          {workshopImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={workshopImg} alt={`${props.firmName} atölye`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '💨', stat: '%78', text: 'Acil egzoz tamiri arıyor' },
              { emoji: '📋', stat: '%65', text: 'Muayene uyumluluğu soruyor' },
              { emoji: '🔧', stat: '%71', text: 'Fiyat karşılaştırması yapıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-rajdhani)] text-2xl font-700 text-[#1C1917]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#0F0E0D] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#DC2626]">Olan</span> vs <span className="text-[#F5F5F5]/30">Olmayan</span> Egzozcu
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#DC2626]/20 bg-[#DC2626]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#DC2626]">✅ Web Sitesi Olan Egzozcu</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#F5F5F5]/70">
                {['Marka uyumlu egzoz listesi online', 'Google\'da "egzozcu" aramasında üst sırada', 'Muayene garantisi güven veriyor', 'Online fiyat teklifi alınıyor', 'Acil servis talepleri artıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#DC2626]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F5F5F5]/5 bg-[#F5F5F5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#F5F5F5]/30">❌ Web Sitesi Olmayan Egzozcu</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#F5F5F5]/30">
                {['Hizmet kapsamı bilinmiyor', 'Muayene garantisi belirsiz', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden müşteri', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">💨</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            İşletmenizi <span className="text-[#DC2626]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-[#F5F5F5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#DC2626] px-10 py-5 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#B91C1C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#DC2626]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '💨', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📋', title: 'Muayene Garantisi', desc: 'Tüm işlemler muayene uyumlu ve garantili.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#DC2626]/10 bg-[#0F0E0D] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase text-[#DC2626]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#F5F5F5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#DC2626]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#F5F5F5]/20">
        <p>Bu sayfa <strong className="text-[#F5F5F5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
