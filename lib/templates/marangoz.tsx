'use client'

import { Libre_Baskerville, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin-ext'],
  weight: ['400', '700'],
  variable: '--font-libre',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
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

export default function MarangozTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${libreBaskerville.variable} ${lato.variable} min-h-screen bg-[#FBF8F2] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Wood Workshop + Chisel Mark Pattern ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#78350F] pb-20 pt-16 text-white">
        {/* Chisel mark / wood cut SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="chisel-marks" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <line x1="10" y1="0" x2="10" y2="12" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="5" x2="25" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="40" y1="2" x2="40" y2="14" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                <line x1="55" y1="8" x2="55" y2="18" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="70" y1="3" x2="70" y2="13" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="40" x2="5" y2="52" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="45" x2="20" y2="55" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                <line x1="35" y1="42" x2="35" y2="54" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="50" y1="38" x2="50" y2="50" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                <line x1="65" y1="43" x2="65" y2="53" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chisel-marks)" />
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
              {/* Workshop badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-[#FDE68A]/20 px-5 py-2">
                <span className="text-lg">🪚</span>
                <span className="font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-wider text-[#FDE68A]">
                  Ahşap Atölyesi
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-libre)] text-4xl font-700 leading-tight sm:text-5xl lg:text-6xl">
                Sipariş Üzerine
                <br />
                <span className="text-[#FDE68A]">Ahşap İşler</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — mutfak dolabı, gardırop, kapı ve
                özel mobilya üretimi. {props.city} genelinde el işçiliğiyle üretim.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-8 py-4 font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-wider text-[#78350F] shadow-lg transition-all hover:bg-[#FEF08A] hover:shadow-xl"
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
                  <span className="font-[family-name:var(--font-lato)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with woodworking frame */}
            <motion.div variants={scaleIn} className="relative">
              {/* Saw blade decoration badge */}
              <div className="absolute -left-4 -top-4 z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-dashed border-[#FDE68A]/40 bg-[#78350F]">
                <span className="font-[family-name:var(--font-libre)] text-2xl font-700 text-[#FDE68A]">🪚</span>
              </div>

              <div className="overflow-hidden rounded-2xl border-4 border-[#5C3310] bg-[#5C3310]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} marangoz`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FDE68A]/10">
                      <div className="text-center">
                        <div className="text-6xl">🪵</div>
                        <p className="mt-3 font-[family-name:var(--font-lato)] text-sm text-white/30">Atölye Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Wood product types */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['Mutfak', 'Gardırop', 'Kapı', 'Mobilya'].map((product, i) => (
                  <span key={i} className="rounded-lg bg-[#FDE68A]/10 px-4 py-1.5 font-[family-name:var(--font-lato)] text-xs font-700 uppercase text-[#FDE68A]">
                    {product}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FEF3C7] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#78350F] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-lato)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-libre)] text-3xl font-700 text-[#78350F] sm:text-4xl">
            Özel Ahşap İş Arayanlar
            <br />
            <span className="text-[#B45309]">Portfolyo İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-[#78350F]/70">
            Özel mobilya veya mutfak dolabı yaptırmak isteyenlerin <strong className="text-[#78350F]">%71&apos;i</strong> önce
            marangozun önceki işlerini inceliyor. Siteniz yoksa işi kimin yaptığını bilmiyorlar.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-xl border-2 border-[#78350F]/20">
              <img src={galleryImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🪵', stat: '%71', text: 'Portfolyo inceliyor' },
              { emoji: '📐', stat: 'Özel', text: 'Sipariş üzerine üretim' },
              { emoji: '⭐', stat: '10+', text: 'Yıl tecrübe' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-libre)] text-2xl font-700 text-[#78350F]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-[#78350F]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-libre)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#78350F]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Marangozlar
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#78350F]/20 bg-[#78350F]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-lato)] text-base font-700 uppercase tracking-wider text-[#78350F]">✅ Web Sitesi Olan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1C1917]/70">
                {['Proje galerisiyle güven oluşturuyor', 'Sipariş akışını net gösteriyor', 'Malzeme bilgisiyle şeffaflık sağlıyor', 'Google\'da "marangoz" aramasında çıkıyor', 'Özel tasarım taleplerini alıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#78350F]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-lato)] text-base font-700 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1C1917]/30">
                {['İşçilik kalitesini gösteremiyor', 'Önceki projeleri paylaşamıyor', 'Sadece çevresinden iş buluyor', 'Özel sipariş taleplerini kaçırıyor', 'Fiyat ve süre bilgisi eksik kalıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#78350F] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🪚</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-libre)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Hayalinizdeki Mobilya <span className="text-[#FDE68A]">Sipariş Verin</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve ölçü alma.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-lg bg-[#FDE68A] px-10 py-5 font-[family-name:var(--font-lato)] text-base font-700 uppercase tracking-wider text-[#78350F] shadow-xl transition-all hover:bg-[#FEF08A] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#78350F]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🪚', title: 'Ücretsiz Keşif', desc: 'Yerinde ölçü alım ve tasarım danışmanlığı.' },
            { icon: '🪵', title: 'Doğal Malzeme', desc: 'Birinci sınıf ahşap malzeme ile üretim.' },
            { icon: '📐', title: 'Özel Tasarım', desc: 'İsteğe göre ölçü ve modelde sipariş üretim.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-[#78350F]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-wider text-[#78350F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#78350F]/10 bg-[#FBF8F2] py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
