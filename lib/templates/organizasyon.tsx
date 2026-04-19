'use client'

import { Cormorant_Garamond, Jost } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-cormorant', display: 'swap' })
const jost = Jost({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-jost', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function OrganizasyonTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const eventImg = props.images?.event

  return (
    <div className={`${cormorant.variable} ${jost.variable} min-h-screen bg-[#0A0A0A] text-white`}>
      {/* ═══════════════════ HERO — Theatrical Spotlight: sahne spot ışıkları + altın elegans ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Spotlight cones — theatrical feel */}
        <div className="pointer-events-none absolute inset-0">
          {/* Center spotlight */}
          <div className="absolute left-1/2 top-0 h-[80%] w-[300px] -translate-x-1/2" style={{
            background: 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 60%, transparent 100%)',
            clipPath: 'polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)',
          }} />
          {/* Left spotlight */}
          <div className="absolute left-[15%] top-0 h-[60%] w-[200px]" style={{
            background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)',
          }} />
          {/* Right spotlight */}
          <div className="absolute right-[15%] top-0 h-[60%] w-[200px]" style={{
            background: 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)',
          }} />
        </div>

        {/* Curtain edge lines */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/20 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/20 to-transparent" />

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} organizasyon`} className="h-full w-full object-cover" style={{ opacity: 0.85 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/50 to-[#0A0A0A]/90" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3">
              <div className="h-px w-16 bg-[#D4AF37]/40" />
              <span className="font-[family-name:var(--font-jost)] text-xs font-400 uppercase tracking-[0.5em] text-[#D4AF37]/60">
                {props.city} &bull; Organizasyon
              </span>
              <div className="h-px w-16 bg-[#D4AF37]/40" />
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-5xl font-700 italic leading-[1.05] sm:text-6xl lg:text-7xl">
              Unutulmaz
              <br />
              <span className="text-[#D4AF37]">Etkinlikler</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-jost)] text-lg leading-relaxed text-white/40">
              {props.firmName} — {suffixDe(props.city)} düğün, nişan, kına gecesi, kurumsal etkinlik
              ve özel gün organizasyonu. Hayalinizdeki etkinliği gerçeğe dönüştürüyoruz.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {['Düğün', 'Nişan', 'Kına', 'Kurumsal', 'Doğum Günü'].map((s) => (
                <span key={s} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-2 font-[family-name:var(--font-jost)] text-xs font-400 uppercase tracking-wider text-[#D4AF37]/70">{s}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-transparent hover:text-[#D4AF37]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-jost)] text-sm font-500 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic text-white sm:text-4xl">Organizasyon firması arayanlar <span className="text-red-400">referans ve fiyat</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-jost)] text-lg text-white/40">Web siteniz yoksa geçmiş etkinliklerinizi gösteremezsiniz, güven oluşturmak zorlaşır.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#111111] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 italic text-white sm:text-4xl">Web Siteniz <span className="text-[#D4AF37]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-jost)] text-sm text-white/60">
                {['Geçmiş etkinlik fotoğrafları güven verir', 'Paket seçenekleri karşılaştırılabilir', 'Ücretsiz planlama görüşmesi CTA müşteri çeker', 'Google\'da "düğün organizasyon + şehir" aramasında çıkarsınız', 'Referanslar ile rakiplerden ayrışırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#D4AF37]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-jost)] text-sm text-white/60">
                {['Etkinlik portfolyonuz görünmez', 'Fiyat ve paket bilgisi paylaşılamaz', 'Karar aşamasında elenirsiniz', 'Referanslar sosyal medyayla sınırlı kalır', 'Profesyonel algı zayıflar'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {eventImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-[#D4AF37]/10"><img src={eventImg} alt={`${props.firmName} etkinlik`} className="w-full object-cover" style={{ aspectRatio: '16/9' }} /></motion.div></div></section>)}

      <section className="bg-[#D4AF37] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic text-[#0A0A0A] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-jost)] text-[#0A0A0A]/70">Ücretsiz planlama görüşmesi — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#0A0A0A] px-10 py-4 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-wider text-white transition-all hover:bg-[#1a1a1a]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-lg font-700 italic text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-jost)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-jost)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
