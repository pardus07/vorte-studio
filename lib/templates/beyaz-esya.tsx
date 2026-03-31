'use client'

import { Poppins, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' })
const inter = Inter({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function BeyazEsyaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const serviceImg = props.images?.service

  const appliances = [
    { icon: '🧺', name: 'Çamaşır Makinesi' },
    { icon: '🍽️', name: 'Bulaşık Makinesi' },
    { icon: '❄️', name: 'Buzdolabı' },
    { icon: '🔥', name: 'Fırın & Ocak' },
    { icon: '💨', name: 'Kurutma Makinesi' },
  ]

  return (
    <div className={`${poppins.variable} ${inter.variable} min-h-screen bg-[#F8FAFC] text-[#0F172A]`}>
      {/* ═══════════════════ HERO — Horizontal Appliance Strip: üstte centered metin + yatay ikon bandı ═══════════════════ */}
      <section className="relative overflow-hidden bg-white pb-16 pt-20">
        {/* Subtle grid — clean tech aesthetic */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Hero bg image — subtle */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} beyaz eşya`} className="h-full w-full object-cover" style={{ opacity: 0.06 }} />
          </div>
        )}

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0F172A]/10 bg-[#0F172A]/5 px-4 py-2">
              <span className="font-[family-name:var(--font-inter)] text-xs font-500 text-[#0F172A]/60">{props.city} &bull; Beyaz Eşya Servisi</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-4xl font-700 leading-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              Arıza mı Yaptı?
              <br />
              <span className="text-[#DC2626]">Biz Geliriz</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-inter)] text-lg leading-relaxed text-[#64748B]">
              {props.firmName} — {props.city}&apos;de tüm marka beyaz eşya tamiri.
              Eve gelir servis, orijinal parça garantisi.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-8 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-white transition-all hover:bg-[#1E293B] hover:shadow-lg">
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Horizontal appliance strip — unique scrolling band */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mt-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2 sm:gap-6">
              {appliances.map((a) => (
                <div key={a.name} className="flex min-w-[120px] flex-col items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-all hover:border-[#DC2626]/30 hover:shadow-md sm:min-w-[140px] sm:p-5">
                  <span className="text-3xl">{a.icon}</span>
                  <span className="font-[family-name:var(--font-inter)] text-xs font-500 text-[#475569]">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-inter)] text-sm font-600 text-red-700">Dikkat — Kaçırıyorsunuz</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-[#0F172A] sm:text-4xl">Beyaz eşya arızasında herkes <span className="text-red-600">acil tamirci</span> arıyor</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-lg text-[#64748B]">Web siteniz yoksa o acil aramada sizi bulamıyorlar. Rakibiniz müşterinizi alıyor.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-white py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-[#0F172A] sm:text-4xl">Web Siteniz <span className="text-[#0F172A]">Olursa</span> / <span className="text-red-500">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#0F172A]/10 bg-[#F8FAFC] p-8">
              <div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-[#0F172A]">Web Siteniz Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-[#475569]">
                {['Google\'da "beyaz eşya tamiri + şehir" aramasında çıkarsınız', 'Marka listesi ve garanti bilgisi güven verir', 'Eve gelir servis bilgisi müşteriyi çeker', 'Online randevu ile iş akışınız düzenlenir', 'Parça garantisi ile rakiplerden ayrılırsınız'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#0F172A]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
              <div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-poppins)] text-lg font-600 text-[#0F172A]">Web Siteniz Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-inter)] text-sm text-[#475569]">
                {['Acil tamire ihtiyaç duyanlar sizi bulamaz', 'Güvensiz ilan sitelerine mahkum olursunuz', 'Marka uzmanlığınızı gösteremezsiniz', 'Rakipler online müşterileri kaptar', 'İş hacminiz artmaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {serviceImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl"><img src={serviceImg} alt={`${props.firmName} servis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} /></motion.div></div></section>)}

      <section className="bg-[#0F172A] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br /><span className="text-[#DC2626]">Profesyonel Web Sitenizi Oluşturalım</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-inter)] text-white/60">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 text-[#0F172A] transition-all hover:bg-[#F1F5F9]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F172A]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-poppins)] text-lg font-600 text-[#0F172A]">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-inter)] text-sm text-[#64748B]">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-[#E2E8F0] py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-inter)] text-xs text-[#94A3B8]">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
