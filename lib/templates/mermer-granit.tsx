'use client'

import { Cormorant_Garamond, Raleway } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
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

export default function MermerGranitTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${cormorant.variable} ${raleway.variable} min-h-screen bg-[#F8F5F2] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Marble Veins + Gold Luxury ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#0A0A0A] pb-20 pt-16 text-white">
        {/* Marble vein SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="marble-veins" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
                <path d="M0 150 Q75 120 150 180 T300 130" stroke="#D4AF37" strokeWidth="1" fill="none" />
                <path d="M0 80 Q100 50 200 100 T300 60" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
                <path d="M0 220 Q80 250 160 200 T300 240" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
                <path d="M50 0 Q80 100 40 200 T60 300" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
                <path d="M200 0 Q220 80 180 160 T210 300" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#marble-veins)" />
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
              {/* Gold premium badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2">
                <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                <span className="font-[family-name:var(--font-raleway)] text-xs font-600 uppercase tracking-[0.3em] text-[#D4AF37]">
                  Premium Doğal Taş
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-5xl font-700 leading-tight sm:text-6xl lg:text-7xl">
                Doğanın
                <br />
                Güzelliğini
                <br />
                <span className="text-[#D4AF37]">Evinize Taşıyın</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-raleway)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — mermer, granit ve doğal taş
                işçiliğinde {props.city} bölgesinin güvenilir adresi. Mutfak tezgahı, zemin, merdiven.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-transparent hover:text-[#D4AF37]"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#D4AF37]/20 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-raleway)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with gold ornamental frame */}
            <motion.div variants={scaleIn} className="relative">
              {/* Gold corner accents */}
              <div className="absolute -left-3 -top-3 z-10 h-16 w-16 border-l-2 border-t-2 border-[#D4AF37]" />
              <div className="absolute -bottom-3 -right-3 z-10 h-16 w-16 border-b-2 border-r-2 border-[#D4AF37]" />

              <div className="overflow-hidden bg-[#1A1A1A]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} mermer`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#D4AF37]/5">
                      <div className="text-center">
                        <div className="text-6xl">🏛️</div>
                        <p className="mt-3 font-[family-name:var(--font-raleway)] text-sm text-white/30">Taş İşçiliği</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stone type badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['Mermer', 'Granit', 'Travertin', 'Oniks'].map((stone, i) => (
                  <span key={i} className="border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 font-[family-name:var(--font-raleway)] text-xs font-500 uppercase tracking-wider text-[#D4AF37]">
                    {stone}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F8F5F2] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#0A0A0A] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-raleway)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#0A0A0A] sm:text-4xl">
            Mutfak Tezgahı Yaptırmak İsteyenler
            <br />
            <span className="text-[#D4AF37]">Taş Çeşitlerini ve Fiyatları Araştırıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-raleway)] text-lg text-[#1C1917]/60">
            Mermer veya granit işi yaptırmak isteyenlerin <strong className="text-[#0A0A0A]">%72&apos;si</strong> önce
            taş çeşitlerini, fiyatları ve referans projeleri online araştırıyor. Web siteniz yoksa sizi bulamıyorlar.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#D4AF37]/30">
              <img src={galleryImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏛️', stat: '%72', text: 'Online araştırıyor' },
              { emoji: '📐', stat: '50+', text: 'Taş çeşidi' },
              { emoji: '⭐', stat: '25 Yıl', text: 'Dayanıklılık ömrü' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#D4AF37]/20 bg-white p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-700 text-[#D4AF37]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-raleway)] text-sm text-[#1C1917]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-white py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#D4AF37]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Mermerciler
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-[#D4AF37]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-[#1C1917]/70">
                {['Taş çeşitlerini online sergiliyor', 'Mutfak tezgahı referansları görünür', 'Fiyat teklifi formu ile müşteri yakalıyor', 'Google\'da "mermerciler" aramasında çıkıyor', 'Profesyonel ve güvenilir imaj yaratıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#D4AF37]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-[#1C1917]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-[#1C1917]/30">
                {['Taş çeşitlerini gösteremiyor', 'Referans proje paylaşamıyor', 'Sadece tanıdık tavsiyesiyle iş buluyor', 'Rakiplerine müşteri kaybediyor', 'Fiyat karşılaştırmasına dahil olamıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#0A0A0A] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏛️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Premium Taş İşçiliği <span className="text-[#D4AF37]">Tek Tıkla</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-raleway)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve fiyat teklifi alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-10 py-5 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-transparent hover:text-[#D4AF37]">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#D4AF37]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏛️', title: 'Ücretsiz Keşif', desc: 'Yerinde ölçü alım ve taş örnekleri ile danışmanlık.' },
            { icon: '⭐', title: '25 Yıl Dayanıklılık', desc: 'Doğal taş uygulamalarında uzun ömür garantisi.' },
            { icon: '📐', title: 'Hassas İşçilik', desc: 'CNC kesim ile milimetrik hassasiyette üretim.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#D4AF37]/15 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#D4AF37]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-raleway)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1C1917]/10 bg-[#F8F5F2] py-8 text-center font-[family-name:var(--font-raleway)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
