'use client'

import { Rajdhani, Roboto } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rajdhani = Rajdhani({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
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

export default function OtoGaleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroBgImg = props.images?.['hero-bg']
  const stockImg = props.images?.stock

  return (
    <div className={`${rajdhani.variable} ${roboto.variable} min-h-screen bg-[#0A0A0A] text-[#F5F5F5]`}>
      {/* ═══════════════════ HERO — Full-Width Showroom BG ═══════════════════ */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background image or gradient */}
        {heroBgImg ? (
          <img src={heroBgImg} alt={`${props.firmName} showroom`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1C1917 40%, #0A0A0A 100%)' }} />
        )}
        {/* Dark overlay with spotlight */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)' }} />
        {/* Red accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DC2626]" />

        <div className="relative flex min-h-[90vh] items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl space-y-8"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#DC2626]" />
                <span className="font-[family-name:var(--font-roboto)] text-sm font-300 uppercase tracking-[0.3em] text-[#DC2626]">
                  {props.city} &bull; Oto Galeri
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Hayalinizdeki
                <br />
                <span className="text-[#DC2626]">Araç</span> Burada
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-roboto)] text-base font-300 leading-relaxed text-[#F5F5F5]/50">
                <strong className="font-700 text-[#F5F5F5]">{props.firmName}</strong> — geniş araç
                stoku, uygun fiyatlar ve güvenilir alım-satım.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#DC2626] px-8 py-4 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#B91C1C] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#DC2626]/20 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#DC2626]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-roboto)] text-sm text-[#F5F5F5]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#DC2626] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Araç Arayanlar
            <br />
            <span className="text-[#0A0A0A]">Önce Online İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-roboto)] text-lg text-white/70">
            Araç arayanların <strong className="text-white">%87&apos;si</strong> önce online stok
            kontrol ediyor. Stoğunuz online değilse rakibinize gidiyorlar.
          </motion.p>

          {stockImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={stockImg} alt={`${props.firmName} araç stok`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🚗', stat: '%87', text: 'Online araştırıyor' },
              { emoji: '📸', stat: '%76', text: 'Araç fotoğrafı istiyor' },
              { emoji: '💰', stat: '%69', text: 'Fiyat karşılaştırması yapıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-rajdhani)] text-2xl font-700 text-[#0A0A0A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-roboto)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#141414] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#DC2626]">Olan</span> vs <span className="text-[#F5F5F5]/30">Olmayan</span> Galeri
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#DC2626]/20 bg-[#DC2626]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#DC2626]">✅ Web Sitesi Olan Galeri</div>
              <ul className="space-y-3 font-[family-name:var(--font-roboto)] text-[#F5F5F5]/70">
                {['Araç stoku online görünüyor', 'Fiyat ve detaylar şeffaf', 'Google\'da "oto galeri" aramasında üst sırada', 'Test sürüşü talepleri artıyor', 'Online araç rezervasyonu geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#DC2626]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F5F5F5]/5 bg-[#F5F5F5]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#F5F5F5]/30">❌ Web Sitesi Olmayan Galeri</div>
              <ul className="space-y-3 font-[family-name:var(--font-roboto)] text-[#F5F5F5]/30">
                {['Stok bilgisi bilinmiyor', 'Fiyat bilgisi yok — güven düşük', 'Arama sonuçlarında görünmüyor', 'Sadece çevreden müşteri', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🚗</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Galerinizi <span className="text-[#DC2626]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-roboto)] text-base font-300 text-[#F5F5F5]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#DC2626] px-10 py-5 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#B91C1C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#DC2626]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🚗', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📸', title: 'Online Stok', desc: 'Araçlarınız profesyonel fotoğraflarla online.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#DC2626]/10 bg-[#141414] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase text-[#DC2626]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-roboto)] text-sm text-[#F5F5F5]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#DC2626]/10 py-8 text-center font-[family-name:var(--font-roboto)] text-sm text-[#F5F5F5]/20">
        <p>Bu sayfa <strong className="text-[#F5F5F5]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
