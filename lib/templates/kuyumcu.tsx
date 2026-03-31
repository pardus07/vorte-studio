'use client'

import { Cormorant_Garamond, Jost } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
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

export default function KuyumcuTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const collectionImg = props.images?.collection

  return (
    <div className={`${cormorant.variable} ${jost.variable} min-h-screen bg-[#0A0A0A] text-white`}>
      {/* ═══════════════════ HERO — Cinematic Letterbox: ultra-geniş yatay şerit görsel + altın border ═══════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        {/* Subtle gold particle effect — luxury dust */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, rgba(212,175,55,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 70%, rgba(212,175,55,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 20%, rgba(212,175,55,0.25) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 80%, rgba(212,175,55,0.15) 0%, transparent 100%)
          `,
          backgroundSize: '200px 200px, 300px 300px, 250px 250px, 180px 180px',
        }} />

        {/* Top text block */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-10 text-center">
          <motion.div variants={fadeInUp} className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="font-[family-name:var(--font-jost)] text-xs font-500 uppercase tracking-[0.5em] text-[#D4AF37]/70">
              {props.city} &bull; Kuyumcu
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>

          <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-5xl font-700 italic leading-[1.1] sm:text-6xl lg:text-7xl">
            En Değerli Anlar İçin
            <br />
            <span className="text-[#D4AF37]">En Özel Takılar</span>
          </motion.h1>
        </motion.div>

        {/* Cinematic letterbox image strip — gold bordered */}
        <motion.div variants={scaleIn} initial="hidden" animate="visible" className="w-full max-w-6xl">
          <div className="border-y-2 border-[#D4AF37]/40">
            {heroImg ? (
              <img
                src={heroImg}
                alt={`${props.firmName} kuyumcu`}
                className="w-full object-cover"
                style={{ aspectRatio: '21/9', maxHeight: '340px' }}
              />
            ) : (
              <div className="flex items-center justify-center bg-gradient-to-r from-[#D4AF37]/5 via-[#D4AF37]/10 to-[#D4AF37]/5" style={{ aspectRatio: '21/9', maxHeight: '340px' }}>
                <span className="font-[family-name:var(--font-cormorant)] text-6xl text-[#D4AF37]/20">💎</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom text + CTA */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-10 text-center">
          <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-jost)] text-lg leading-relaxed text-white/50">
            {props.firmName} — {props.city}&apos;de nişan yüzüğünden özel tasarıma,
            altın ve pırlanta koleksiyonları.
          </motion.p>

          {/* Collection type badges */}
          <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap justify-center gap-3">
            {['Nişan Yüzüğü', 'Altın Koleksiyon', 'Pırlanta', 'Özel Tasarım', 'Tamir & Ayar'].map((tag) => (
              <span key={tag} className="border border-[#D4AF37]/20 px-4 py-2 font-[family-name:var(--font-jost)] text-xs font-400 tracking-wider text-[#D4AF37]/70">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center gap-2 border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-transparent hover:text-[#D4AF37]"
            >
              Ücretsiz Teklif Al
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-jost)] text-sm font-500 text-red-400">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-white sm:text-4xl">
              Nişan yüzüğü arayanlar <span className="text-red-400">online katalog</span> inceliyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-jost)] text-lg text-white/50">
              Koleksiyonunuz online değilse mağazaya gelme motivasyonu yok.
              Web siteniz olmadan müşteriler sizi bulamıyor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#111111] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 text-white sm:text-4xl">
              Web Siteniz <span className="text-[#D4AF37]">Olursa</span> / <span className="text-red-400">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-jost)] text-sm text-white/70">
                  {['Koleksiyon galerisi 7/24 erişilebilir', 'Google\'da "kuyumcu + şehir" aramasında çıkarsınız', 'Fiyat ve ayar bilgileri güven oluşturur', 'Özel tasarım siparişi online gelir', 'Mağaza ziyaretçisi katlanarak artar'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#D4AF37]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-jost)] text-sm text-white/70">
                  {['Müşteriler koleksiyonunuzu göremez', 'Online kataloğu olan rakiplere kaybedersiniz', 'Güven oluşturmak zorlaşır', 'Özel tasarım talepleri gelmez', 'Marka bilinirliğiniz sınırlı kalır'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-red-400">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KOLEKSİYON GÖRSELİ ═══════════════════ */}
      {collectionImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden border border-[#D4AF37]/20">
              <img src={collectionImg} alt={`${props.firmName} koleksiyon`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-gradient-to-b from-[#0A0A0A] to-[#1C1917] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#D4AF37]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-jost)] text-white/50">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 border-2 border-[#D4AF37] bg-[#D4AF37] px-10 py-4 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-transparent hover:text-[#D4AF37]"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="bg-[#0A0A0A] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-xl font-700 text-white">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-jost)] text-sm text-white/40">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-white/5 bg-[#0A0A0A] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-jost)] text-xs text-white/30">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
