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

export default function KaynakDemirTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const projectsImg = props.images?.projects

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#0A0A0A] text-white`}>
      {/* ═══════════════════ HERO — Sparks + Molten Metal SVG ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Spark/weld SVG pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="weld-sparks" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Spark lines radiating from center */}
                <line x1="60" y1="60" x2="80" y2="30" stroke="#F97316" strokeWidth="1" />
                <line x1="60" y1="60" x2="90" y2="55" stroke="#F97316" strokeWidth="0.8" />
                <line x1="60" y1="60" x2="85" y2="75" stroke="#F97316" strokeWidth="1" />
                <line x1="60" y1="60" x2="40" y2="35" stroke="#F97316" strokeWidth="0.8" />
                <line x1="60" y1="60" x2="35" y2="65" stroke="#F97316" strokeWidth="1" />
                <line x1="60" y1="60" x2="45" y2="85" stroke="#F97316" strokeWidth="0.8" />
                {/* Spark dots at tips */}
                <circle cx="80" cy="30" r="2" fill="#F97316" />
                <circle cx="90" cy="55" r="1.5" fill="#F97316" />
                <circle cx="85" cy="75" r="2" fill="#F97316" />
                <circle cx="40" cy="35" r="1.5" fill="#F97316" />
                <circle cx="35" cy="65" r="2" fill="#F97316" />
                <circle cx="45" cy="85" r="1.5" fill="#F97316" />
                {/* Center weld point */}
                <circle cx="60" cy="60" r="4" fill="#F97316" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#weld-sparks)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Fire strip */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-[#F97316] px-6 py-3 shadow-lg shadow-[#F97316]/20">
              <span className="text-xl">🔥</span>
              <span className="font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-white">
                Demir & Kaynak Atölyesi
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
                <div className="h-1 w-10 bg-[#F97316]" />
                <span className="font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-[0.3em] text-[#F97316]">
                  {props.city} &bull; Kaynak & Demir
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-8xl">
                Demir
                <br />
                İşleme ve
                <br />
                <span className="text-[#F97316]">Kaynak</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-barlow)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — demir kapı, korkuluk, çelik
                konstrüksiyon ve ferforje işleri. Profesyonel kaynak ve montaj hizmeti.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-barlow-condensed)] text-base font-700 uppercase tracking-wider text-white shadow-lg shadow-[#F97316]/20 transition-all hover:bg-[#EA580C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F97316]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-barlow)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Image with metallic frame */}
            <motion.div variants={scaleIn} className="relative">
              {/* Molten glow behind image */}
              <div className="absolute -inset-2 rounded-lg opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, #F97316, transparent 70%)' }} />

              <div className="relative overflow-hidden border-2 border-[#F97316]/30 bg-[#1A1A1A]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} kaynak`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F97316]/5">
                      <div className="text-center">
                        <div className="text-6xl">🔥</div>
                        <p className="mt-3 font-[family-name:var(--font-barlow)] text-sm text-white/30">Atölye Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service types */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['Demir Kapı', 'Korkuluk', 'Çelik Çatı', 'Ferforje'].map((svc, i) => (
                  <span key={i} className="bg-[#F97316]/10 px-3 py-1 font-[family-name:var(--font-barlow-condensed)] text-xs font-600 uppercase text-[#F97316]">
                    🔥 {svc}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F97316] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#0A0A0A] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-barlow-condensed)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl">
            Demir Kapı ve Korkuluk Arayanlar
            <br />
            <span className="text-[#0A0A0A]">Referans ve Fiyat Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-lg text-white/80">
            Demir doğrama yaptırmak isteyenlerin <strong className="text-white">%69&apos;u</strong> önce
            referans projeleri ve fiyatları online araştırıyor. Web siteniz yoksa güvenemiyorlar.
          </motion.p>

          {projectsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#0A0A0A]/20">
              <img src={projectsImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🔥', stat: '%69', text: 'Online araştırıyor' },
              { emoji: '🏗️', stat: '50+', text: 'Proje deneyimi' },
              { emoji: '⚡', stat: '3-7 Gün', text: 'İmalat süresi' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-barlow-condensed)] text-2xl font-700">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-barlow)] text-sm text-white/70">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#171717] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#F97316]">Olan</span> vs <span className="text-white/30">Olmayan</span> Demir Atölyeleri
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F97316]/20 bg-[#F97316]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-600 uppercase text-[#F97316]">✅ Web Sitesi Olan Atölye</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/70">
                {['Proje galeriyle güven oluşturuyor', 'Fiyat teklifi formu ile müşteri yakalıyor', 'Demir kapı modellerini sergiliyor', 'Google\'da "demir doğrama" çıkıyor', 'Çelik çatı projeleri öne çıkıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F97316]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-white/10 bg-white/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-600 uppercase text-white/30">❌ Web Sitesi Olmayan Atölye</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/30">
                {['İşçilik kalitesini gösteremiyor', 'Referans proje paylaşamıyor', 'Sadece çevresinden iş alıyor', 'Büyük projelere ulaşamıyor', 'Fiyat karşılaştırmasında yer almıyor'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">🔥</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Demir İşleriniz <span className="text-[#F97316]">Güçlü Ellerde</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve fiyat teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F97316] px-10 py-5 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-white shadow-xl shadow-[#F97316]/20 transition-all hover:bg-[#EA580C] hover:shadow-2xl">
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
            { icon: '🔥', title: 'Sertifikalı Kaynak', desc: 'TSE standartlarında sertifikalı kaynak işçiliği.' },
            { icon: '🏗️', title: 'Proje Galerisi', desc: 'Yüzlerce tamamlanmış demir doğrama projesi.' },
            { icon: '💰', title: 'Net Fiyat', desc: 'İşe başlamadan önce detaylı maliyet analizi.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-white/10 bg-[#171717] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-base font-600 uppercase text-[#F97316]">{item.title}</h3>
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
