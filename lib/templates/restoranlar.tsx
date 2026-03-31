'use client'

import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function RestoranlarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroBg = props.images?.['hero-bg']
  const menuImg = props.images?.menu

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen bg-[#1C1917] text-[#FAFAF5]`}>
      {/* ═══════════════════ HERO — Full-width BG Atmospheric ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background image */}
        {heroBg ? (
          <img src={heroBg} alt={`${props.firmName} restoran atmosferi`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917]" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917] via-[#1C1917]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-[#1C1917]/30" />

        {/* Content */}
        <div className="relative flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#D97706]" />
                <span className="font-[family-name:var(--font-dm-sans)] text-sm uppercase tracking-[0.25em] text-[#D97706]">
                  {props.city} &bull; Fine Dining
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-[family-name:var(--font-cormorant)] text-5xl font-700 italic leading-[1.1] sm:text-6xl lg:text-7xl"
              >
                Her Çatalda
                <br />
                Bir <span className="text-[#D97706]">Hikâye</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 max-w-lg font-[family-name:var(--font-dm-sans)] text-lg leading-relaxed text-[#FAFAF5]/60"
              >
                <strong className="text-[#FAFAF5]">{props.firmName}</strong> — özenle seçilmiş malzemeler,
                ustaca hazırlanmış tatlar ve unutulmaz bir yemek deneyimi.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#D97706] px-8 py-4 font-[family-name:var(--font-dm-sans)] text-base font-600 text-[#1C1917] transition-all hover:bg-[#F59E0B] hover:shadow-[0_0_40px_rgba(217,119,6,0.3)]"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {/* Rating badge */}
              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="mt-8 inline-flex items-center gap-3 border border-[#D97706]/20 bg-[#1C1917]/80 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#D97706]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <div className="font-[family-name:var(--font-dm-sans)] text-sm text-[#FAFAF5]/60">
                    <strong className="text-[#FAFAF5]">{props.googleRating}</strong> / 5
                    <span className="mx-1">·</span>
                    {props.googleReviews}+ Yorum
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#D97706 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D97706]/20 bg-[#D97706]/5 px-5 py-2">
            <span className="text-[#D97706]">⚠️</span>
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-[#D97706]">Dikkat</span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl lg:text-5xl"
          >
            Menünüz Online Değilse
            <br />
            <span className="text-[#D97706]">Müşteri Rakibinize Gidiyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-dm-sans)] text-lg text-[#FAFAF5]/50">
            Yemek yeri arayan müşterilerin <strong className="text-[#FAFAF5]">%87&apos;si</strong> Google&apos;da
            restoran arıyor. Menünüz, fotoğraflarınız ve yorumlarınız online değilse
            karar sürecine dahil bile olamıyorsunuz.
          </motion.p>

          {/* Menu image card */}
          {menuImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border border-[#D97706]/20">
              <img src={menuImg} alt={`${props.firmName} menü`} className="w-full object-cover" />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { icon: '🔍', stat: '%87', text: 'Online restoran araması' },
              { icon: '📸', stat: '%70', text: 'Fotoğraf görmek istiyor' },
              { icon: '📱', stat: '%65', text: 'Menüyü online inceliyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#D97706]/10 bg-[#D97706]/5 p-5 text-center">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#D97706]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[#FAFAF5]/40">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="border-y border-[#D97706]/10 bg-[#141210] py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl">
            Web Sitesi <span className="text-[#D97706]">Olan</span> vs <span className="text-[#FAFAF5]/30">Olmayan</span> Restoran
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#D97706]/20 bg-[#D97706]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#D97706]">
                ✅ Web Sitesi Olan Restoran
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-dm-sans)] text-[#FAFAF5]/70">
                {[
                  'Online menü — müşteri ne yiyeceğini bilerek geliyor',
                  'Google\'da "yakınımdaki restoran" aramasında çıkıyor',
                  'Rezervasyon talebi online alınıyor',
                  'Profesyonel fotoğraflar güven oluşturuyor',
                  'Özel gün organizasyonları talep ediliyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#D97706]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={slideFromRight} className="border border-[#FAFAF5]/5 bg-[#FAFAF5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#FAFAF5]/30">
                ❌ Web Sitesi Olmayan Restoran
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-dm-sans)] text-[#FAFAF5]/40">
                {[
                  'Menü sadece mekânda — müşteri sürpriz yaşıyor',
                  'Arama motorlarında görünmüyor, rakip kazanıyor',
                  'Telefonla rezervasyon — meşgul saatlerde kaçırılıyor',
                  'Yemek fotoğrafı yok — güven skoru düşük',
                  'Kurumsal etkinlik talepleri gelmiyor',
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
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D97706]/8 blur-[200px]" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mx-auto mb-6 h-px w-16 bg-[#D97706]" />

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-cormorant)] text-4xl font-700 italic sm:text-5xl lg:text-6xl"
          >
            Restoranınızı
            <br />
            <span className="text-[#D97706]">Dijitale Taşıyalım</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-dm-sans)] text-lg text-[#FAFAF5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış
            profesyonel restoran web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#D97706] px-10 py-5 font-[family-name:var(--font-dm-sans)] text-lg font-600 text-[#1C1917] transition-all hover:bg-[#F59E0B] hover:shadow-[0_0_50px_rgba(217,119,6,0.3)]"
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
      <section className="border-t border-[#D97706]/10 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '🍽️', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve ihtiyaç analizi tamamen ücretsiz.' },
            { icon: '⚡', title: 'Hızlı Teslimat', desc: 'Profesyonel restoran web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Mobil Uyumlu', desc: 'Müşterileriniz telefondan da mükemmel deneyim yaşar.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#D97706]/10 bg-[#D97706]/5 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-cormorant)] text-lg font-700">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-sm text-[#FAFAF5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#FAFAF5]/5 py-8 text-center font-[family-name:var(--font-dm-sans)] text-sm text-[#FAFAF5]/20">
        <p>Bu sayfa <strong className="text-[#FAFAF5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
