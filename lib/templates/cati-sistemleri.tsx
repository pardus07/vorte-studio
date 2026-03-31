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

export default function CatiSistemleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const projectsImg = props.images?.projects

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#F8FAFC] text-[#1E293B]`}>
      {/* ═══════════════════ HERO — Roof Cross-Section SVG + Warranty Shield ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1E293B] pb-20 pt-16 text-white">
        {/* Roof angle SVG pattern — repeating triangular rooflines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="roof-pattern" x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
                <polyline points="0,60 60,10 120,60" fill="none" stroke="#DC2626" strokeWidth="1" />
                <line x1="60" y1="10" x2="60" y2="60" stroke="#DC2626" strokeWidth="0.5" strokeDasharray="4,4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#roof-pattern)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Roof system types */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-10">
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
              {['🏠 Kiremit Çatı', '🔩 Metal Çatı', '🛡️ Membran', '🌧️ Çatı Onarım'].map((badge, i) => (
                <span key={i} className="border border-[#DC2626]/30 bg-[#DC2626]/10 px-4 py-1.5 font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase text-[#DC2626]">
                  {badge}
                </span>
              ))}
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
                <div className="h-1 w-10 bg-[#DC2626]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#DC2626]">
                  {props.city} &bull; Çatı Sistemleri
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Çatınız
                <br />
                Yıllar Boyu
                <br />
                <span className="text-[#DC2626]">Sizi Korusun</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-white/70">
                <strong className="text-white">{props.firmName}</strong> — çatı yapım, onarım ve
                yalıtım uzmanı. Acil müdahale, 10 yıl garanti, sertifikalı malzeme.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#DC2626] px-8 py-4 font-[family-name:var(--font-oswald)] text-base font-600 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#B91C1C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#DC2626]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-white/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Roof image with warranty shield */}
            <motion.div variants={scaleIn} className="relative">
              {/* Warranty shield badge */}
              <div className="absolute -left-4 -top-4 z-10 flex flex-col items-center justify-center">
                <div className="flex h-24 w-20 flex-col items-center justify-center bg-[#DC2626] shadow-lg" style={{ clipPath: 'polygon(50% 0%, 100% 10%, 100% 85%, 50% 100%, 0% 85%, 0% 10%)' }}>
                  <span className="font-[family-name:var(--font-oswald)] text-2xl font-700">10</span>
                  <span className="font-[family-name:var(--font-source-sans)] text-[9px] font-600 uppercase">Yıl Garanti</span>
                </div>
              </div>

              <div className="overflow-hidden bg-[#334155]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} çatı`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#DC2626]/5">
                      <div className="text-center">
                        <div className="text-6xl">🏠</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-white/30">Proje Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Red accent line top (like a roofline) */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-[#DC2626]" />
              </div>

              {/* Acil servis badge */}
              <div className="absolute -right-3 bottom-8 bg-white px-5 py-2.5 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase text-[#DC2626] shadow-lg">
                ⚡ Acil Servis
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#DC2626] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/30 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Çatı Sorunu Olanlar
            <br />
            <span className="text-[#FDE68A]">Acil Çözüm Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-white/80">
            Çatı tamir veya yenileme arayanların <strong className="text-white">%81&apos;i</strong> acil
            müdahale ve garanti veren firmayı tercih ediyor.
          </motion.p>

          {projectsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={projectsImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🌧️', stat: '%81', text: 'Acil çözüm istiyor' },
              { emoji: '🛡️', stat: '%73', text: 'Garanti arıyor' },
              { emoji: '⭐', stat: '%67', text: 'Referans projelere bakıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#FDE68A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-white/70">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#DC2626]">Olan</span> vs <span className="text-[#1E293B]/30">Olmayan</span> Çatı Firması
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#DC2626]/20 bg-[#DC2626]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#DC2626]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1E293B]/70">
                {['Acil servis bilgisi anında erişilebilir', 'Garanti ve sertifikalar görünür', 'Google\'da "çatı tamiri" aramasında çıkıyor', 'Referans projeler güven veriyor', '7/24 teklif talebi alıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#DC2626]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1E293B]/10 bg-[#1E293B]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1E293B]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1E293B]/30">
                {['Acil durumlarda ulaşılamıyor', 'Garanti bilgisi doğrulanamıyor', 'Arama sonuçlarında görünmüyor', 'Referans gösteremiyor', 'Sadece tavsiye ile müşteri buluyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#1E293B] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏠</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Çatınızı <span className="text-[#DC2626]">Güvenceye Alın</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} ücretsiz çatı kontrolü ve detaylı teklif.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#DC2626] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#B91C1C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1E293B]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🌧️', title: 'Acil Müdahale', desc: 'Yağmurda acil çatı tamiri — aynı gün müdahale.' },
            { icon: '🛡️', title: '10 Yıl Garanti', desc: 'Çatı işçiliğinde 10 yıl yazılı garanti.' },
            { icon: '⚡', title: 'Hızlı Teslim', desc: 'Çatı yenileme projeleri en kısa sürede tamamlanır.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#1E293B]/10 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-base font-600 uppercase text-[#DC2626]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#1E293B]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1E293B]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1E293B]/30">
        <p>Bu sayfa <strong className="text-[#1E293B]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
