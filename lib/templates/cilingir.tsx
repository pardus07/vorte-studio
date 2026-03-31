'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700', '800'], variable: '--font-barlow-cd', display: 'swap' })
const barlow = Barlow({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-barlow', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function CilingirTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#1C1917] text-white`}>
      {/* ═══════════════════ HERO — Bold Emergency Centered: devasa "15 dk" + amber flash lines ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#1C1917]">
        {/* Radial amber flash — acil müdahale enerjisi */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B]/5 blur-[180px]" />
          <div className="absolute left-1/2 top-1/3 h-40 w-[500px] -translate-x-1/2 bg-[#F59E0B]/3 blur-[100px]" />
        </div>

        {/* Diagonal speed lines — urgency feel */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-[15%] h-px w-[300px] rotate-[25deg] bg-gradient-to-r from-transparent via-[#F59E0B]/15 to-transparent" />
          <div className="absolute -right-20 top-[35%] h-px w-[250px] -rotate-[25deg] bg-gradient-to-r from-transparent via-[#F59E0B]/10 to-transparent" />
          <div className="absolute -left-10 top-[65%] h-px w-[200px] rotate-[25deg] bg-gradient-to-r from-transparent via-[#F59E0B]/12 to-transparent" />
          <div className="absolute -right-10 top-[80%] h-px w-[280px] -rotate-[25deg] bg-gradient-to-r from-transparent via-[#F59E0B]/8 to-transparent" />
        </div>

        {/* Hero bg */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} çilingir`} className="h-full w-full object-cover" style={{ opacity: 0.3 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/40 via-[#1C1917]/50 to-[#1C1917]/90" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            {/* 7/24 pulsing badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-6 py-2.5">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#F59E0B]" />
              <span className="font-[family-name:var(--font-barlow-cd)] text-sm font-700 uppercase tracking-[0.3em] text-[#F59E0B]">7/24 Acil Çilingir</span>
            </motion.div>

            {/* Devasa süre — en dikkat çekici eleman */}
            <motion.div variants={scaleIn} className="relative">
              <div className="font-[family-name:var(--font-barlow-cd)] text-[120px] font-800 leading-none text-[#F59E0B] sm:text-[160px] lg:text-[200px]" style={{ opacity: 0.12 }}>
                15
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-[family-name:var(--font-barlow-cd)] text-6xl font-800 text-[#F59E0B] sm:text-7xl lg:text-8xl">15 dk</span>
                <span className="mt-1 font-[family-name:var(--font-barlow)] text-sm font-500 uppercase tracking-[0.4em] text-white/40">ortalama varış süresi</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-4xl font-700 uppercase leading-tight sm:text-5xl lg:text-6xl">
              Kapınız Kilitli mi?
              <br />
              <span className="text-[#F59E0B]">Hemen Geliyoruz</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-barlow)] text-lg leading-relaxed text-white/45">
              {props.firmName} — {props.city}&apos;de ev, iş yeri ve araç çilingir hizmeti.
              Hasarsız açma garantisi, şeffaf fiyat.
            </motion.p>

            {/* Service badges */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {['Ev Kapısı', 'İş Yeri', 'Araç Kapısı', 'Kasa Açma', 'Kilit Değişimi'].map((s) => (
                <span key={s} className="border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-4 py-2 font-[family-name:var(--font-barlow-cd)] text-xs font-600 uppercase tracking-wider text-[#F59E0B]/70">{s}</span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-barlow-cd)] text-sm font-700 uppercase tracking-wider text-[#1C1917] transition-all hover:bg-[#D97706] hover:shadow-lg hover:shadow-[#F59E0B]/25">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-barlow)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-3xl font-700 uppercase text-white sm:text-4xl">Kapısına kilitli kalan herkes <span className="text-red-400">acil çilingir</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow)] text-lg text-white/45">İlk sırada olmazsanız rakibinizi arıyorlar. Web siteniz yoksa o aramada yoksunuz.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#292524] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-cd)] text-3xl font-700 uppercase text-white sm:text-4xl">Web Siteniz <span className="text-[#F59E0B]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-barlow-cd)] text-lg font-600 uppercase text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-sm text-white/60">
                {['Google\'da "çilingir + şehir" aramasında çıkarsınız', 'Hizmet bölgesi ve fiyat listesi güven verir', '7/24 acil CTA ile anında çağrı alırsınız', 'Araç çilingirlik hizmeti de tanıtılır', 'Referanslar ile rakiplerden ayrışırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#F59E0B]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-xl border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-barlow-cd)] text-lg font-600 uppercase text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-sm text-white/60">
                {['Acil çağrılar rakibinize gider', 'Fiyat şeffaflığı olmadan güven kaybolur', 'Hizmet bölgenizi gösteremezsiniz', 'Google\'da görünmezsiniz', 'Profesyonel imaj oluşturamazsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-xl border border-white/10"><img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#F59E0B] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-3xl font-700 uppercase text-[#1C1917] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow)] text-[#1C1917]/70">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#1C1917] px-10 py-4 font-[family-name:var(--font-barlow-cd)] text-sm font-700 uppercase tracking-wider text-white transition-all hover:bg-[#292524]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F59E0B]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-barlow-cd)] text-lg font-600 uppercase text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-barlow)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
