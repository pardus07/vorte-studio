'use client'

import { Tenor_Sans, Karla } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const tenorSans = Tenor_Sans({
  subsets: ['latin-ext'],
  weight: ['400'],
  variable: '--font-tenor',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-karla',
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

export default function TekstilGiyimTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const lookbookImg = props.images?.lookbook

  return (
    <div className={`${tenorSans.variable} ${karla.variable} min-h-screen bg-[#1C1917] text-white`}>
      {/* ═══════════════════ HERO — Runway Lookbook: full-bleed bg + dikey merkezi text stack ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Full-bleed background image with dark overlay */}
        {heroImg ? (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} moda`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/70 via-[#1C1917]/50 to-[#1C1917]/90" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917]" />
        )}

        {/* Fashion grid lines — subtle runway aesthetic */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[20%] top-0 h-full w-px bg-white/[0.03]" />
          <div className="absolute left-[50%] top-0 h-full w-px bg-white/[0.03]" />
          <div className="absolute left-[80%] top-0 h-full w-px bg-white/[0.03]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            {/* Season tag */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[#F59E0B]" />
              <span className="font-[family-name:var(--font-karla)] text-xs font-600 uppercase tracking-[0.5em] text-[#F59E0B]">
                {props.city} &bull; Moda & Giyim
              </span>
              <div className="h-px w-12 bg-[#F59E0B]" />
            </motion.div>

            {/* Big vertical text stack — editorial */}
            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-tenor)] text-5xl uppercase leading-[1.1] tracking-wide sm:text-6xl lg:text-8xl">
              Tarzınızı
              <br />
              <span className="text-[#F59E0B]">Yansıtın</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-md font-[family-name:var(--font-karla)] text-lg leading-relaxed text-white/50">
              {props.firmName} — {props.city}&apos;de trend koleksiyonlar ve
              her tarza uygun giyim seçenekleri.
            </motion.p>

            {/* Category tags — minimal fashion style */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              {['Kadın', 'Erkek', 'Çocuk', 'Aksesuar'].map((cat) => (
                <span key={cat} className="border border-white/20 px-6 py-2 font-[family-name:var(--font-karla)] text-xs font-500 uppercase tracking-[0.3em] text-white/70 transition-all hover:border-[#F59E0B] hover:text-[#F59E0B]">
                  {cat}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-[#1C1917] transition-all hover:bg-[#D97706]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 bg-[#1C1917] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-karla)] text-sm font-600 text-red-400">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-tenor)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
              Giyim arayanlar önce <span className="text-red-400">online katalog</span> geziyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-karla)] text-lg text-white/50">
              Koleksiyonunuz web sitenizde yoksa müşteriler mağazanıza gelmek için motivasyon bulamıyor.
              Online varlığınız olmazsa sadece kaldırımdan geçenlere satarsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#292524] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-tenor)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
              Web Siteniz <span className="text-[#F59E0B]">Olursa</span> / <span className="text-red-400">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-tenor)] text-lg text-white">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-karla)] text-sm text-white/70">
                  {['Koleksiyonunuz 7/24 online vitrine çıkar', 'Google\'da "giyim + şehir" aramasında çıkarsınız', 'Beden tablosu ve ürün detayları güven oluşturur', 'WhatsApp sipariş alırsınız', 'Kampanya ve indirimler anında ulaşır'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#F59E0B]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-tenor)] text-lg text-white">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-karla)] text-sm text-white/70">
                  {['Müşteriler koleksiyonunuzu göremez', 'Online mağazalara müşteri kaptırırsınız', 'Beden bilgisi paylaşamazsınız', 'Kampanya duyuruları ulaşmaz', 'Marka bilinirliğiniz gelişmez'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ LOOKBOOK GÖRSELİ ═══════════════════ */}
      {lookbookImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden">
              <img src={lookbookImg} alt={`${props.firmName} lookbook`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#F59E0B] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-tenor)] text-3xl uppercase tracking-wide text-[#1C1917] sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#78350F]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-karla)] text-[#1C1917]/70">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 bg-[#1C1917] px-10 py-4 font-[family-name:var(--font-karla)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#292524]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="bg-[#1C1917] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F59E0B]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-tenor)] text-lg uppercase tracking-wide text-white">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-karla)] text-sm text-white/40">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-white/5 bg-[#1C1917] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-karla)] text-xs text-white/30">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
