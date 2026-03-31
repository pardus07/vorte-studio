'use client'

import { Oswald, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
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

export default function CadirTenteTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const projectsImg = props.images?.projects

  return (
    <div className={`${oswald.variable} ${openSans.variable} min-h-screen bg-[#F8FAF8] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Outdoor Canopy + Green Forest Theme ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#166534] pb-20 pt-16 text-white">
        {/* Canopy wave SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="canopy-wave" x="0" y="0" width="200" height="80" patternUnits="userSpaceOnUse">
                <path d="M0 40 Q50 10 100 40 T200 40" stroke="#FDE68A" strokeWidth="1.5" fill="none" />
                <path d="M0 60 Q50 30 100 60 T200 60" stroke="#FDE68A" strokeWidth="1" fill="none" />
                <path d="M0 20 Q50 -10 100 20 T200 20" stroke="#FDE68A" strokeWidth="0.7" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#canopy-wave)" />
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
              {/* Sun protection badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-[#FDE68A]/20 px-5 py-2">
                <span className="text-lg">☀️</span>
                <span className="font-[family-name:var(--font-open-sans)] text-sm font-600 uppercase tracking-wider text-[#FDE68A]">
                  Güneş & Yağmur Koruması
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Güneşin
                <br />
                Altında Bile
                <br />
                <span className="text-[#FDE68A]">Serin Kalın</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-open-sans)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — çadır, tente, pergola ve branda
                imalatı. {props.city} genelinde özel ölçü üretim ve montaj.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#166534] shadow-lg transition-all hover:bg-[#FEF08A] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#FDE68A]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-open-sans)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with canopy-like top border */}
            <motion.div variants={scaleIn} className="relative">
              {/* Canopy top decoration */}
              <div className="relative overflow-hidden">
                <div className="absolute left-0 right-0 top-0 z-10 h-4" style={{
                  background: 'repeating-linear-gradient(90deg, #166534 0px, #166534 20px, #15803d 20px, #15803d 40px)',
                }} />
                <div className="overflow-hidden rounded-b-2xl bg-[#14532D]">
                  <div className="aspect-[4/3]">
                    {heroImg ? (
                      <img src={heroImg} alt={`${props.firmName} tente`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#FDE68A]/10">
                        <div className="text-center">
                          <div className="text-6xl">⛺</div>
                          <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-white/30">Tente Görseli</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product types */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['Tente', 'Pergola', 'Çadır', 'Körüklü'].map((product, i) => (
                  <span key={i} className="bg-[#FDE68A]/10 px-4 py-1.5 font-[family-name:var(--font-oswald)] text-xs font-600 uppercase tracking-wider text-[#FDE68A]">
                    ☀️ {product}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#DCFCE7] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#166534] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-[#166534] sm:text-4xl">
            Tente Yaptırmak İsteyenler
            <br />
            <span className="text-[#15803D]">Ölçü ve Fiyat Teklifi İçin Dolaşıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-[#166534]/70">
            Tente veya çadır yaptırmak isteyenlerin <strong className="text-[#166534]">%63&apos;ü</strong> ölçü,
            malzeme ve fiyat bilgisi için online araştırma yapıyor. Web siteniz yoksa aramadan düşüyorsunuz.
          </motion.p>

          {projectsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border-2 border-[#166534]/20">
              <img src={projectsImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '☀️', stat: '%63', text: 'Online araştırıyor' },
              { emoji: '📐', stat: 'Özel', text: 'Ölçüye göre üretim' },
              { emoji: '🌧️', stat: '%100', text: 'Yağmur koruması' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#166534]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-[#166534]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#166534]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Tente Firmaları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#166534]/20 bg-[#166534]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#166534]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#1C1917]/70">
                {['Ürün çeşitlerini fotoğraflarla gösteriyor', 'Online ölçü talebi alıyor', 'Referans projeleriyle güven veriyor', 'Google\'da "tente" aramasında çıkıyor', 'Fiyat karşılaştırmasında yer alıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#166534]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#1C1917]/30">
                {['Ürün portföyünü gösteremiyor', 'Ölçü talebi sadece telefonla alıyor', 'Referans paylaşamıyor', 'Yerel aramalarda görünmüyor', 'Potansiyel müşteri kaçırıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#166534] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">⛺</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Dış Mekanınızı <span className="text-[#FDE68A]">Koruma Altına Alın</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve ölçü alma.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#FDE68A] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-[#166534] shadow-xl transition-all hover:bg-[#FEF08A] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#166534]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '📐', title: 'Ücretsiz Ölçü', desc: 'Yerinde ölçü alımı ve ücretsiz proje çizimi.' },
            { icon: '☀️', title: 'UV Korumalı', desc: 'Güneş ve yağmura dayanıklı premium kumaşlar.' },
            { icon: '🔧', title: 'Profesyonel Montaj', desc: 'Uzman ekiple hızlı ve güvenli kurulum.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#166534]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#166534]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#166534]/10 bg-[#F8FAF8] py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
