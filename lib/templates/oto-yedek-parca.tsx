'use client'

import { Barlow, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const barlow = Barlow({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-barlow', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-source', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function OtoYedekParcaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const productImg = props.images?.product

  return (
    <div className={`${barlow.variable} ${sourceSans.variable} min-h-screen bg-[#1F2937] text-white`}>
      {/* ═══════════════════ HERO — Interlocking Gears: birbirine kenetlenen dişliler ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#1F2937]">
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
            {/* Large gear */}
            <circle cx="900" cy="350" r="150" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="30" strokeDasharray="20 15" />
            <circle cx="900" cy="350" r="100" fill="none" stroke="rgba(249,115,22,0.03)" strokeWidth="2" />
            {/* Small gear */}
            <circle cx="1060" cy="470" r="80" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="20" strokeDasharray="12 10" />
            <circle cx="1060" cy="470" r="50" fill="none" stroke="rgba(249,115,22,0.03)" strokeWidth="2" />
            {/* Center dots */}
            <circle cx="900" cy="350" r="8" fill="rgba(249,115,22,0.06)" />
            <circle cx="1060" cy="470" r="6" fill="rgba(249,115,22,0.06)" />
          </svg>
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} yedek parça`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1F2937]/90 via-[#1F2937]/65 to-[#1F2937]/40" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#F97316] bg-white/5 px-4 py-2">
                <span className="font-[family-name:var(--font-source)] text-xs font-600 uppercase tracking-[0.3em] text-[#F97316]">{props.city} &bull; Oto Yedek Parça</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow)] text-5xl font-800 uppercase leading-[1.05] sm:text-6xl lg:text-7xl">
                Doğru Parça
                <br /><span className="text-[#F97316]">Hızlı Teslimat</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-source)] text-lg leading-relaxed text-white/45">
                {props.firmName} — {suffixDe(props.city)} tüm marka araçlar için orijinal ve muadil yedek parça. Aynı gün teslimat.
              </motion.p>
              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['Motor', 'Fren', 'Süspansiyon', 'Elektrik', 'Kaporta', 'Filtre'].map((s) => (
                  <span key={s} className="border border-white/10 bg-white/5 px-4 py-2 font-[family-name:var(--font-barlow)] text-xs font-500 uppercase tracking-wider text-white/50">{s}</span>
                ))}
              </motion.div>
              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#EA580C] hover:shadow-lg hover:shadow-[#F97316]/25">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {[{ icon: '🔧', title: 'Orijinal Parça', desc: 'OEM kalite garanti' }, { icon: '🚚', title: 'Aynı Gün Teslimat', desc: 'Stoktan hızlı gönderim' }, { icon: '🏷️', title: 'Uygun Fiyat', desc: 'Toptan ve perakende' }, { icon: '🔍', title: 'Parça Sorgulama', desc: 'OEM kodu ile arama' }].map((item) => (
                <motion.div key={item.title} variants={fadeInUp} className="flex items-center gap-4 border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-[#F97316]/10 text-xl">{item.icon}</div>
                  <div><div className="font-[family-name:var(--font-barlow)] text-sm font-500 uppercase text-white/80">{item.title}</div><div className="font-[family-name:var(--font-source)] text-xs text-white/35">{item.desc}</div></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-source)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow)] text-3xl font-700 uppercase text-white sm:text-4xl">Yedek parça arayanlar <span className="text-red-400">online fiyat karşılaştırması</span> yapıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source)] text-lg text-white/45">Web siteniz yoksa müşteriler sizi bulamıyor.</motion.p>
        </motion.div>
      </div></section>

      <section className="bg-[#374151] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow)] text-3xl font-700 uppercase text-white sm:text-4xl">Web Siteniz <span className="text-[#F97316]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#F97316]/20 bg-[#F97316]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-barlow)] text-lg font-600 uppercase text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source)] text-sm text-white/60">
                {['Online parça sorgulama ile müşteri kazanırsınız', 'Stok listenizi güncel tutarsınız', 'Toptan fiyatlarla dikkat çekersiniz', 'Google\'da "yedek parça + şehir" aramasında çıkarsınız', 'Kargo ile şehir dışına satış yaparsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#F97316]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-barlow)] text-lg font-600 uppercase text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-source)] text-sm text-white/60">
                {['Müşteriler online mağazaları tercih eder', 'Stok bilginiz paylaşılamaz', 'Fiyat avantajınız bilinmez', 'Şehir dışı satış imkansız', 'Sadece dükkana gelenle sınırlı kalırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {productImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-white/10"><img src={productImg} alt={`${props.firmName} ürün`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#F97316] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow)] text-3xl font-700 uppercase text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-source)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 bg-[#1F2937] px-10 py-4 font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-wider text-white transition-all hover:bg-[#374151]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-barlow)] text-lg font-600 uppercase text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-source)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-source)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
