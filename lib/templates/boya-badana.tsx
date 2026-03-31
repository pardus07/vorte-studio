'use client'

import { Nunito, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
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

const RAINBOW = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6']

export default function BoyaBadanaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${nunito.variable} ${openSans.variable} min-h-screen bg-[#FEF9F0] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Rainbow Paint Drip + Color Wheel ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Rainbow drip lines at top */}
        <div className="absolute left-0 right-0 top-0 flex h-2">
          {RAINBOW.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        {/* Paint splatter decorations */}
        <div className="pointer-events-none absolute right-10 top-20 h-32 w-32 rounded-full opacity-[0.06]" style={{ backgroundColor: RAINBOW[0] }} />
        <div className="pointer-events-none absolute left-20 top-40 h-20 w-20 rounded-full opacity-[0.06]" style={{ backgroundColor: RAINBOW[4] }} />
        <div className="pointer-events-none absolute bottom-20 right-32 h-24 w-24 rounded-full opacity-[0.05]" style={{ backgroundColor: RAINBOW[3] }} />

        <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              {/* Color swatch badges */}
              <motion.div variants={fadeInUp} className="flex gap-2">
                {RAINBOW.map((color, i) => (
                  <div key={i} className="h-8 w-8 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-5xl font-800 leading-tight sm:text-6xl lg:text-7xl">
                Eviniz
                <br />
                Yeniden
                <br />
                <span className="bg-gradient-to-r from-[#EF4444] via-[#EAB308] to-[#3B82F6] bg-clip-text text-transparent">Doğsun</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-open-sans)] text-base leading-relaxed text-[#1C1917]/60">
                <strong className="text-[#1C1917]">{props.firmName}</strong> — profesyonel boya ve badana
                hizmeti. Renk danışmanlığı, ücretsiz keşif, temiz işçilik.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#1C1917] px-8 py-4 font-[family-name:var(--font-nunito)] text-base font-700 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#292524] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
                  <div className="flex gap-0.5 text-[#EAB308]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/50">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with color wheel decoration */}
            <motion.div variants={scaleIn} className="relative">
              {/* Color wheel circle at top-right */}
              <div className="absolute -right-4 -top-4 z-10 h-20 w-20 overflow-hidden rounded-full shadow-lg" style={{
                background: `conic-gradient(${RAINBOW.join(', ')}, ${RAINBOW[0]})`,
              }}>
                <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>

              <div className="overflow-hidden rounded-2xl bg-[#E7E5E4]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} boya`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/50">
                      <div className="text-center">
                        <div className="text-6xl">🎨</div>
                        <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/30">Proje Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rainbow bottom accent */}
              <div className="mt-2 flex overflow-hidden rounded-full">
                {RAINBOW.map((color, i) => (
                  <div key={i} className="h-1.5 flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#1C1917] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-nunito)] font-700 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Ev Boyatmak İsteyenler
            <br />
            <span className="bg-gradient-to-r from-[#EF4444] via-[#EAB308] to-[#3B82F6] bg-clip-text text-transparent">Güvenilir Usta Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-white/70">
            Boya badana yaptırmak isteyenlerin <strong className="text-white">%73&apos;ü</strong> önce
            referans işleri ve fiyat tekliflerini online araştırıyor.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={galleryImg} alt={`${props.firmName} galeri`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🎨', stat: '%73', text: 'Online araştırıyor' },
              { emoji: '📸', stat: '%62', text: 'Önce/sonra görmek istiyor' },
              { emoji: '🏠', stat: '%55', text: 'Renk danışmanlığı arıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-nunito)] text-2xl font-800 text-[#EAB308]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#22C55E]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Boyacı
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#22C55E]/20 bg-[#22C55E]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#22C55E]">✅ Web Sitesi Olan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#1C1917]/70">
                {['Öncesi/sonrası galerisi güven veriyor', 'Renk danışmanlığı bilgisi sunuyor', 'Google\'da "boyacı" aramasında çıkıyor', 'Online teklif talebi alıyor', 'Müşteriler işçilik kalitesini görebiliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#22C55E]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1C1917]/30">❌ Web Sitesi Olmayan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#1C1917]/30">
                {['İşlerini gösteremiyor', 'Güvenilirliğini kanıtlayamıyor', 'Arama sonuçlarında yok', 'Sadece tanıdık referansıyla iş buluyor', 'Renk seçimi konusunda yardım edemiyor'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">🎨</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Evinize <span className="bg-gradient-to-r from-[#EF4444] via-[#EAB308] to-[#3B82F6] bg-clip-text text-transparent">Renk Katın</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-base text-[#1C1917]/60">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve renk danışmanlığı.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#1C1917] px-10 py-5 font-[family-name:var(--font-nunito)] text-lg font-700 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#292524] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1C1917]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🎨', title: 'Ücretsiz Keşif', desc: 'Yerinde renk danışmanlığı ve ölçü alma ücretsiz.' },
            { icon: '⚡', title: 'Temiz İşçilik', desc: 'Mobilyalarınız korunur, sonrası tertemiz teslim.' },
            { icon: '🛡️', title: '2 Yıl Garanti', desc: 'Boya ve badana işçiliğinde 2 yıl garanti.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-nunito)] text-base font-700 text-[#1C1917]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1C1917]/10 py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
