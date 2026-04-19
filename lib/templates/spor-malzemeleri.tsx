'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow-cd',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
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

export default function SporMalzemeleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const productImg = props.images?.product

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#111111] text-white`}>
      {/* ═══════════════════ HERO — Dynamic Slash Overlay: çapraz enerji çizgileri + bold uppercase ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Dynamic slash lines — energy / motion feel */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
            <line x1="300" y1="0" x2="0" y2="900" stroke="rgba(249,115,22,0.06)" strokeWidth="2" />
            <line x1="600" y1="0" x2="300" y2="900" stroke="rgba(249,115,22,0.04)" strokeWidth="1.5" />
            <line x1="900" y1="0" x2="600" y2="900" stroke="rgba(249,115,22,0.06)" strokeWidth="2" />
            <line x1="1200" y1="0" x2="900" y2="900" stroke="rgba(249,115,22,0.04)" strokeWidth="1.5" />
            <line x1="1440" y1="0" x2="1140" y2="900" stroke="rgba(249,115,22,0.03)" strokeWidth="1" />
          </svg>
        </div>

        {/* Hero bg image */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} spor`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-[#0A0A0A]/30" />
          </div>
        )}

        {/* Orange energy gradient — bottom accent */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F97316] to-transparent" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full lg:w-7/12">
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#F97316] bg-white/5 px-4 py-2">
              <span className="font-[family-name:var(--font-barlow)] text-xs font-500 uppercase tracking-[0.3em] text-[#F97316]">
                {props.city} &bull; Spor Malzemeleri
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-5xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              Performansınızı
              <br />
              <span className="text-[#F97316]">Artırın</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 max-w-md font-[family-name:var(--font-barlow)] text-lg leading-relaxed text-white/60">
              {props.firmName} — {suffixDe(props.city)} spor ekipmanları, giyim ve aksesuar.
              Uzman kadromuzla doğru ürünü seçmenize yardımcı oluyoruz.
            </motion.p>

            {/* Sport category tags */}
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              {['Fitness', 'Koşu', 'Futbol', 'Outdoor', 'Bisiklet', 'Yüzme'].map((cat) => (
                <span key={cat} className="border border-white/10 px-4 py-2 font-[family-name:var(--font-barlow-cd)] text-xs font-600 uppercase tracking-wider text-white/60 transition-colors hover:border-[#F97316]/50 hover:text-[#F97316]">
                  {cat}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-barlow-cd)] text-sm font-700 uppercase tracking-wider text-white transition-all hover:bg-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/25">
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-barlow)] text-sm font-600 text-red-400">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-3xl font-800 uppercase text-white sm:text-4xl">
              Spor ürünü arayanlar <span className="text-red-400">online fiyat karşılaştırıyor</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow)] text-lg text-white/50">
              Ürünleriniz ve fiyatlarınız web sitenizde yoksa müşteriler online mağazalara kayıyor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-cd)] text-3xl font-800 uppercase text-white sm:text-4xl">
              Web Siteniz <span className="text-[#F97316]">Olursa</span> / <span className="text-red-400">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-xl border border-[#F97316]/20 bg-[#F97316]/5 p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-barlow-cd)] text-lg font-700 uppercase text-white">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-sm text-white/70">
                  {['Ürün kataloğu 7/24 erişilebilir', 'Google\'da "spor mağazası + şehir" aramasında çıkarsınız', 'Marka çeşitliliğiniz görünür olur', 'Online sipariş/rezervasyon alırsınız', 'Uzman önerisi ile güven oluşturursunuz'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#F97316]">●</span> {i}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-xl border border-red-500/20 bg-red-500/5 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-barlow-cd)] text-lg font-700 uppercase text-white">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-sm text-white/70">
                  {['Müşteriler ürünlerinizi göremez', 'Online mağazalara müşteri kaptırırsınız', 'Fiyat karşılaştırmasında yer almazsınız', 'Kampanyalarınız duyulmaz', 'Marka bilinirliğiniz gelişmez'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {productImg && (
        <section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-xl border border-white/10">
            <img src={productImg} alt={`${props.firmName} ürünler`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
          </motion.div>
        </div></section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#F97316] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-3xl font-800 uppercase text-white sm:text-4xl">
              {props.firmName} İçin<br /><span className="text-[#0A0A0A]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow)] text-white/80">Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.</motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#0A0A0A] px-10 py-4 font-[family-name:var(--font-barlow-cd)] text-sm font-700 uppercase tracking-wider text-white transition-all hover:bg-[#1A1A1A]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10"><span className="text-2xl">🔒</span></motion.div>
          <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-lg font-700 uppercase text-white">Taahhüt Yok, Risk Yok</motion.h3>
          <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-white/40">Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.</motion.p>
        </motion.div>
      </div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="font-[family-name:var(--font-barlow)] text-xs text-white/30">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p>
      </div></footer>
    </div>
  )
}
