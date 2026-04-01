'use client'

import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-space', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin-ext'], weight: ['300', '400', '500', '600', '700'], variable: '--font-dm', display: 'swap' })

const fadeInUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }
const slideFromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export default function DilKurslariTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const heroImg = props.images?.hero
  const classImg = props.images?.classroom

  return (
    <div className={`${spaceGrotesk.variable} ${dmSans.variable} min-h-screen bg-[#1E1B4B] text-white`}>
      {/* ═══════════════════ HERO — Floating Speech Bubbles: farklı dillerde konuşma balonları ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#1E1B4B]">
        {/* Floating speech bubbles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { text: 'Hello', x: '10%', y: '20%', rot: -8, op: 0.06 },
            { text: 'Hola', x: '75%', y: '15%', rot: 5, op: 0.05 },
            { text: 'Bonjour', x: '60%', y: '65%', rot: -3, op: 0.04 },
            { text: 'Hallo', x: '20%', y: '70%', rot: 7, op: 0.05 },
            { text: 'こんにちは', x: '85%', y: '45%', rot: -5, op: 0.04 },
            { text: 'Ciao', x: '40%', y: '85%', rot: 4, op: 0.03 },
          ].map((b) => (
            <div key={b.text} className="absolute font-[family-name:var(--font-space)] text-3xl font-700 text-[#A78BFA] sm:text-4xl" style={{ left: b.x, top: b.y, transform: `rotate(${b.rot}deg)`, opacity: b.op }}>
              <div className="rounded-2xl border border-[#A78BFA]/20 px-5 py-3">{b.text}</div>
            </div>
          ))}
        </div>

        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} dil kursu`} className="h-full w-full object-cover" style={{ opacity: 0.3 }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B4B]/90 via-[#1E1B4B]/70 to-[#1E1B4B]/40" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/10 px-5 py-2">
                <span className="text-sm">🌍</span>
                <span className="font-[family-name:var(--font-dm)] text-xs font-600 uppercase tracking-[0.25em] text-[#A78BFA]">
                  {props.city} &bull; Dil Kursu
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-space)] text-5xl font-700 leading-[1.08] sm:text-6xl lg:text-7xl">
                Dil Öğren
                <br />
                <span className="text-[#A78BFA]">Dünyayı Keşfet</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 max-w-md font-[family-name:var(--font-dm)] text-lg leading-relaxed text-white/50">
                {props.firmName} — {props.city}&apos;de İngilizce, Almanca, Fransızca ve daha fazlası.
                Uzman eğitmenler, küçük sınıflar, garantili sonuç.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3">
                {['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca', 'Online'].map((s) => (
                  <span key={s} className="rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/10 px-4 py-2 font-[family-name:var(--font-dm)] text-xs font-500 text-[#A78BFA]">{s}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-8">
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#A78BFA] px-8 py-4 font-[family-name:var(--font-space)] text-sm font-600 text-white shadow-lg shadow-[#A78BFA]/25 transition-all hover:bg-[#8B5CF6]">
                  Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Sağ — Seviye kartları */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden space-y-4 lg:block">
              {[{ level: 'A1-A2', title: 'Başlangıç', desc: 'Temel iletişim becerileri' }, { level: 'B1-B2', title: 'Orta Seviye', desc: 'Günlük konuşma akıcılığı' }, { level: 'C1-C2', title: 'İleri Seviye', desc: 'Profesyonel dil hakimiyeti' }, { level: 'EXAM', title: 'Sınav Hazırlık', desc: 'IELTS, TOEFL, Goethe, DELF' }].map((item) => (
                <motion.div key={item.level} variants={fadeInUp} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#A78BFA]/15 font-[family-name:var(--font-space)] text-xs font-700 text-[#A78BFA]">{item.level}</div>
                  <div>
                    <div className="font-[family-name:var(--font-space)] text-sm font-600 text-white/80">{item.title}</div>
                    <div className="font-[family-name:var(--font-dm)] text-xs text-white/35">{item.desc}</div>
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
          <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2"><span className="text-lg">⚠️</span><span className="font-[family-name:var(--font-dm)] text-sm font-600 text-red-400">Dikkat</span></motion.div>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-space)] text-3xl font-700 text-white sm:text-4xl">Dil kursu arayanlar <span className="text-red-400">önce Google&apos;a soruyor</span></motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-dm)] text-lg text-white/45">Web siteniz yoksa öğrenciler sizi bulamıyor, rakip kursa kayıt oluyor.</motion.p>
        </motion.div>
      </div></section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#2E1065] py-20"><div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-space)] text-3xl font-700 text-white sm:text-4xl">Web Siteniz <span className="text-[#A78BFA]">Olursa</span> / <span className="text-red-400">Olmazsa</span></motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#A78BFA]/20 bg-[#A78BFA]/5 p-8"><div className="mb-4 text-2xl">✅</div><h3 className="mb-4 font-[family-name:var(--font-space)] text-lg font-600 text-white">Olursa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-dm)] text-sm text-white/60">
                {['Online kayıt formu ile öğrenci kazanırsınız', 'Seviye testi ile profesyonel izlenim verirsiniz', 'Eğitmen kadronuz güven oluşturur', 'Google\'da "dil kursu + şehir" aramasında çıkarsınız', 'Kurs programları şeffaf şekilde sunulur'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[#A78BFA]">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-red-500/15 bg-red-500/5 p-8"><div className="mb-4 text-2xl">❌</div><h3 className="mb-4 font-[family-name:var(--font-space)] text-lg font-600 text-white">Olmazsa</h3>
              <ul className="space-y-3 font-[family-name:var(--font-dm)] text-sm text-white/60">
                {['Öğrenciler rakip kursa kayıt olur', 'Seviye ve fiyat bilgisi paylaşılamaz', 'Eğitmen kadronuz bilinmez', 'Sosyal medya tek kanalınız olur', 'Profesyonel imaj oluşturulamaz'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-red-400">●</span> {i}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div></section>

      {classImg && (<section className="py-16"><div className="mx-auto max-w-5xl px-4 sm:px-6"><motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-white/10"><img src={classImg} alt={`${props.firmName} sınıf`} className="w-full object-cover" style={{ aspectRatio: '16/9' }} /></motion.div></div></section>)}

      <section className="bg-[#A78BFA] py-20"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-space)] text-3xl font-700 text-white sm:text-4xl">{props.firmName} İçin<br />Profesyonel Web Sitenizi Oluşturalım</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-dm)] text-white/80">Ücretsiz demo — taahhüt yok.</motion.p>
          <motion.div variants={fadeInUp} className="mt-8"><a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')} className="inline-flex items-center gap-2 rounded-xl bg-[#1E1B4B] px-10 py-4 font-[family-name:var(--font-space)] text-sm font-600 text-white transition-all hover:bg-[#312E81]">Ücretsiz Teklif Al <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></motion.div>
        </motion.div>
      </div></section>

      <section className="py-16"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}><motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#A78BFA]/10"><span className="text-2xl">🔒</span></motion.div><motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-space)] text-lg font-600 text-white">Taahhüt Yok, Risk Yok</motion.h3><motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-dm)] text-sm text-white/40">Demo tamamen ücretsizdir.</motion.p></motion.div></div></section>

      <footer className="border-t border-white/5 py-8"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><p className="font-[family-name:var(--font-dm)] text-xs text-white/25">© {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.</p></div></footer>
    </div>
  )
}
