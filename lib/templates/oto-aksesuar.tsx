'use client'

import { Outfit, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const outfit = Outfit({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-outfit', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-dm', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function OtoAksesuarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const productImg = props.images?.product

  return (
    <div className={`${outfit.variable} ${dmSans.variable} min-h-screen bg-[#0F0F0F] text-white`}>
      {/* ═══════════════════ HERO — Neon Car Silhouette: araç silüeti + neon accent çizgiler ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0F0F0F]">
        {/* Neon glow lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[40%] h-px w-[300px] bg-gradient-to-r from-[#8B5CF6]/20 to-transparent" />
          <div className="absolute right-[5%] top-[30%] h-px w-[250px] bg-gradient-to-l from-[#8B5CF6]/15 to-transparent" />
          <div className="absolute bottom-[35%] left-[20%] h-px w-[400px] bg-gradient-to-r from-transparent via-[#8B5CF6]/10 to-transparent" />
          {/* Neon corner accent */}
          <div className="absolute right-[10%] top-[15%] h-32 w-32 rounded-full bg-[#8B5CF6]/3 blur-3xl" />
          <div className="absolute bottom-[20%] left-[5%] h-24 w-24 rounded-full bg-[#8B5CF6]/3 blur-2xl" />
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} oto aksesuar`} className="h-full w-full object-cover" style={{ opacity: 0.90 }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/85 via-[#0F0F0F]/60 to-[#0F0F0F]/90" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 px-5 py-2">
              <span className="text-sm">🏎️</span>
              <span className="font-[family-name:var(--font-dm)] text-xs font-600 uppercase tracking-[0.25em] text-[#8B5CF6]">{props.city} &bull; Oto Aksesuar</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-5xl font-800 leading-[1.08] sm:text-6xl lg:text-7xl">
              Aracını
              <br /><span className="text-[#8B5CF6]">Kişiselleştir</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-dm)] text-lg leading-relaxed text-white/45">
              {props.firmName} — {props.city}&apos;de jant, multimedya, kaplama, aydınlatma ve daha fazlası.
              Aracınıza karakter katın.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-3">
              {['Jant', 'Multimedya', 'Kaplama', 'LED Bar', 'Ses Sistemi', 'Paspas'].map((s) => (
                <span key={s} className="rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 px-4 py-2 font-[family-name:var(--font-dm)] text-xs font-500 text-[#8B5CF6]">{s}</span>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-8 py-4 font-[family-name:var(--font-outfit)] text-sm font-700 text-white shadow-lg shadow-[#8B5CF6]/25 transition-all hover:bg-[#7C3AED]">
                Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/5 py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-dm)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-3xl font-700 text-white sm:text-4xl">Araç aksesuar arayanlar <span className="text-red-400">online katalog</span> istiyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-dm)] text-lg text-white/45">Web siteniz yoksa müşteriler e-ticaret sitelerine yöneliyor.</motion.p>
        </motion.div>
      </div></section>

      <section className="bg-[#1A1A2E] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-outfit)] text-3xl font-700 text-white sm:text-4xl">Web Siteniz <span className="text-[#8B5CF6]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-outfit)] text-lg font-600 text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-dm)] text-sm text-white/60">
                {['Online ürün kataloğu ile müşteri çekersiniz', 'Montaj hizmeti güven oluşturur', 'Kampanyalarınızı duyurursunuz', 'Google\'da "oto aksesuar + şehir" aramasında çıkarsınız', 'Araç model uyumluluk bilgisi sunarsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#8B5CF6]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-outfit)] text-lg font-600 text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-dm)] text-sm text-white/60">
                {['Müşteriler online mağazalara kayar', 'Ürün çeşitliliğiniz bilinmez', 'Montaj hizmeti farkınız görülmez', 'Kampanyalarınız duyurulamaz', 'Lokal satış gücünüz sınırlı kalır'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {productImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-white/10"><img src={productImg} alt={`${props.firmName} ürün`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#8B5CF6] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-dm)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0F0F0F] px-10 py-4 font-[family-name:var(--font-outfit)] text-sm font-700 text-white transition-all hover:bg-[#1A1A2E]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5CF6]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-outfit)] text-lg font-700 text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-dm)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-dm)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
