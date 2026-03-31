'use client'

import { Josefin_Sans, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const josefinSans = Josefin_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-josefin-sans',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -35 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 35 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function PilatesYogaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const studioImg = props.images?.studio

  return (
    <div className={`${josefinSans.variable} ${lato.variable} min-h-screen bg-[#FAFAF9] text-[#44403C]`}>
      {/* ═══════════════════ HERO — Zen Circle Frame ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Soft green gradient */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.06]"
          style={{ background: 'radial-gradient(circle at 70% 30%, #84CC16 0%, transparent 70%)' }}
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
                <div className="h-px w-10 bg-[#A8A29E]" />
                <span className="font-[family-name:var(--font-lato)] text-xs font-300 uppercase tracking-[0.4em] text-[#A8A29E]">
                  {props.city} &bull; Pilates & Yoga
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-josefin-sans)] text-4xl font-300 leading-tight sm:text-5xl lg:text-6xl">
                Bedeninizi
                <br />
                <span className="font-600 text-[#84CC16]">Dinleyin</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-base font-300 leading-relaxed text-[#78716C]">
                <strong className="font-700 text-[#44403C]">{props.firmName}</strong> — uzman eğitmenler
                eşliğinde pilates, yoga ve nefes çalışmaları.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#84CC16] px-8 py-4 font-[family-name:var(--font-josefin-sans)] text-sm font-600 uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#65A30D] hover:shadow-lg"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full border border-[#84CC16]/20 bg-[#84CC16]/5 px-5 py-2.5">
                  <div className="flex gap-0.5 text-[#84CC16]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-lato)] text-sm text-[#78716C]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Zen Circle */}
            <motion.div variants={scaleIn} className="relative flex items-center justify-center">
              {/* Outer breathing ring */}
              <div className="absolute h-80 w-80 rounded-full border border-[#84CC16]/20 sm:h-96 sm:w-96" />
              <div className="absolute h-72 w-72 rounded-full border border-dashed border-[#A8A29E]/20 sm:h-88 sm:w-88" />

              {/* Circle image */}
              <div className="relative h-64 w-64 overflow-hidden rounded-full bg-[#F5F5F4] shadow-xl ring-4 ring-[#84CC16]/10 sm:h-80 sm:w-80">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} stüdyo`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl">🧘</div>
                      <p className="mt-2 font-[family-name:var(--font-lato)] text-xs text-[#A8A29E]">Stüdyo Görseli</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              <div className="absolute -right-2 top-8 rounded-full bg-white px-4 py-2 font-[family-name:var(--font-josefin-sans)] text-xs font-600 text-[#84CC16] shadow-md">
                🌿 Huzur
              </div>
              <div className="absolute -left-2 bottom-12 rounded-full bg-white px-4 py-2 font-[family-name:var(--font-josefin-sans)] text-xs font-600 text-[#A8A29E] shadow-md">
                🕊️ Denge
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#84CC16] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-josefin-sans)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-josefin-sans)] text-3xl font-600 sm:text-4xl">
            Pilates & Yoga Arayanlar
            <br />
            <span className="text-[#365314]">Stüdyo Atmosferini Önce Online Görüyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/70">
            Pilates/yoga arayanların <strong className="text-white">%74&apos;ü</strong> stüdyo
            fotoğrafları ve eğitmen profillerini online inceliyor.
          </motion.p>

          {studioImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={studioImg} alt={`${props.firmName} stüdyo`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🧘', stat: '%74', text: 'Stüdyo fotoğrafı arıyor' },
              { emoji: '📅', stat: '%68', text: 'Ders programı kontrol ediyor' },
              { emoji: '👩‍🏫', stat: '%81', text: 'Eğitmen profillerini okuyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-josefin-sans)] text-2xl font-700 text-[#365314]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-josefin-sans)] text-3xl font-600 sm:text-4xl">
            Web Sitesi <span className="text-[#84CC16]">Olan</span> vs <span className="text-[#A8A29E]">Olmayan</span> Stüdyo
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-3xl border border-[#84CC16]/20 bg-[#84CC16]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-josefin-sans)] text-lg font-600 text-[#84CC16]">✅ Web Sitesi Olan Stüdyo</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#78716C]">
                {['Stüdyo atmosferi ve eğitmen profilleri online', 'Ders programı net görünüyor', 'Google\'da "pilates stüdyosu" aramasında üst sırada', 'Deneme dersi talepleri artıyor', 'Online ders kaydı mümkün'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#84CC16]">●</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-3xl border border-[#E7E5E4] bg-[#F5F5F4] p-8">
              <div className="mb-4 font-[family-name:var(--font-josefin-sans)] text-lg font-600 text-[#A8A29E]">❌ Web Sitesi Olmayan Stüdyo</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#A8A29E]">
                {['Stüdyo ortamı bilinmiyor', 'Ders saatleri bilgisi yok', 'Arama sonuçlarında görünmüyor', 'Sadece çevredeki kişilerden kayıt', 'Rakiplere öğrenci kaybediyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5">●</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ background: 'radial-gradient(circle at 50% 50%, #84CC16 0%, transparent 60%)' }}
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🧘</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-josefin-sans)] text-3xl font-600 sm:text-4xl lg:text-5xl">
            Stüdyonuzu <span className="text-[#84CC16]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base font-300 text-[#78716C]">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#84CC16] px-10 py-5 font-[family-name:var(--font-josefin-sans)] text-base font-600 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#65A30D] hover:shadow-xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#E7E5E4] py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🌿', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📅', title: 'Online Ders Kaydı', desc: 'Öğrencileriniz online kayıt yapabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#E7E5E4] bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-josefin-sans)] text-base font-600 text-[#84CC16]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#A8A29E]">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#E7E5E4] py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#D6D3D1]">
        <p>Bu sayfa <strong className="text-[#A8A29E]">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
