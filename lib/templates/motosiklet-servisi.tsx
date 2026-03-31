'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
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

export default function MotosikletServisiTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const workshopImg = props.images?.workshop

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#0A0A0A] text-[#F5F5F5]`}>
      {/* ═══════════════════ HERO — Road Perspective + Chrome Circle ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Road perspective vanishing lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.06]" width="800" height="400" viewBox="0 0 800 400">
            <line x1="400" y1="100" x2="0" y2="400" stroke="#F97316" strokeWidth="1" />
            <line x1="400" y1="100" x2="800" y2="400" stroke="#F97316" strokeWidth="1" />
            <line x1="400" y1="100" x2="200" y2="400" stroke="#F97316" strokeWidth="0.5" />
            <line x1="400" y1="100" x2="600" y2="400" stroke="#F97316" strokeWidth="0.5" />
            {/* Center dashes */}
            <line x1="400" y1="150" x2="400" y2="180" stroke="#F97316" strokeWidth="2" />
            <line x1="400" y1="210" x2="400" y2="240" stroke="#F97316" strokeWidth="2" />
            <line x1="400" y1="270" x2="400" y2="300" stroke="#F97316" strokeWidth="2" />
            <line x1="400" y1="330" x2="400" y2="360" stroke="#F97316" strokeWidth="2" />
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
              {/* Brand badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
                {['Honda', 'Yamaha', 'BMW', 'Kawasaki', 'Suzuki'].map((brand, i) => (
                  <span key={i} className="border border-[#F97316]/30 bg-[#F97316]/10 px-3 py-1 font-[family-name:var(--font-barlow)] text-xs font-600 uppercase text-[#F97316]">
                    {brand}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#F97316]" />
                <span className="font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-[0.3em] text-[#F97316]">
                  {props.city} &bull; Motosiklet Servisi
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-800 uppercase leading-none sm:text-6xl lg:text-7xl">
                Motorunuz İçin
                <br />
                <span className="text-[#F97316]">En İyi</span> Bakım
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-barlow)] text-base leading-relaxed text-[#F5F5F5]/50">
                <strong className="text-[#F5F5F5]">{props.firmName}</strong> — tüm markalarda
                uzman servis, sezon bakımı ve yedek parça.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#EA580C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#F97316]/20 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F97316]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Chrome circle hero */}
            <motion.div variants={scaleIn} className="relative flex items-center justify-center">
              {/* Chrome outer ring */}
              <div className="absolute h-80 w-80 rounded-full sm:h-96 sm:w-96" style={{ background: 'linear-gradient(135deg, #404040, #808080, #404040)', padding: '3px' }}>
                <div className="h-full w-full rounded-full bg-[#0A0A0A]" />
              </div>

              {/* Image circle */}
              <div className="relative h-72 w-72 overflow-hidden rounded-full bg-[#1A1A1A] shadow-2xl sm:h-88 sm:w-88">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} motosiklet`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl">🏍️</div>
                      <p className="mt-3 font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/30">Motosiklet Görseli</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              <div className="absolute -right-2 top-12 bg-[#F97316] px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-sm font-700 uppercase text-white shadow-lg">
                Uzman Servis
              </div>
              <div className="absolute -left-2 bottom-16 border border-[#808080]/30 bg-[#0A0A0A] px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-sm font-700 uppercase text-[#808080] shadow-lg">
                Sezon Bakımı
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F97316] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-barlow-condensed)] text-lg uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-800 uppercase sm:text-4xl">
            Motosiklet Sahipleri
            <br />
            <span className="text-[#0A0A0A]">Uzman Servis Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-lg text-white/70">
            Motosiklet bakımı arayanların <strong className="text-white">%76&apos;sı</strong> marka
            uzmanlığı olan servisleri tercih ediyor.
          </motion.p>

          {workshopImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={workshopImg} alt={`${props.firmName} atölye`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏍️', stat: '%76', text: 'Marka uzmanlığı arıyor' },
              { emoji: '🔧', stat: '%63', text: 'Sezon bakımı yaptırıyor' },
              { emoji: '📱', stat: '%71', text: 'Online randevu istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-barlow-condensed)] text-2xl font-800 text-[#0A0A0A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-barlow)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#141414] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-condensed)] text-3xl font-800 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#F97316]">Olan</span> vs <span className="text-[#F5F5F5]/30">Olmayan</span> Servis
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F97316]/20 bg-[#F97316]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase text-[#F97316]">✅ Web Sitesi Olan Servis</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-[#F5F5F5]/70">
                {['Marka uzmanlıkları belirtiliyor', 'Google\'da "motosiklet servisi" üst sırada', 'Sezon bakım paketleri online', 'Yedek parça bilgisi şeffaf', 'Online randevu geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F97316]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F5F5F5]/5 bg-[#F5F5F5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase text-[#F5F5F5]/30">❌ Web Sitesi Olmayan Servis</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-[#F5F5F5]/30">
                {['Hizmet kapsamı bilinmiyor', 'Hangi markalara baktığı belirsiz', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden müşteri', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">🏍️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow-condensed)] text-3xl font-800 uppercase sm:text-4xl lg:text-5xl">
            Servisinizi <span className="text-[#F97316]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-base text-[#F5F5F5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F97316] px-10 py-5 font-[family-name:var(--font-barlow-condensed)] text-xl font-700 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#EA580C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#F97316]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏍️', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🔧', title: 'Sezon Paketleri', desc: 'Bakım paketlerinizi online sunabilirsiniz.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#F97316]/10 bg-[#141414] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-base font-700 uppercase text-[#F97316]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#F97316]/10 py-8 text-center font-[family-name:var(--font-barlow)] text-sm text-[#F5F5F5]/20">
        <p>Bu sayfa <strong className="text-[#F5F5F5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
