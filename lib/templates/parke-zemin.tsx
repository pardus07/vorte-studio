'use client'

import { Lora, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const lora = Lora({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
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

export default function ParkeZeminTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${lora.variable} ${sourceSans.variable} min-h-screen bg-[#FBF8F4] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Wood Grain Pattern + Warm Tones ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#92400E] pb-20 pt-16 text-white">
        {/* Wood grain SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wood-grain" x="0" y="0" width="200" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q50 5 100 12 T200 8" stroke="#FDE68A" strokeWidth="0.8" fill="none" />
                <path d="M0 20 Q50 16 100 22 T200 18" stroke="#FDE68A" strokeWidth="0.6" fill="none" />
                <path d="M0 30 Q50 26 100 32 T200 28" stroke="#FDE68A" strokeWidth="0.8" fill="none" />
                <path d="M0 38 Q50 34 100 40 T200 36" stroke="#FDE68A" strokeWidth="0.4" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wood-grain)" />
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
              {/* Wood badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-[#FDE68A]/20 px-5 py-2">
                <span className="text-lg">🪵</span>
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-wider text-[#FDE68A]">
                  Doğal Ahşap
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-5xl font-700 leading-tight sm:text-6xl lg:text-7xl">
                Her Adımda
                <br />
                <span className="text-[#FDE68A]">Kalite</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — parke, laminat ve zemin kaplama
                uzmanı. {props.city} genelinde profesyonel döşeme ve ısıtmalı zemin çözümleri.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-wider text-[#92400E] shadow-lg transition-all hover:bg-[#FEF08A] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-lg bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#FDE68A]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with wood plank frame */}
            <motion.div variants={scaleIn} className="relative">
              {/* Wood plank strip decoration */}
              <div className="absolute -left-4 top-0 bottom-0 z-10 w-3 rounded-full" style={{ background: 'linear-gradient(180deg, #D97706, #92400E, #78350F)' }} />

              <div className="overflow-hidden rounded-2xl bg-[#78350F]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} parke`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FDE68A]/10">
                      <div className="text-center">
                        <div className="text-6xl">🪵</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-white/30">Zemin Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floor type strip */}
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {[
                  { color: '#D97706', label: 'Meşe' },
                  { color: '#92400E', label: 'Ceviz' },
                  { color: '#78350F', label: 'Bambu' },
                  { color: '#451A03', label: 'Laminat' },
                ].map((floor, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: floor.color }} />
                    <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 text-white/70">{floor.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FEF3C7] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#92400E] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-source-sans)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-lora)] text-3xl font-700 text-[#92400E] sm:text-4xl">
            Zemin Kaplama Yaptırmak İsteyenler
            <br />
            <span className="text-[#B45309]">Parke Çeşitlerini ve Fiyatları Araştırıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-[#92400E]/70">
            Parke döşeme yaptırmak isteyenlerin <strong className="text-[#92400E]">%68&apos;i</strong> malzeme
            çeşitlerini ve m² fiyatlarını online karşılaştırıyor. Web siteniz yoksa listede yokturuz.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border-2 border-[#92400E]/20">
              <img src={galleryImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🪵', stat: '%68', text: 'Online karşılaştırıyor' },
              { emoji: '📐', stat: '20+', text: 'Parke çeşidi' },
              { emoji: '🔥', stat: '%40', text: 'Isıtmalı zemin tercih' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-lora)] text-2xl font-700 text-[#92400E]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-[#92400E]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-lora)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#92400E]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Parke Ustaları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#92400E]/20 bg-[#92400E]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-source-sans)] text-base font-600 uppercase tracking-wider text-[#92400E]">✅ Web Sitesi Olan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/70">
                {['Parke çeşitlerini fotoğraflarla sergiliyor', 'Isıtmalı zemin hizmeti öne çıkıyor', 'Referans projeler güven oluşturuyor', 'Google\'da "parkeci" aramasında çıkıyor', 'm² fiyat bilgisi ile şeffaflık sağlıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#92400E]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-source-sans)] text-base font-600 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/30">
                {['Malzeme çeşitlerini gösteremiyor', 'Referans proje paylaşamıyor', 'Sadece ağızdan ağıza tanıtılıyor', 'Fiyat karşılaştırmasında yer almıyor', 'Profesyonel imaj oluşturamıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#92400E] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🪵</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-lora)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Hayalinizdeki Zemin <span className="text-[#FDE68A]">Bir Tık Uzağınızda</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve numune gösterimi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-10 py-5 font-[family-name:var(--font-source-sans)] text-base font-600 uppercase tracking-wider text-[#92400E] shadow-xl transition-all hover:bg-[#FEF08A] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#92400E]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🪵', title: 'Ücretsiz Numune', desc: 'Evinize numune getirerek yerinde karşılaştırma.' },
            { icon: '🔥', title: 'Isıtmalı Zemin', desc: 'Yerden ısıtma uyumlu parke sistemleri.' },
            { icon: '📐', title: 'Hassas Döşeme', desc: 'Milimetrik kesim ve profesyonel uygulama.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#92400E]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-wider text-[#92400E]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#92400E]/10 bg-[#FBF8F4] py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
