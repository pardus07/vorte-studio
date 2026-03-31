'use client'

import { Abril_Fatface, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const abrilFatface = Abril_Fatface({
  subsets: ['latin-ext'],
  weight: ['400'],
  variable: '--font-abril',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['400', '700'],
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

export default function MuzikKurslariTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const studioImg = props.images?.studio

  return (
    <div className={`${abrilFatface.variable} ${lato.variable} min-h-screen bg-[#1C1917] text-[#FAFAF5]`}>
      {/* ═══════════════════ HERO — Stage Spotlight ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Spotlight glow */}
        <div className="pointer-events-none absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <span className="font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-[0.2em] text-[#F59E0B]">
                  {props.city} &bull; Müzik Eğitimi
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-abril)] text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Müziği <span className="text-[#F59E0B]">Seviyorsanız</span>
                <br />
                Doğru Yere Geldiniz
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-lg leading-relaxed text-[#FAFAF5]/50">
                <strong className="text-[#FAFAF5]">{props.firmName}</strong> — gitar, piyano,
                keman, bateri ve vokal eğitimi. Uzman kadro, bireysel ve grup dersleri.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-lato)] text-base font-700 text-[#1C1917] shadow-lg transition-all hover:bg-[#D97706] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#F59E0B]/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-lato)] text-sm font-700 text-[#FAFAF5]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Stage spotlight frame */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-[#F59E0B]/20 bg-[#292524] shadow-2xl">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} müzik kursu`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">🎵</div>
                        <p className="mt-3 font-[family-name:var(--font-lato)] text-sm text-[#FAFAF5]/30">Müzik Kursu Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Gold accent bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
              </div>
              {/* Floating note badges */}
              <div className="absolute -right-2 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-xl shadow-lg">🎸</div>
              <div className="absolute -left-2 bottom-12 flex h-11 w-11 items-center justify-center rounded-full bg-[#DC2626] text-lg text-white shadow-lg">🎹</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#DC2626] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-abril)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-abril)] text-3xl sm:text-4xl">
            Müzik Dersi Arayanlar
            <br />
            <span className="text-[#FDE68A]">Hoca Kadrosunu Online İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/70">
            Müzik dersi araştıranların <strong className="text-white">%74&apos;ü</strong> enstrümanları,
            hoca kadrosunu ve fiyatları online inceliyor.
          </motion.p>

          {studioImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={studioImg} alt={`${props.firmName} stüdyo`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🎵', stat: '%74', text: 'Online araştırma yapıyor' },
              { emoji: '🎓', stat: '%65', text: 'Hoca profilini kontrol ediyor' },
              { emoji: '🎧', stat: '%58', text: 'Deneme dersi istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-abril)] text-2xl text-[#FDE68A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#292524] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-abril)] text-3xl sm:text-4xl">
            Web Sitesi <span className="text-[#F59E0B]">Olan</span> vs <span className="text-[#FAFAF5]/30">Olmayan</span> Müzik Kursu
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-abril)] text-lg text-[#F59E0B]">✅ Web Sitesi Olan Kurs</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#FAFAF5]/70">
                {['Enstrüman ve hoca bilgisi online', 'Deneme dersi talepleri artıyor', 'Google\'da "müzik kursu" aramasında üst sırada', 'Öğrenci videoları güven veriyor', 'Online kayıt geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F59E0B]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#FAFAF5]/5 bg-[#FAFAF5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-abril)] text-lg text-[#FAFAF5]/30">❌ Web Sitesi Olmayan Kurs</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#FAFAF5]/30">
                {['Hoca kadrosu bilinmiyor', 'Sadece çevreden öğrenci', 'Arama sonuçlarında görünmüyor', 'Fiyat bilgisi yok — güven düşük', 'Deneme dersi talebi gelmiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🎵</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-abril)] text-3xl sm:text-4xl lg:text-5xl">
            Müzik Kursunuzu <span className="text-[#F59E0B]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-lg text-[#FAFAF5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#F59E0B] px-10 py-5 font-[family-name:var(--font-lato)] text-lg font-700 text-[#1C1917] shadow-xl transition-all hover:bg-[#D97706] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#F59E0B]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🎵', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🎧', title: 'Deneme Dersi', desc: 'Öğrencileriniz online kayıt olabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#F59E0B]/10 bg-[#292524] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-abril)] text-base text-[#F59E0B]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#FAFAF5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#F59E0B]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#FAFAF5]/20">
        <p>Bu sayfa <strong className="text-[#FAFAF5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
