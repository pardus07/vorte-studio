'use client'

import { Nunito, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-nunito', display: 'swap' })
const openSans = Open_Sans({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-opensans', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function KuruTemizlemeTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  return (
    <div className={`${nunito.variable} ${openSans.variable} min-h-screen bg-[#E0F2FE] text-gray-900`}>
      {/* ═══════════════════ HERO — Hanger Rack Perspective: yatay kaçış noktası çizgileri + askı estetiği ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-white">
        {/* Perspective hanger lines — horizontal vanishing */}
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
            {/* Horizontal perspective lines converging to right */}
            <line x1="0" y1="200" x2="1440" y2="400" stroke="rgba(3,105,161,0.04)" strokeWidth="0.5" />
            <line x1="0" y1="350" x2="1440" y2="420" stroke="rgba(3,105,161,0.06)" strokeWidth="0.5" />
            <line x1="0" y1="500" x2="1440" y2="440" stroke="rgba(3,105,161,0.06)" strokeWidth="0.5" />
            <line x1="0" y1="650" x2="1440" y2="460" stroke="rgba(3,105,161,0.04)" strokeWidth="0.5" />
            {/* Vertical hanger hooks */}
            <path d="M 400 100 Q 400 130 415 130 Q 430 130 430 160" fill="none" stroke="rgba(3,105,161,0.05)" strokeWidth="1" />
            <path d="M 600 80 Q 600 110 615 110 Q 630 110 630 140" fill="none" stroke="rgba(3,105,161,0.04)" strokeWidth="1" />
            <path d="M 800 90 Q 800 120 815 120 Q 830 120 830 150" fill="none" stroke="rgba(3,105,161,0.05)" strokeWidth="1" />
          </svg>
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} kuru temizleme`} className="h-full w-full object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-white/20" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-12">
            {/* Sol — metin 7 kolon */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-7">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0369A1]/10 px-5 py-2">
                <span className="text-sm">👔</span>
                <span className="font-[family-name:var(--font-opensans)] text-xs font-600 uppercase tracking-[0.25em] text-[#0369A1]">
                  {props.city} &bull; Kuru Temizleme
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-5xl font-800 leading-[1.08] text-gray-900 sm:text-6xl">
                Kıyafetleriniz
                <br />
                <span className="text-[#0369A1]">En İyi Bakımı</span>
                <br />
                Hak Ediyor
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-lg font-[family-name:var(--font-opensans)] text-lg leading-relaxed text-gray-500">
                {props.firmName} — {suffixDe(props.city)} profesyonel kuru temizleme, ütü ve özel kumaş bakımı.
                Ekspres servis, eve teslim seçeneği.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['Takım Elbise', 'Deri / Süet', 'Gelinlik', 'Kadife', 'Ekspres'].map((s) => (
                  <span key={s} className="rounded-full border border-[#0369A1]/15 bg-[#E0F2FE] px-4 py-2 font-[family-name:var(--font-opensans)] text-xs font-500 text-[#0369A1]">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0369A1] px-8 py-4 font-[family-name:var(--font-nunito)] text-sm font-700 text-white shadow-lg shadow-[#0369A1]/20 transition-all hover:bg-[#025E8C]">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — servis kartları dikey 5 kolon */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-3 lg:col-span-5 lg:block">
              {[{ icon: '⚡', title: 'Ekspres Servis', desc: 'Aynı gün teslim' }, { icon: '🚗', title: 'Eve Teslim', desc: 'Kapınızdan alıp getiriyoruz' }, { icon: '🧥', title: 'Özel Kumaşlar', desc: 'Deri, süet, kadife uzmanı' }].map((item) => (
                <motion.div key={item.title} variants={fadeInUp} className="flex items-center gap-4 rounded-xl border border-[#0369A1]/10 bg-white/80 p-4 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#E0F2FE] text-xl">{item.icon}</div>
                  <div>
                    <div className="font-[family-name:var(--font-nunito)] text-sm font-700 text-gray-900">{item.title}</div>
                    <div className="font-[family-name:var(--font-opensans)] text-xs text-gray-400">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#E0F2FE] py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-opensans)] text-sm font-600 text-red-500">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-700 text-gray-900 sm:text-4xl">Kuru temizleme arayanlar <span className="text-red-500">fiyat ve hizmet</span> karşılaştırıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-opensans)] text-lg text-gray-500">Siteniz yoksa karşılaştırmaya bile alınmazsınız. Eve teslim hizmetinizi gösteremezsiniz.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-700 text-gray-900 sm:text-4xl">Web Siteniz <span className="text-[#0369A1]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#0369A1]/15 bg-[#E0F2FE] p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-gray-900">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-opensans)] text-sm text-gray-600">
                {['Hizmet çeşitleriniz ve fiyatlarınız görünür', 'Eve teslim seçeneği müşteri çeker', 'Google\'da "kuru temizleme + şehir" aramasında çıkarsınız', 'Özel kumaş uzmanlığınız öne çıkar', 'Online sipariş ile iş hacmi artar'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0369A1]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-200 bg-red-50 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-gray-900">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-opensans)] text-sm text-gray-600">
                {['Sadece yürüme mesafesindeki müşteriler gelir', 'Eve teslim avantajınız bilinmez', 'Fiyat karşılaştırmasına giremezsiniz', 'Uzmanlık alanlarınız görünmez', 'Rakipler çevrimiçi öne geçer'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="bg-[#E0F2FE] py-8"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-[#0369A1]/10 shadow-lg"><img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0369A1] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-opensans)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-nunito)] text-sm font-700 text-[#0369A1] shadow-lg transition-all hover:bg-gray-50">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="bg-white py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0369A1]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-lg font-700 text-gray-900">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-opensans)] text-sm text-gray-400">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-gray-100 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-opensans)] text-xs text-gray-300">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
