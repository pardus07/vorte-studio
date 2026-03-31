'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
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

export default function ElektrikciTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#1C1917] text-white`}>
      {/* ═══════════════════ HERO — Lightning Bolt SVG + Circuit Pattern ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Circuit board pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <line x1="0" y1="50" x2="30" y2="50" stroke="#FCD34D" strokeWidth="1" />
                <line x1="30" y1="50" x2="30" y2="20" stroke="#FCD34D" strokeWidth="1" />
                <line x1="30" y1="20" x2="70" y2="20" stroke="#FCD34D" strokeWidth="1" />
                <line x1="70" y1="20" x2="70" y2="80" stroke="#FCD34D" strokeWidth="1" />
                <line x1="70" y1="80" x2="100" y2="80" stroke="#FCD34D" strokeWidth="1" />
                <circle cx="30" cy="50" r="3" fill="#FCD34D" />
                <circle cx="70" cy="20" r="3" fill="#FCD34D" />
                <circle cx="70" cy="80" r="3" fill="#FCD34D" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 7/24 Emergency strip */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-[#DC2626] px-6 py-3 shadow-lg shadow-[#DC2626]/20">
              <span className="animate-pulse text-xl">⚡</span>
              <span className="font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider">
                7/24 Acil Elektrik Servisi
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
                <div className="h-1 w-10 bg-[#FCD34D]" />
                <span className="font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-[0.3em] text-[#FCD34D]">
                  {props.city} &bull; Elektrikçi
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-8xl">
                Elektrik
                <br />
                Sorununuz
                <br />
                <span className="text-[#FCD34D]">Çözülsün</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-barlow)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — 7/24 acil elektrik arıza,
                tesisat yenileme, sigorta pano ve aydınlatma. Hızlı, güvenli, sertifikalı.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#FCD34D] px-8 py-4 font-[family-name:var(--font-barlow-condensed)] text-base font-700 uppercase tracking-wider text-[#1C1917] shadow-lg shadow-[#FCD34D]/20 transition-all hover:bg-[#FBBF24] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#FCD34D]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-barlow)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with lightning bolt frame */}
            <motion.div variants={scaleIn} className="relative">
              {/* Lightning bolt SVG decoration */}
              <div className="absolute -left-8 top-1/2 z-10 -translate-y-1/2">
                <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 0L0 45h16L8 80l32-50H24z" fill="#FCD34D" />
                </svg>
              </div>

              <div className="overflow-hidden border-2 border-[#FCD34D]/30 bg-[#292524]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} elektrik`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FCD34D]/5">
                      <div className="text-center">
                        <div className="text-6xl">⚡</div>
                        <p className="mt-3 font-[family-name:var(--font-barlow)] text-sm text-white/30">Servis Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['Arıza', 'Pano', 'Aydınlatma', 'Tesisat'].map((svc, i) => (
                  <span key={i} className="bg-[#FCD34D]/10 px-3 py-1 font-[family-name:var(--font-barlow-condensed)] text-xs font-600 uppercase text-[#FCD34D]">
                    ⚡ {svc}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FCD34D] py-20 text-[#1C1917]">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#1C1917] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-barlow-condensed)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl">
            Elektrik Arızasında İnsanlar
            <br />
            <span className="text-[#DC2626]">Acil Usta Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-lg text-[#1C1917]/70">
            Elektrik sorununda insanların <strong className="text-[#1C1917]">%87&apos;si</strong> acil
            çözüm arıyor. Web siteniz yoksa telefon defterinden bulduklarına gidiyorlar.
          </motion.p>

          {serviceImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#1C1917]/20">
              <img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '⚡', stat: '%87', text: 'Acil usta arıyor' },
              { emoji: '📱', stat: '%74', text: 'Telefondan arıyor' },
              { emoji: '🛡️', stat: '%65', text: 'Sertifika kontrolü yapıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-[#1C1917]/10 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-barlow-condensed)] text-2xl font-700 text-[#DC2626]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-barlow)] text-sm text-[#1C1917]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#292524] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#FCD34D]">Olan</span> vs <span className="text-white/30">Olmayan</span> Elektrikçi
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#FCD34D]/20 bg-[#FCD34D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-600 uppercase text-[#FCD34D]">✅ Web Sitesi Olan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/70">
                {['7/24 acil servis bilgisi erişilebilir', 'Hizmet bölgesi haritası mevcut', 'Güvenlik sertifikaları görünür', 'Google\'da "acil elektrikçi" çıkıyor', 'Teklif talebi gece bile geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#FCD34D]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-600 uppercase text-white/30">❌ Web Sitesi Olmayan Usta</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/30">
                {['Acil aramalarda bulunamıyor', 'Sertifika bilgisi doğrulanamıyor', 'Hizmet bölgesi bilinmiyor', 'Sadece telefon defterinden iş buluyor', 'Güven oluşturamıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">⚡</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Elektrik Sorunlarınız <span className="text-[#FCD34D]">Çözülsün</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve arıza tespiti.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#FCD34D] px-10 py-5 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-[#1C1917] shadow-xl shadow-[#FCD34D]/20 transition-all hover:bg-[#FBBF24] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-white/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '⚡', title: '7/24 Acil Servis', desc: 'Gece gündüz elektrik arızanıza anında müdahale.' },
            { icon: '🛡️', title: 'Sertifikalı Usta', desc: 'Tüm ustalarımız elektrik güvenlik sertifikalı.' },
            { icon: '💰', title: 'Şeffaf Fiyat', desc: 'İşe başlamadan önce net fiyat bilgisi.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-white/10 bg-[#292524] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-base font-600 uppercase text-[#FCD34D]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-white/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center font-[family-name:var(--font-barlow)] text-sm text-white/30">
        <p>Bu sayfa <strong className="text-white/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
