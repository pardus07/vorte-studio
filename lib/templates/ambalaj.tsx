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

export default function AmbalajTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#F9FAFB] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Diagonal Split (sol koyu, sağ açık, çapraz bölünme) ═══════════════════ */}
      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Diagonal background — sol yarı koyu, sağ yarı açık */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #374151 0%, #374151 55%, #F9FAFB 55%, #F9FAFB 100%)',
        }} />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-5 lg:gap-0">
            {/* Sol — metin (3/5) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8 text-white lg:col-span-3 lg:pr-16"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#F59E0B]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#F59E0B]">
                  {props.city} &bull; Ambalaj İmalat
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-4xl font-700 uppercase leading-none sm:text-5xl lg:text-7xl">
                Ürünlerinizi
                <br />
                En İyi Şekilde
                <br />
                <span className="text-[#F59E0B]">Paketleyin</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — kutu, poşet, özel baskılı ambalaj
                ve paketleme çözümleri. Toptan üretim, hızlı teslimat.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#374151] shadow-lg transition-all hover:bg-[#FBBF24] hover:shadow-xl">
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Sağ — görsel çapraz çerçevede (2/5) */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative lg:col-span-2">
              {/* Rotated frame decoration */}
              <div className="absolute -inset-4 -rotate-3 border-2 border-[#F59E0B]/30" />
              <div className="relative overflow-hidden bg-[#374151]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} ambalaj`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F59E0B]/5">
                      <div className="text-center">
                        <div className="text-6xl">📦</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-white/30">Ambalaj Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating spec badges */}
              <div className="absolute -bottom-6 -left-6 z-10 bg-[#F59E0B] px-5 py-3 shadow-xl">
                <span className="font-[family-name:var(--font-oswald)] text-sm font-700 uppercase text-[#374151]">Özel Baskı</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F59E0B] py-20 text-[#374151]">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#374151] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Ambalaj İhtiyacı Olan Firmalar
            <br />
            <span className="text-[#7C2D12]">Toptan Fiyat ve Özel Baskı Soruyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-[#374151]/70">
            Ambalaj tedarikçisi arayan firmaların <strong className="text-[#374151]">%61&apos;i</strong> minimum
            sipariş, baskı ve teslimat bilgilerini online araştırıyor.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#374151]/20">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '📦', stat: '%61', text: 'Online araştırıyor' },
              { emoji: '🖨️', stat: 'Özel', text: 'Baskılı ambalaj' },
              { emoji: '🚛', stat: '5-7 Gün', text: 'Teslimat süresi' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-[#374151]/10 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#374151]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-[#374151]/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#374151]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Ambalaj Firmaları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#F59E0B]/20 bg-[#F59E0B]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#374151]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/70">
                {['Ürün kataloğu online erişilebilir', 'Minimum sipariş bilgisi net', 'Özel baskı talepleri 7/24 geliyor', 'Google\'da "ambalaj imalatı" çıkıyor', 'Kurumsal güvenilirlik sağlıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F59E0B]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-[#1C1917]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1C1917]/30">
                {['Ürün çeşitleri bilinmiyor', 'Sipariş bilgisi alınamıyor', 'Kurumsal güven oluşturamıyor', 'Toptan müşteri kaçırıyor', 'Rekabette geride kalıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#374151] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">📦</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Ambalaj Çözümünüz <span className="text-[#F59E0B]">Hazır</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz numune ve fiyat teklifi alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F59E0B] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-[#374151] shadow-xl transition-all hover:bg-[#FBBF24] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#374151]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '📦', title: 'Numune Gönderim', desc: 'Sipariş öncesi ücretsiz numune kargosu.' },
            { icon: '🖨️', title: 'Özel Baskı', desc: 'Logo ve görsel baskılı ambalaj üretimi.' },
            { icon: '🚛', title: 'Hızlı Teslimat', desc: 'Türkiye geneli 5-7 iş günü teslimat.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#374151]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#374151]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#374151]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
