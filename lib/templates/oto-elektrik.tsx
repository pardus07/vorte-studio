'use client'

import { Chakra_Petch, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const chakra = Chakra_Petch({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-chakra', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function OtoElektrikTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const workshopImg = props.images?.workshop

  return (
    <div className={`${chakra.variable} ${inter.variable} min-h-screen bg-[#111827] text-white`}>
      {/* ═══════════════════ HERO — Circuit Traces + Lightning: devre yolları + yıldırım ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#111827]">
        {/* Circuit board traces */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
            {/* Horizontal traces */}
            <line x1="0" y1="250" x2="400" y2="250" stroke="rgba(251,191,36,0.06)" strokeWidth="2" />
            <line x1="400" y1="250" x2="400" y2="400" stroke="rgba(251,191,36,0.06)" strokeWidth="2" />
            <line x1="400" y1="400" x2="800" y2="400" stroke="rgba(251,191,36,0.06)" strokeWidth="2" />
            {/* Vertical traces */}
            <line x1="800" y1="400" x2="800" y2="550" stroke="rgba(251,191,36,0.05)" strokeWidth="2" />
            <line x1="800" y1="550" x2="1200" y2="550" stroke="rgba(251,191,36,0.04)" strokeWidth="2" />
            {/* Junction dots */}
            <circle cx="400" cy="250" r="4" fill="rgba(251,191,36,0.08)" />
            <circle cx="400" cy="400" r="4" fill="rgba(251,191,36,0.08)" />
            <circle cx="800" cy="400" r="4" fill="rgba(251,191,36,0.06)" />
            <circle cx="800" cy="550" r="4" fill="rgba(251,191,36,0.06)" />
          </svg>
        </div>

        {/* Lightning bolt accent */}
        <div className="pointer-events-none absolute right-[15%] top-[20%]">
          <svg width="60" height="100" viewBox="0 0 60 100" fill="none" style={{ opacity: 0.06 }}>
            <polygon points="35,0 10,45 28,45 20,100 50,40 32,40" fill="#FBBF24" />
          </svg>
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} oto elektrik`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/90 via-[#111827]/65 to-[#111827]/40" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#FBBF24] bg-[#FBBF24]/5 px-4 py-2">
                <span className="font-[family-name:var(--font-inter)] text-xs font-600 uppercase tracking-[0.3em] text-[#FBBF24]">
                  {props.city} &bull; Oto Elektrik
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-chakra)] text-5xl font-700 leading-[1.05] sm:text-6xl lg:text-7xl">
                Elektrik
                <br />
                <span className="text-[#FBBF24]">Arıza?</span>
                <br />
                Çözüm Burada
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-inter)] text-lg leading-relaxed text-white/45">
                {props.firmName} — {suffixDe(props.city)} oto elektrik arıza tespit, akü, marş, dinamü, beyin tamiri.
                Bilgisayarlı arıza tespit sistemi.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['Arıza Tespit', 'Akü', 'Marş-Dinamö', 'Far-Aydınlatma', 'Beyin Tamiri'].map((s) => (
                  <span key={s} className="border border-[#FBBF24]/15 bg-[#FBBF24]/5 px-4 py-2 font-[family-name:var(--font-chakra)] text-xs font-500 text-[#FBBF24]">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#FBBF24] px-8 py-4 font-[family-name:var(--font-chakra)] text-sm font-600 text-[#111827] transition-all hover:bg-[#F59E0B] hover:shadow-lg hover:shadow-[#FBBF24]/25">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Hizmet kartları */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {[{ icon: '🔌', title: 'Bilgisayarlı Arıza Tespit', desc: 'OBD2 ile hassas teşhis' }, { icon: '🔋', title: 'Akü Değişimi', desc: 'Tüm marka ve modeller' }, { icon: '💡', title: 'Far & Aydınlatma', desc: 'LED, Xenon, ayar' }, { icon: '⚡', title: 'Elektrik Tesisatı', desc: 'Kablo tamiri, sigorta' }].map((item) => (
                <motion.div key={item.title} variants={fadeInUp} className="flex items-center gap-4 border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#FBBF24]/10 text-xl">{item.icon}</div>
                  <div>
                    <div className="font-[family-name:var(--font-chakra)] text-sm font-500 text-white/80">{item.title}</div>
                    <div className="font-[family-name:var(--font-inter)] text-xs text-white/35">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-chakra)] text-3xl font-700 text-white sm:text-4xl">Oto elektrik arızasında <span className="text-red-400">acil çözüm arıyorlar</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-white/45">Web siteniz yoksa Google&apos;da çıkan rakibinize gidiyorlar.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#1F2937] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-chakra)] text-3xl font-700 text-white sm:text-4xl">Web Siteniz <span className="text-[#FBBF24]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-chakra)] text-lg font-600 text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-white/60">
                {['Acil arıza arayanlar sizi bulur', 'Hizmet listeniz güven oluşturur', 'Araç marka uyumluluğunuz görünür', 'Google\'da "oto elektrik + şehir" aramasında çıkarsınız', 'Online randevu ile iş planı yaparsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#FBBF24]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-chakra)] text-lg font-600 text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-white/60">
                {['Acil durumda müşteriler sizi bulamaz', 'Uzmanlık alanınız bilinmez', 'Fiyat bilginiz paylaşılamaz', 'Sadece tavsiye ile sınırlı kalırsınız', 'Profesyonel imaj oluşturulamaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {workshopImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-white/10"><img src={workshopImg} alt={`${props.firmName} atölye`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#FBBF24] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-chakra)] text-3xl font-700 text-[#111827] sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-[#111827]/60">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#111827] px-10 py-4 font-[family-name:var(--font-chakra)] text-sm font-600 text-white transition-all hover:bg-[#1F2937]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FBBF24]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-chakra)] text-lg font-600 text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-inter)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
