'use client'

import { Rajdhani, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rajdhani = Rajdhani({ subsets: ['latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source-sans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function GuvenlikSistemleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const projectImg = props.images?.project

  const systems = [
    { icon: '📹', name: 'Kamera Sistemleri', desc: 'IP & Analog CCTV' },
    { icon: '🚨', name: 'Alarm Sistemleri', desc: 'Hırsız & Yangın' },
    { icon: '🪪', name: 'Kartlı Geçiş', desc: 'Erişim Kontrolü' },
    { icon: '🔔', name: 'Kapı Telefonu', desc: 'Video İnterkom' },
  ]

  return (
    <div className={`${rajdhani.variable} ${sourceSans.variable} min-h-screen bg-[#0D1117] text-white`}>
      {/* ═══════════════════ HERO — Surveillance Monitor Grid: 2x2 CCTV ekran düzeni + matrix overlay ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0D1117]">
        {/* Matrix / digital rain overlay */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(220,38,38,0.03) 0px, transparent 2px, transparent 20px),
            repeating-linear-gradient(90deg, rgba(220,38,38,0.02) 0px, transparent 1px, transparent 40px)`,
        }} />

        {/* Scan line effect */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
        }} />

        {/* Corner status indicators — CCTV HUD */}
        <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#DC2626]" />
          <span className="font-[family-name:var(--font-rajdhani)] text-[10px] font-500 uppercase tracking-widest text-[#DC2626]/60">REC</span>
        </div>
        <div className="pointer-events-none absolute right-6 top-6">
          <span className="font-[family-name:var(--font-rajdhani)] text-[10px] font-500 text-white/20">CAM — 01</span>
        </div>

        {/* Hero bg */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} güvenlik`} className="h-full w-full object-cover" style={{ opacity: 0.3 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/50 via-[#0D1117]/60 to-[#0D1117]/90" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* Sol — metin */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-5 inline-flex items-center gap-3 border border-[#DC2626]/20 bg-[#DC2626]/5 px-4 py-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
                <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase tracking-[0.3em] text-[#DC2626]/70">
                  {props.city} &bull; Güvenlik Sistemleri
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-5xl font-700 leading-[1.05] sm:text-6xl lg:text-7xl">
                İşletmeniz
                <br />
                <span className="text-[#DC2626]">Güvende</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-white/45">
                {props.firmName} — {props.city}&apos;de kamera, alarm, kartlı geçiş ve tüm güvenlik çözümleri.
                Ücretsiz keşif, profesyonel montaj.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
                {['CCTV', 'Alarm', 'Kartlı Geçiş', 'İnterkom', 'Yangın Algılama'].map((s) => (
                  <span key={s} className="border border-white/10 bg-white/5 px-4 py-2 font-[family-name:var(--font-rajdhani)] text-xs font-500 uppercase tracking-wider text-white/50">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#DC2626] px-8 py-4 font-[family-name:var(--font-rajdhani)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#B91C1C] hover:shadow-lg hover:shadow-[#DC2626]/20">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — 2×2 Surveillance monitor grid */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {systems.map((sys, idx) => (
                  <div key={sys.name} className="group relative overflow-hidden border border-white/10 bg-[#161B22] p-5">
                    {/* Monitor HUD corners */}
                    <div className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#DC2626]/30" />
                    <div className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#DC2626]/30" />
                    <div className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#DC2626]/30" />
                    <div className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#DC2626]/30" />

                    {/* Cam number */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-[family-name:var(--font-rajdhani)] text-[10px] font-500 uppercase tracking-widest text-[#DC2626]/40">CAM-0{idx + 1}</span>
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DC2626]/60" />
                    </div>

                    <span className="text-2xl">{sys.icon}</span>
                    <div className="mt-2 font-[family-name:var(--font-rajdhani)] text-sm font-600 text-white/80">{sys.name}</div>
                    <div className="font-[family-name:var(--font-source-sans)] text-xs text-white/30">{sys.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source-sans)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 text-white sm:text-4xl">İşletmeler <span className="text-red-400">güvenlik firması</span> ararken web sitesi olan firmayı tercih ediyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-lg text-white/45">Web siteniz yoksa referanslarınızı, sertifikalarınızı ve sistem çeşitlerinizi gösteremezsiniz.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#161B22] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rajdhani)] text-3xl font-700 text-white sm:text-4xl">Web Siteniz <span className="text-[#DC2626]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#DC2626]/20 bg-[#DC2626]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-600 uppercase text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                {['Sistem çeşitleriniz ve markalarınız görünür', 'Referans projeler güven oluşturur', 'Ücretsiz keşif CTA ile teklif alırsınız', 'Google\'da "güvenlik kamera + şehir" aramasında çıkarsınız', 'Kurumsal imajınız rakiplerden ayrışır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#DC2626]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-600 uppercase text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                {['Teknik uzmanlığınızı gösteremezsiniz', 'Rakipler online güven farkı yaratır', 'Teklif talepleri size gelmez', 'Sertifika ve belgeleriniz görünmez', 'İş hacminiz sınırlı kalır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {projectImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-white/10"><img src={projectImg} alt={`${props.firmName} proje`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#DC2626] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-white/80">Ücretsiz keşif ve demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-white px-10 py-4 font-[family-name:var(--font-rajdhani)] text-sm font-600 uppercase tracking-wider text-[#DC2626] transition-all hover:bg-white/90">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#DC2626]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-lg font-600 text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source-sans)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
