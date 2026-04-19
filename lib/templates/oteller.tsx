'use client'

import { Cormorant_Garamond, Raleway } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-raleway',
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

export default function OtellerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroBgImg = props.images?.['hero-bg']
  const roomsImg = props.images?.rooms

  return (
    <div className={`${cormorant.variable} ${raleway.variable} min-h-screen bg-[#0F172A] text-[#FFFBF0]`}>
      {/* ═══════════════════ HERO — Luxury Full-Width BG ═══════════════════ */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Full-width background image */}
        {heroBgImg ? (
          <img src={heroBgImg} alt={`${props.firmName} otel`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />
        )}
        {/* Dark overlay with gold gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F172A] to-transparent" />

        <div className="relative flex min-h-[90vh] items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl space-y-8"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#D4AF37]" />
                <span className="font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-[0.3em] text-[#D4AF37]">
                  {props.city} &bull; Premium Konaklama
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-5xl font-700 italic leading-tight sm:text-6xl lg:text-7xl">
                {props.firmName}
                <br />
                <span className="text-[#D4AF37]">Huzur & Konfor</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-lg font-[family-name:var(--font-raleway)] text-lg leading-relaxed text-[#FFFBF0]/60">
                {suffixIn(props.city)} kalbinde eşsiz konaklama deneyimi. Konfor, zarafet ve misafirperverliği bir arada yaşayın.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-none border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-raleway)] text-base font-600 text-[#0F172A] transition-all hover:bg-transparent hover:text-[#D4AF37]"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#D4AF37]/20 bg-[#0F172A]/50 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-raleway)] text-sm font-600 text-[#FFFBF0]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#D4AF37] py-20 text-[#0F172A]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0F172A]/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-cormorant)] font-700">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl">
            Otel Arayanlar
            <br />
            <span className="text-[#0F172A]/70">Google&apos;da Sizi Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-raleway)] text-lg text-[#0F172A]/70">
            Otel arayanların <strong className="text-[#0F172A]">%93&apos;ü</strong> booking.com&apos;dan önce
            Google&apos;da arıyor. Kendi siteniz yoksa aracıya komisyon ödüyorsunuz.
          </motion.p>

          {roomsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={roomsImg} alt={`${props.firmName} odalar`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏨', stat: '%93', text: 'Google\'da otel arıyor' },
              { emoji: '💰', stat: '%15-20', text: 'Aracı komisyon oranı' },
              { emoji: '📱', stat: '%68', text: 'Mobil rezervasyon yapıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#0F172A]/10 bg-[#0F172A]/5 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-700 text-[#0F172A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-raleway)] text-sm text-[#0F172A]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#1E293B] py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl">
            Kendi Sitesi <span className="text-[#D4AF37]">Olan</span> vs <span className="text-[#FFFBF0]/30">Olmayan</span> Otel
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-cormorant)] text-lg font-700 text-[#D4AF37]">✅ Kendi Sitesi Olan Otel</div>
              <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-[#FFFBF0]/70">
                {['Doğrudan rezervasyon — komisyon yok', 'Özel fiyat/kampanya sunabiliyor', 'Marka bilinirliği artıyor', 'Misafir sadakat programı çalışıyor', 'Google arama sonuçlarında üst sırada'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#D4AF37]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#FFFBF0]/5 bg-[#FFFBF0]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-cormorant)] text-lg font-700 text-[#FFFBF0]/30">❌ Kendi Sitesi Olmayan Otel</div>
              <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-[#FFFBF0]/30">
                {['Her rezervasyonda %15-20 komisyon', 'Fiyat kontrolü aracıda', 'Marka bilinirliği düşük', 'Sadakat programı yürütülemiyor', 'Aracı siteler olmadan müşteri gelmiyor'].map((item, i) => (
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
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏨</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl lg:text-5xl">
            Otelinizi <span className="text-[#D4AF37]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-raleway)] text-lg text-[#FFFBF0]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel otel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-10 py-5 font-[family-name:var(--font-raleway)] text-lg font-600 text-[#0F172A] shadow-xl transition-all hover:bg-transparent hover:text-[#D4AF37]">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#D4AF37]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏨', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel otel web siteniz 48 saat içinde hazır.' },
            { icon: '💰', title: 'Komisyonsuz Rezervasyon', desc: 'Doğrudan misafirlerinizden rezervasyon alın.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#D4AF37]/10 bg-[#1E293B] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-base font-700 text-[#D4AF37]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-raleway)] text-sm text-[#FFFBF0]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#D4AF37]/10 py-8 text-center font-[family-name:var(--font-raleway)] text-sm text-[#FFFBF0]/20">
        <p>Bu sayfa <strong className="text-[#FFFBF0]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
