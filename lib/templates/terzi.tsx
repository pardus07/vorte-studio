'use client'

import { Cormorant_Garamond, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function TerziTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const fabricsImg = props.images?.fabrics

  return (
    <div className={`${cormorant.variable} ${lato.variable} min-h-screen bg-[#FDF8F0] text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Centered Vertical Stack + Circular Image ═══════════════════ */}
      {/* BU HERO: Dikey merkezi akış — dairesel görsel + altın çizgi süslemeler */}
      <section className="relative overflow-hidden bg-[#4C1D95] pb-28 pt-20 text-white">
        {/* Decorative thread lines — terzi teması */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
          <div className="absolute left-[25%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent" />
          <div className="absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
          <div className="absolute right-[25%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent" />
        </div>

        {/* Giant background letter — couture estetiği */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="font-[family-name:var(--font-cormorant)] text-[25vw] font-700 italic leading-none text-white/[0.02]">
            Couture
          </span>
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center text-center">
            {/* Gold thread divider */}
            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[#D4AF37]" />
              <span className="font-[family-name:var(--font-lato)] text-xs font-700 uppercase tracking-[0.4em] text-[#D4AF37]">
                {props.city} &bull; Terzi & Moda
              </span>
              <div className="h-px w-12 bg-[#D4AF37]" />
            </motion.div>

            {/* Circular hero image — merkezi, dikkat çekici */}
            <motion.div variants={scaleIn} className="relative mb-10">
              <div className="h-52 w-52 overflow-hidden rounded-full border-4 border-[#D4AF37]/40 sm:h-64 sm:w-64">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} terzi`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#D4AF37]/10">
                    <div className="text-6xl">✂️</div>
                  </div>
                )}
              </div>
              {/* Gold ring accent */}
              <div className="absolute -inset-3 rounded-full border border-[#D4AF37]/20" />
              {/* Floating badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#D4AF37] px-4 py-1.5 shadow-lg">
                <span className="font-[family-name:var(--font-lato)] text-xs font-700 uppercase tracking-wider text-[#4C1D95]">Butik</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-5xl font-700 italic leading-tight sm:text-6xl lg:text-7xl">
              Size Özel
              <br />
              <span className="text-[#D4AF37]">Dikim & Tasarım</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base leading-relaxed text-white/60">
              <strong className="text-white">{props.firmName}</strong> — gelinlik, abiye, takım elbise
              ve günlük giyim. Kişiye özel ölçü, kusursuz kesim.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-wider text-[#4C1D95] transition-all hover:bg-transparent hover:text-[#D4AF37]">
                Ücretsiz Teklif Al
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

            {(props.googleRating || props.googleReviews) && (
              <motion.div variants={fadeInUp} className="mt-6 inline-flex items-center gap-3 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <div className="flex gap-0.5 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <span className="font-[family-name:var(--font-lato)] text-sm text-white/60">
                  {props.googleRating} ({props.googleReviews}+ yorum)
                </span>
              </motion.div>
            )}

            {/* Service tags — hero'nun organik parçası */}
            <motion.div variants={fadeInUp} className="mx-auto mt-10 flex flex-wrap justify-center gap-3">
              {['Gelinlik', 'Abiye', 'Takım Elbise', 'Tadilat'].map((s, i) => (
                <span key={i} className="border border-[#D4AF37]/30 px-4 py-2 font-[family-name:var(--font-lato)] text-xs font-700 uppercase tracking-wider text-[#D4AF37]/70">
                  {s}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#4C1D95] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-lato)] font-700 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl">
            Özel Dikim Arayanlar
            <br />
            <span className="text-[#4C1D95]">Portföy ve Referans İstiyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-[#1C1917]/60">
            Kişiye özel dikim yaptırmak isteyenlerin <strong className="text-[#1C1917]">%72&apos;si</strong> terziyi
            seçmeden önce önceki çalışmalarını görmek istiyor.
          </motion.p>

          {fabricsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#4C1D95]/20">
              <img src={fabricsImg} alt={`${props.firmName} kumaşlar`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '✂️', stat: '%72', text: 'Portföy arıyor' },
              { emoji: '👗', stat: 'Özel', text: 'Kişiye özel dikim' },
              { emoji: '📱', stat: '%58', text: 'Online randevu alıyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#4C1D95]/10 bg-[#4C1D95]/5 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-700 text-[#4C1D95]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F5F0EB] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl">
            Web Sitesi <span className="text-[#4C1D95]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Terziler
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#D4AF37]/30 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-lato)] text-base font-700 uppercase tracking-wider text-[#4C1D95]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1C1917]/70">
                {['Portföy ve referans çalışmalar online', 'Randevu sistemi 7/24 açık', 'Kumaş ve model seçenekleri görünür', 'Google\'da "terzi" aramasında çıkıyor', 'Müşteri yorumlarıyla güven veriyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#D4AF37]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-lato)] text-base font-700 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#1C1917]/30">
                {['Önceki çalışmalar görülemiyor', 'Randevu için aranması gerekiyor', 'Hizmet kapsamı belirsiz', 'Online aramalarda çıkmıyor', 'Yeni müşteriler güvenemiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#4C1D95] py-24 text-white">
        {/* Thread line decorations */}
        <div className="pointer-events-none absolute left-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/15 to-transparent" />
        <div className="pointer-events-none absolute right-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#D4AF37]/15 to-transparent" />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">✂️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-700 italic sm:text-4xl lg:text-5xl">
            Hayalinizdeki Kıyafet <span className="text-[#D4AF37]">Bir Adım Uzakta</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz ölçü ve stil danışmanlığı alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-10 py-5 font-[family-name:var(--font-lato)] text-base font-700 uppercase tracking-wider text-[#4C1D95] shadow-xl transition-all hover:bg-transparent hover:text-[#D4AF37]">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#4C1D95]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '📏', title: 'Kişiye Özel Ölçü', desc: 'Vücudunuza özel kalıp çıkarıyoruz.' },
            { icon: '🧵', title: 'El İşçiliği', desc: 'Her dikiş titizlikle, elde yapılıyor.' },
            { icon: '✨', title: 'Stil Danışmanlığı', desc: 'Kumaş ve model seçiminde yönlendirme.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#D4AF37]/20 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-lato)] text-sm font-700 uppercase tracking-wider text-[#4C1D95]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#4C1D95]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
