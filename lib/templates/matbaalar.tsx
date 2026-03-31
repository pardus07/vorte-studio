'use client'

import { Oswald, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
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

/* CMYK color bands — matbaa sektörünün DNA'sı */
const CMYK = ['#00AEEF', '#EC008C', '#FFF200', '#1C1917'] as const

export default function MatbaalarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const productsImg = props.images?.products
  const printImg = props.images?.print

  return (
    <div className={`${oswald.variable} ${dmSans.variable} min-h-screen bg-[#FAFAF8] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Full-Width CMYK Gradient + Centered Text Overlay ═══════════════════ */}
      {/* BU HERO: grid-cols-2 DEĞİL — merkezi metin, CMYK bantlar, arka planda büyük tipografi */}
      <section className="relative overflow-hidden bg-[#1C1917] pb-24 pt-20 text-white">
        {/* CMYK horizontal bands at top */}
        <div className="absolute left-0 right-0 top-0 flex h-2">
          {CMYK.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        {/* Hero background image — düşük opacity ile arka planda */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt="" className="h-full w-full object-cover" style={{ opacity: 0.12 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-[#1C1917]/50" />
          </div>
        )}

        {/* Giant background brand name — müşteri markası watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="whitespace-nowrap font-[family-name:var(--font-oswald)] text-[18vw] font-700 uppercase leading-none text-white/[0.03]">
            {props.firmName}
          </span>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            {/* CMYK dot badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3">
              <div className="flex gap-1.5">
                {CMYK.map((color, i) => (
                  <div key={i} className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-500 uppercase tracking-[0.3em] text-white/60">
                Baskı & Matbaa
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-7xl lg:text-8xl">
              Fikirlerinizi
              <br />
              <span className="bg-gradient-to-r from-[#00AEEF] via-[#EC008C] to-[#FFF200] bg-clip-text text-transparent">
                Kağıda Döküyoruz
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-dm-sans)] text-lg leading-relaxed text-white/60">
              <strong className="text-white">{props.firmName}</strong> — kartvizit, broşür, afiş, katalog ve
              kurumsal baskı çözümleri. {props.city} genelinde hızlı üretim, kaliteli baskı.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center gap-3 bg-[#DC2626] px-8 py-4 font-[family-name:var(--font-oswald)] text-base font-600 uppercase tracking-wider text-white shadow-lg shadow-[#DC2626]/20 transition-all hover:bg-[#B91C1C] hover:shadow-xl"
              >
                Ücretsiz Teklif Al
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

            {(props.googleRating || props.googleReviews) && (
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <div className="flex gap-0.5 text-[#FFF200]">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <span className="font-[family-name:var(--font-dm-sans)] text-sm text-white/60">
                  {props.googleRating} ({props.googleReviews}+ yorum)
                </span>
              </motion.div>
            )}

            {/* Product category cards — hero'nun bir parçası, ayrı section değil */}
            <motion.div variants={fadeInUp} className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: '🪪', label: 'Kartvizit' },
                { icon: '📄', label: 'Broşür' },
                { icon: '📋', label: 'Katalog' },
                { icon: '🖼️', label: 'Afiş' },
              ].map((item, i) => (
                <div key={i} className="border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
                  <div className="text-2xl">{item.icon}</div>
                  <span className="mt-1 block font-[family-name:var(--font-dm-sans)] text-xs font-600 uppercase tracking-wider text-white/70">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* CMYK bands at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex h-2">
          {CMYK.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#DC2626] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Kurumsal Baskı Arayanlar
            <br />
            <span className="text-[#DC2626]">Fiyat ve Süre Bilgisi İstiyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-dm-sans)] text-lg text-[#1C1917]/60">
            Kurumsal baskı ihtiyacı olanların <strong className="text-[#1C1917]">%67&apos;si</strong> online fiyat
            karşılaştırması yapıyor. Web siteniz yoksa teklif bile alamıyorlar.
          </motion.p>

          {productsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#DC2626]/20">
              <img src={productsImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🖨️', stat: '%67', text: 'Online araştırıyor' },
              { emoji: '⏱️', stat: '24 Saat', text: 'Acil baskı ihtiyacı' },
              { emoji: '📦', stat: '%45', text: 'Toptan sipariş veriyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#1C1917]/10 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#DC2626]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[#1C1917]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F5F5F0] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#DC2626]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Matbaalar
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#DC2626]/20 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#DC2626]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-dm-sans)] text-[#1C1917]/70">
                {['Ürün kataloğu online erişilebilir', 'Anında fiyat teklifi alınıyor', 'Dosya yükleme ile kolay sipariş', 'Google\'da "matbaa" aramasında çıkıyor', 'Kurumsal müşteriler güveniyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#DC2626]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-dm-sans)] text-[#1C1917]/30">
                {['Ürün çeşitleri bilinmiyor', 'Fiyat bilgisi alınamıyor', 'Sadece yerinde sipariş', 'Online aramalarda görünmüyor', 'Kurumsal talepler kaçırılıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ ÜRÜN GALERİ — hero'da olmayan 3. görsel alanı ═══════════════════ */}
      {printImg && (
        <section className="py-16">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.h3 variants={fadeInUp} className="mb-6 text-center font-[family-name:var(--font-oswald)] text-2xl font-700 uppercase">
              Baskı <span className="text-[#DC2626]">Kalitemiz</span>
            </motion.h3>
            <motion.div variants={scaleIn} className="overflow-hidden">
              <img src={printImg} alt={`${props.firmName} baskı kalitesi`} className="w-full object-cover" style={{ maxHeight: '320px' }} />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1C1917] py-24 text-white">
        <div className="absolute left-0 right-0 top-0 flex h-1">
          {CMYK.map((color, i) => <div key={i} className="flex-1" style={{ backgroundColor: color }} />)}
        </div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🖨️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Baskı İhtiyacınız <span className="text-[#DC2626]">Tek Adreste</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-dm-sans)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz fiyat teklifi alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#DC2626] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-white shadow-xl shadow-[#DC2626]/20 transition-all hover:bg-[#B91C1C] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1C1917]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '⚡', title: 'Hızlı Üretim', desc: 'Acil siparişlerde aynı gün baskı ve teslimat.' },
            { icon: '🎨', title: 'Renk Garantisi', desc: 'CMYK kalibrasyon ile birebir renk eşlemesi.' },
            { icon: '📦', title: 'Toptan Fiyat', desc: 'Yüksek adetlerde özel kurumsal fiyatlandırma.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#1C1917]/10 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-[#DC2626]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1C1917]/10 py-8 text-center font-[family-name:var(--font-dm-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
