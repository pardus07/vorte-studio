'use client'

import { Pacifico, Nunito } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
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

export default function KafelerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const ambianceImg = props.images?.ambiance

  return (
    <div className={`${pacifico.variable} ${nunito.variable} min-h-screen bg-[#FEF3C7] text-[#78350F]`}>
      {/* ═══════════════════ HERO — Split Diagonal + Warm ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Warm texture background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A]/40 to-[#FEF3C7]" />

        {/* Subtle coffee bean pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#78350F 2px, transparent 2px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Sol — Text */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">☕</span>
                <span className="font-[family-name:var(--font-nunito)] text-sm font-600 uppercase tracking-[0.2em] text-[#92400E]">
                  {props.city} &bull; Özel Kafe
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp}>
                <span className="font-[family-name:var(--font-pacifico)] text-4xl leading-[1.3] text-[#78350F] sm:text-5xl lg:text-6xl">
                  En Güzel Molalar
                </span>
                <br />
                <span className="font-[family-name:var(--font-nunito)] text-2xl font-700 text-[#92400E] sm:text-3xl">
                  {props.firmName}&apos;nda Verilir
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-md font-[family-name:var(--font-nunito)] text-lg leading-relaxed text-[#92400E]/70"
              >
                Özenle seçilmiş çekirdekler, ev yapımı tarifler ve sıcak bir atmosfer.
                <strong className="text-[#78350F]"> {props.firmName}</strong> — günün en güzel molası burada.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#78350F] px-8 py-4 font-[family-name:var(--font-nunito)] text-base font-600 text-[#FEF3C7] shadow-lg transition-all hover:bg-[#92400E] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {/* Hours badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#78350F]/10 bg-white/60 px-5 py-3 backdrop-blur-sm">
                <span className="text-lg">🕐</span>
                <div className="font-[family-name:var(--font-nunito)] text-sm text-[#92400E]">
                  <strong className="text-[#78350F]">Her Gün Açık</strong>
                  <span className="mx-1">·</span>
                  08:00 — 23:00
                </div>
              </motion.div>
            </div>

            {/* Sağ — Diagonal clip hero image */}
            <motion.div variants={scaleIn} className="relative">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl"
                style={{ clipPath: 'polygon(8% 0%, 100% 0%, 100% 92%, 0% 100%)' }}
              >
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} kafe atmosferi`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#92400E]/20 to-[#78350F]/30">
                    <div className="text-center">
                      <div className="text-6xl">☕</div>
                      <p className="mt-3 font-[family-name:var(--font-nunito)] text-sm text-[#78350F]/40">Kafe Görseli</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating rating card */}
              {(props.googleRating || props.googleReviews) && (
                <div className="absolute -bottom-4 -left-4 rounded-2xl border border-[#78350F]/10 bg-white px-5 py-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                    </div>
                    <span className="font-[family-name:var(--font-nunito)] text-sm font-700 text-[#78350F]">{props.googleRating}</span>
                  </div>
                  <p className="mt-1 font-[family-name:var(--font-nunito)] text-xs text-[#92400E]/60">{props.googleReviews}+ Mutlu Müşteri</p>
                </div>
              )}

              {/* Decorative coffee cup */}
              <div className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#78350F] text-2xl shadow-lg">
                ☕
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#78350F] py-20 text-[#FEF3C7]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FEF3C7]/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-nunito)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-pacifico)] text-3xl sm:text-4xl">
            Sabah Kahve Yeri Arayanlar
          </motion.h2>
          <motion.h3 variants={fadeInUp} className="mt-2 font-[family-name:var(--font-nunito)] text-xl font-700 text-[#FDE68A]">
            Maps&apos;te Açık Olan Kafeyi Arıyor
          </motion.h3>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-nunito)] text-lg text-[#FEF3C7]/70">
            Müşterilerin <strong className="text-[#FEF3C7]">%73&apos;ü</strong> kahve yeri ararken
            Google Maps&apos;e bakıyor. Çalışma saatleriniz, menünüz ve fotoğraflarınız güncel
            değilse müşteri rakibinize gidiyor.
          </motion.p>

          {/* Ambiance image banner */}
          {ambianceImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl">
              <img src={ambianceImg} alt={`${props.firmName} atmosfer`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '📍', stat: '%73', text: 'Maps\'ten kafe arıyor' },
              { emoji: '📸', stat: '%60', text: 'Fotoğraf görmek istiyor' },
              { emoji: '🕐', stat: '%45', text: 'Çalışma saati kontrol ediyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-[#FEF3C7]/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-nunito)] text-2xl font-700 text-[#FDE68A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-nunito)] text-sm text-[#FEF3C7]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center">
            <span className="font-[family-name:var(--font-pacifico)] text-3xl text-[#78350F] sm:text-4xl">
              Web Sitesi <span className="text-[#15803D]">Olan</span> vs <span className="text-[#78350F]/30">Olmayan</span>
            </span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#15803D]/20 bg-[#15803D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#15803D]">
                ✅ Web Sitesi Olan Kafe
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-[#78350F]/80">
                {[
                  'Menü online — müşteri önceden seçiyor',
                  'Çalışma saatleri güncel, müşteri boşuna gelmiyor',
                  'Google\'da üst sırada çıkıyor',
                  'Atmosfer fotoğrafları güven oluşturuyor',
                  'Özel etkinlik talepleri artıyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#15803D]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#78350F]/10 bg-[#78350F]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#78350F]/40">
                ❌ Web Sitesi Olmayan Kafe
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-[#78350F]/50">
                {[
                  'Menü sadece mekânda — sürpriz fiyatlar',
                  'Saatler belirsiz — müşteri gelmiyor',
                  'Arama sonuçlarında görünmüyor',
                  'Sosyal medya yeterli değil — güven eksik',
                  'Sadece çevre müşterisi kalıyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A]/30 py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="text-4xl">☕</motion.div>

          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-pacifico)] text-3xl text-[#78350F] sm:text-4xl lg:text-5xl">
            Kafenizi Dijitale Taşıyalım
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-nunito)] text-lg text-[#92400E]/70">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış
            profesyonel kafe web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#78350F] px-10 py-5 font-[family-name:var(--font-nunito)] text-lg font-600 text-[#FEF3C7] shadow-xl transition-all hover:bg-[#92400E] hover:shadow-2xl"
            >
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#78350F]/10 bg-white/40 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '☕', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve ihtiyaç analizi tamamen ücretsiz.' },
            { icon: '⚡', title: 'Hızlı Teslimat', desc: 'Kafe web siteniz 48 saat içinde hazır.' },
            { icon: '🎨', title: 'Kişiye Özel Tasarım', desc: 'Kafenizin ruhunu yansıtan özgün tasarım.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#78350F]/10 bg-white/60 p-6 text-center backdrop-blur-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-nunito)] text-base font-700 text-[#78350F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-nunito)] text-sm text-[#92400E]/60">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#78350F]/10 bg-[#FEF3C7] py-8 text-center font-[family-name:var(--font-nunito)] text-sm text-[#78350F]/30">
        <p>Bu sayfa <strong className="text-[#78350F]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
