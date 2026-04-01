'use client'

import { Oswald, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-oswald', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source-sans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function NakliyatTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#0F172A] text-white`}>
      {/* ═══════════════════ HERO — Road Path + Arrows: yol çizgisi + yön okları + güçlü hareket hissi ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0F172A]">
        {/* Road lines — directional movement */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
            {/* Center dashed road line */}
            <line x1="0" y1="450" x2="1440" y2="450" stroke="rgba(249,115,22,0.08)" strokeWidth="3" strokeDasharray="40 30" />
            {/* Direction arrows */}
            <polygon points="1200,430 1240,450 1200,470" fill="rgba(249,115,22,0.06)" />
            <polygon points="1000,430 1040,450 1000,470" fill="rgba(249,115,22,0.04)" />
            <polygon points="800,430 840,450 800,470" fill="rgba(249,115,22,0.03)" />
          </svg>
        </div>

        {/* Speed blur lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-[30%] h-px w-[400px] bg-gradient-to-r from-[#F97316]/10 to-transparent" />
          <div className="absolute left-0 top-[50%] h-px w-[600px] bg-gradient-to-r from-[#F97316]/15 to-transparent" />
          <div className="absolute left-0 top-[70%] h-px w-[350px] bg-gradient-to-r from-[#F97316]/08 to-transparent" />
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} nakliyat`} className="h-full w-full object-cover" style={{ opacity: 0.3 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]/40" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#F97316] bg-white/5 px-4 py-2">
                <span className="font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase tracking-[0.3em] text-[#F97316]">
                  {props.city} &bull; Nakliyat
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-[1.05] sm:text-6xl lg:text-7xl">
                Taşınma
                <br />
                <span className="text-[#F97316]">Stressiz</span>
                <br />
                Olabilir
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-source-sans)] text-lg leading-relaxed text-white/45">
                {props.firmName} — {props.city}&apos;de evden eve, ofis ve şehirlerarası nakliyat.
                Sigortalı taşıma, profesyonel paketleme.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['Evden Eve', 'Ofis', 'Şehirlerarası', 'Paketleme', 'Sigortalı'].map((s) => (
                  <span key={s} className="border border-white/10 bg-white/5 px-4 py-2 font-[family-name:var(--font-oswald)] text-xs font-500 uppercase tracking-wider text-white/50">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/25">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Servis kartları */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {[{ icon: '📦', title: 'Profesyonel Paketleme', desc: 'Eşyalarınız özenle paketlenir' }, { icon: '🛡️', title: 'Sigortalı Taşıma', desc: 'Tam kapsamlı sigorta garantisi' }, { icon: '🚛', title: 'Geniş Araç Filosu', desc: 'Her boyut taşınma için uygun araç' }, { icon: '⏰', title: 'Zamanında Teslim', desc: 'Planlanan saatte kapınızdayız' }].map((item) => (
                <motion.div key={item.title} variants={fadeInUp} className="flex items-center gap-4 border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#F97316]/10 text-xl">{item.icon}</div>
                  <div>
                    <div className="font-[family-name:var(--font-oswald)] text-sm font-500 uppercase text-white/80">{item.title}</div>
                    <div className="font-[family-name:var(--font-source-sans)] text-xs text-white/35">{item.desc}</div>
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
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source-sans)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-white sm:text-4xl">Taşınma planlayanlar <span className="text-red-400">fiyat teklifi ve referans</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-lg text-white/45">Web siteniz yoksa rakibinizden teklif alıyorlar.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#1E293B] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-white sm:text-4xl">Web Siteniz <span className="text-[#F97316]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F97316]/20 bg-[#F97316]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                {['Online fiyat teklifi formu ile müşteri kazanırsınız', 'Araç filonuzu ve hizmet alanınızı gösterirsiniz', 'Referanslar ve sigorta bilgisi güven oluşturur', 'Google\'da "nakliyat + şehir" aramasında çıkarsınız', 'Paketleme hizmeti satışı artar'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#F97316]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-sm text-white/60">
                {['Müşteriler rakibe yönelir', 'Sigorta bilginiz bilinmez', 'Fiyat teklifi almak zorlaşır', 'Hizmet alanınız sınırlı görünür', 'Profesyonel imaj oluşturulamaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-white/10"><img src={serviceImg} alt={`${props.firmName} hizmet`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#F97316] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source-sans)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#0F172A] px-10 py-4 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#1E293B]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source-sans)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
