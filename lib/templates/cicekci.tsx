'use client'

import { Playfair_Display, Nunito } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const playfair = Playfair_Display({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
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

export default function CicekciTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const bouquetImg = props.images?.bouquet

  return (
    <div className={`${playfair.variable} ${nunito.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Botanical Frame: çiçek köşe bordürleriyle çerçevelenmiş merkezi içerik ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#FDF2F8]">
        {/* Botanical corner decorations — SVG floral accents */}
        <div className="pointer-events-none absolute inset-0">
          {/* Top-left corner */}
          <svg className="absolute left-0 top-0 h-48 w-48 text-[#BE185D]/10" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="30" cy="30" r="20" />
            <circle cx="60" cy="15" r="12" />
            <circle cx="15" cy="60" r="12" />
            <circle cx="50" cy="50" r="8" />
            <ellipse cx="80" cy="35" rx="15" ry="8" transform="rotate(-30 80 35)" />
            <ellipse cx="35" cy="80" rx="15" ry="8" transform="rotate(60 35 80)" />
          </svg>
          {/* Top-right corner */}
          <svg className="absolute right-0 top-0 h-48 w-48 text-[#15803D]/10" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="170" cy="30" r="20" />
            <circle cx="140" cy="15" r="12" />
            <circle cx="185" cy="60" r="12" />
            <circle cx="150" cy="50" r="8" />
            <ellipse cx="120" cy="35" rx="15" ry="8" transform="rotate(30 120 35)" />
          </svg>
          {/* Bottom-left corner */}
          <svg className="absolute bottom-0 left-0 h-48 w-48 text-[#15803D]/8" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="30" cy="170" r="20" />
            <circle cx="60" cy="185" r="12" />
            <circle cx="15" cy="140" r="12" />
            <ellipse cx="70" cy="160" rx="15" ry="8" transform="rotate(20 70 160)" />
          </svg>
          {/* Bottom-right corner */}
          <svg className="absolute bottom-0 right-0 h-48 w-48 text-[#BE185D]/8" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="170" cy="170" r="20" />
            <circle cx="140" cy="185" r="12" />
            <circle cx="185" cy="140" r="12" />
            <ellipse cx="150" cy="155" rx="12" ry="6" transform="rotate(-20 150 155)" />
          </svg>
        </div>

        {/* Soft radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(190,24,93,0.04) 0%, transparent 60%)',
        }} />

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            {/* Floral line divider */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#BE185D]/30" />
              <span className="text-2xl">🌸</span>
              <div className="h-px w-16 bg-[#BE185D]/30" />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <span className="font-[family-name:var(--font-nunito)] text-xs font-600 uppercase tracking-[0.4em] text-[#BE185D]/70">
                {props.city} &bull; Çiçekçi
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-4xl font-700 italic leading-[1.15] text-[#1C1917] sm:text-5xl lg:text-7xl">
              Her Duygu İçin
              <br />
              <span className="text-[#BE185D]">Doğru Çiçek</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-nunito)] text-lg leading-relaxed text-[#78716C]">
              {props.firmName} — {props.city}&apos;de sevdiklerinize en taze çiçeklerle
              duygularınızı ifade edin. Aynı gün teslimat!
            </motion.p>

            {/* Hero image — framed with pink border */}
            {heroImg && (
              <motion.div variants={scaleIn} className="mx-auto mt-8 max-w-md">
                <div className="relative rounded-2xl border-4 border-[#BE185D]/10 p-2">
                  <img src={heroImg} alt={`${props.firmName} çiçek`} className="w-full rounded-xl object-cover" style={{ aspectRatio: '4/3' }} />
                </div>
              </motion.div>
            )}

            {/* Occasion tags */}
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-3">
              {['💐 Doğum Günü', '💝 Sevgiliye', '🌹 Açılış', '🕊️ Taziye', '🎉 Kutlama'].map((tag) => (
                <span key={tag} className="rounded-full bg-white/80 px-4 py-2 font-[family-name:var(--font-nunito)] text-sm font-500 text-[#57534E] shadow-sm">
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 rounded-full bg-[#BE185D] px-8 py-4 font-[family-name:var(--font-nunito)] text-sm font-600 text-white shadow-lg shadow-[#BE185D]/20 transition-all hover:bg-[#9D174D] hover:shadow-xl"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-nunito)] text-sm font-600 text-red-700">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-3xl font-700 text-[#1C1917] sm:text-4xl">
              Çiçek siparişi verenler <span className="text-red-600">hızlı teslimat</span> arıyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-lg text-[#78716C]">
              Web siteniz yoksa online sipariş veremiyorlar.
              Müşterileriniz online siparişi olan rakiplerinize gidiyor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#FDF8FC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl font-700 text-[#1C1917] sm:text-4xl">
              Web Siteniz <span className="text-[#BE185D]">Olursa</span> / <span className="text-red-500">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#BE185D]/10 bg-white p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-lg font-700 text-[#1C1917]">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-sm text-[#57534E]">
                  {['Online sipariş ile 7/24 satış yaparsınız', 'Google\'da "çiçek + şehir" aramasında çıkarsınız', 'Buket kataloğunu fotoğraflarla sergilersiniz', 'Aynı gün teslimat bilgisi güven oluşturur', 'Özel gün hatırlatmalarıyla sadık müşteri kazanırsınız'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#BE185D]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-lg font-700 text-[#1C1917]">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-sm text-[#57534E]">
                  {['Online sipariş alamazsınız', 'Müşteriler buketlerinizi göremez', 'Aynı gün teslimat fırsatını sunamazsınız', 'Sadece mağaza trafiğine bağımlı kalırsınız', 'Özel günlerde talep patlamasına yetişemezsiniz'].map((item) => (
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

      {/* ═══════════════════ BUKET GÖRSELİ ═══════════════════ */}
      {bouquetImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl">
              <img src={bouquetImg} alt={`${props.firmName} buketler`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#BE185D] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-3xl font-700 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#FBCFE8]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-white/70">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 font-[family-name:var(--font-nunito)] text-sm font-600 text-[#BE185D] transition-all hover:bg-[#FDF2F8]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#BE185D]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-lg font-700 text-[#1C1917]">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-nunito)] text-sm text-[#78716C]">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#F3E8F0] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-nunito)] text-xs text-[#A8A29E]">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
