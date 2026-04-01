'use client'

import { Poppins, Nunito } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' })
const nunito = Nunito({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-nunito', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function TemizlikTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  const categories = [
    { icon: '🏠', title: 'Ev Temizliği', desc: 'Derin temizlik, cam silme, ütü' },
    { icon: '🏢', title: 'Ofis Temizliği', desc: 'Günlük / haftalık periyodik' },
    { icon: '🏗️', title: 'İnşaat Sonrası', desc: 'Kaba + ince temizlik' },
  ]

  return (
    <div className={`${poppins.variable} ${nunito.variable} min-h-screen bg-[#ECFDF5] text-gray-900`}>
      {/* ═══════════════════ HERO — Sparkling Diagonal Wipe: köşegen temizlik çizgisi + sparkle efekti ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-white">
        {/* Diagonal wipe line — temizlik çizgisi */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-full w-full" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #ECFDF5 48%, #0F766E 48.5%, #0F766E 49.5%, white 50%, white 100%)' }} />
        </div>

        {/* Sparkle dots */}
        <div className="pointer-events-none absolute inset-0">
          {[{ x: '25%', y: '20%' }, { x: '45%', y: '35%' }, { x: '65%', y: '15%' }, { x: '80%', y: '45%' }, { x: '35%', y: '70%' }].map((pos, i) => (
            <div key={i} className="absolute h-1.5 w-1.5 animate-pulse rounded-full bg-[#0F766E]/20" style={{ left: pos.x, top: pos.y, animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} temizlik`} className="h-full w-full object-cover" style={{ opacity: 0.12 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0F766E]/10 px-5 py-2">
                <span className="text-sm">✨</span>
                <span className="font-[family-name:var(--font-nunito)] text-xs font-700 uppercase tracking-[0.25em] text-[#0F766E]">
                  {props.city} &bull; Profesyonel Temizlik
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-5xl font-700 leading-[1.08] text-gray-900 sm:text-6xl">
                Tertemiz
                <br />
                <span className="text-[#0F766E]">Mekanlar</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-nunito)] text-lg leading-relaxed text-gray-500">
                {props.firmName} — {props.city}&apos;de ev, ofis ve inşaat sonrası profesyonel temizlik.
                Periyodik kontrat ile düzenli hijyen garantisi.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-8 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-white shadow-lg shadow-[#0F766E]/20 transition-all hover:bg-[#0D6A62]">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Hizmet kategorileri */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {categories.map((cat, idx) => (
                <motion.div key={cat.title} variants={fadeInUp} custom={idx} className="flex items-center gap-5 rounded-2xl border border-[#0F766E]/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-2xl">{cat.icon}</div>
                  <div>
                    <h3 className="font-[family-name:var(--font-poppins)] text-base font-600 text-gray-900">{cat.title}</h3>
                    <p className="font-[family-name:var(--font-nunito)] text-sm text-gray-400">{cat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-nunito)] text-sm font-700 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-gray-900 sm:text-4xl">Temizlik firması arayanlar <span className="text-red-500">referans ve fiyat</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-lg text-gray-500">Web siteniz yoksa güvenilir görünmeniz zor. Rakipleriniz online güvenle öne geçiyor.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#ECFDF5] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#0F766E]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0F766E]/15 bg-white p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-sm text-gray-600">
                {['Hizmet kategorileri net görünür', 'Periyodik kontrat ile düzenli iş alırsınız', 'Referanslar güven oluşturur', 'Google\'da "temizlik firması + şehir" aramasında çıkarsınız', 'Online fiyat teklifi ile müşteri kazanırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0F766E]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-nunito)] text-sm text-gray-600">
                {['Rakipler online güven farkı yaratır', 'Hizmet alanlarınız görünmez', 'Periyodik iş fırsatları kaybolur', 'Güvenilirlik algısı düşük kalır', 'Müşteri portföyünüz genişlemez'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="bg-white py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg"><img src={serviceImg} alt={`${props.firmName} hizmet`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0F766E] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-[#0F766E] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="bg-white py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F766E]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-lg font-600 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-nunito)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-nunito)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
