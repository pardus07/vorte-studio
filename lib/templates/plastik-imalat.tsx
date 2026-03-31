'use client'

import { Raleway, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

export default function PlastikImalatTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const factoryImg = props.images?.factory

  return (
    <div className={`${raleway.variable} ${sourceSans.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — 3-Column Product Card Grid (metin üstte, kartlar hero'nun kendisi) ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#0369A1] pb-20 pt-16 text-white">
        {/* Hero background image — düşük opacity ile arka planda */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt="" className="h-full w-full object-cover" style={{ opacity: 0.12 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0369A1]/60 via-[#0369A1]/80 to-[#0369A1]" />
          </div>
        )}


        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-white/10 px-5 py-2 backdrop-blur-sm">
              <span className="font-[family-name:var(--font-raleway)] text-xs font-600 uppercase tracking-[0.3em] text-white/80">
                {props.city} &bull; Plastik İmalat
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-4xl font-700 leading-tight sm:text-5xl lg:text-6xl">
              Plastik Ürün İhtiyaçlarınız İçin
              <br />
              <span className="text-[#BAE6FD]">Tek Kaynak</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/60">
              <strong className="text-white">{props.firmName}</strong> — enjeksiyon kalıp, şişirme, ekstrüzyon
              ve özel kalıp üretimi. B2B endüstriyel çözümler.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center gap-3 bg-white px-8 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#0369A1] shadow-lg transition-all hover:bg-[#BAE6FD] hover:shadow-xl">
                Ücretsiz Teklif Al
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

            {(props.googleRating || props.googleReviews) && (
              <motion.div variants={fadeInUp} className="mt-6 inline-flex items-center gap-3 bg-white/10 px-5 py-2 backdrop-blur-sm">
                <div className="flex gap-0.5 text-[#BAE6FD]">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <span className="font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                  {props.googleRating} ({props.googleReviews}+ yorum)
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Product card grid — hero'nun bir parçası, ayrı section değil */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🔧', title: 'Enjeksiyon Kalıp', desc: 'Yüksek hassasiyetli seri üretim kalıpları', color: '#0284C7' },
              { icon: '🏭', title: 'Şişirme Kalıp', desc: 'PET şişe ve bidon üretimi', color: '#0369A1' },
              { icon: '📐', title: 'Özel Kalıp', desc: 'Teknik çizime göre kalıp tasarımı', color: '#075985' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="mt-3 font-[family-name:var(--font-raleway)] text-lg font-600">{item.title}</h3>
                <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#0369A1] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-raleway)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-3xl font-700 text-[#0369A1] sm:text-4xl">
            Plastik Ürün Tedarikçisi Arayanlar
            <br />
            <span className="text-[#075985]">Teknik Spesifikasyon ve Fiyat İstiyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-[#1C1917]/60">
            Plastik imalat yaptırmak isteyenlerin <strong className="text-[#1C1917]">%55&apos;i</strong> teknik
            kapasite ve kalıp çeşitlerini online inceliyor.
          </motion.p>

          {heroImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-lg border-2 border-[#0369A1]/20">
              <img src={heroImg} alt={`${props.firmName} üretim`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏭', stat: '%55', text: 'Online araştırıyor' },
              { emoji: '📐', stat: 'Özel', text: 'Kalıp tasarımı' },
              { emoji: '🔧', stat: '10K+', text: 'Seri üretim kapasitesi' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-lg border border-[#0369A1]/10 bg-[#0369A1]/5 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-raleway)] text-2xl font-700 text-[#0369A1]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ FABRİKA GÖRSELİ — ek görsel alanı ═══════════════════ */}
      {factoryImg && (
        <section className="bg-[#F0F9FF] py-16">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.h3 variants={fadeInUp} className="mb-6 text-center font-[family-name:var(--font-raleway)] text-2xl font-700">
              Üretim <span className="text-[#0369A1]">Tesisimiz</span>
            </motion.h3>
            <motion.div variants={scaleIn} className="overflow-hidden rounded-lg">
              <img src={factoryImg} alt={`${props.firmName} fabrika`} className="w-full object-cover" style={{ maxHeight: '320px' }} />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F0F9FF] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#0369A1]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Plastik İmalatçılar
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-xl border-2 border-[#0369A1]/20 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-[#0369A1]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/70">
                {['Teknik kapasite bilgisi online', 'Kalıp çeşitleri net görünüyor', 'B2B müşteriler güveniyor', 'Google\'da "plastik imalat" çıkıyor', 'Toptan talepler 7/24 geliyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#0369A1]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-xl border border-[#1C1917]/10 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/30">
                {['Üretim kapasitesi bilinmiyor', 'Teknik bilgi alınamıyor', 'Kurumsal güven oluşturamıyor', 'Büyük müşterilere ulaşamıyor', 'Rekabette geride kalıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#0369A1] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏭</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Üretim Ortağınız <span className="text-[#BAE6FD]">Hazır</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz teknik danışmanlık ve fiyat teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-white px-10 py-5 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-[#0369A1] shadow-xl transition-all hover:bg-[#BAE6FD] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#0369A1]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🔧', title: 'Kalıp Tasarım', desc: 'Teknik çizimden üretime komple çözüm.' },
            { icon: '🏭', title: 'Seri Üretim', desc: 'Yüksek kapasite ile düşük birim maliyet.' },
            { icon: '📐', title: 'Kalite Kontrol', desc: 'Her partide ISO standartlarında test.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-lg border border-[#0369A1]/10 bg-[#F0F9FF] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#0369A1]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#0369A1]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
