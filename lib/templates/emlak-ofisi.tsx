'use client'

import { Cormorant_Garamond, Raleway } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-raleway',
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

export default function EmlakOfisiTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const interiorImg = props.images?.interior

  return (
    <div className={`${cormorant.variable} ${raleway.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Diagonal Split: sol koyu metin + sağ çapraz görsel ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#0F172A]">
        {/* Diagonal image — right side with clip-path */}
        {heroImg && (
          <div
            className="absolute inset-0"
            style={{ clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 35% 100%)' }}
          >
            <img src={heroImg} alt={`${props.firmName} emlak`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/40 to-transparent" />
          </div>
        )}

        {/* Subtle gold accent lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/40 to-transparent" />
          <div className="absolute left-[40%] top-0 h-full w-px bg-gradient-to-b from-[#D4AF37]/30 via-transparent to-[#D4AF37]/20" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Sol taraf — metin (7/12) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-7/12 lg:pr-16"
          >
            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-[#D4AF37]" />
              <span className="font-[family-name:var(--font-raleway)] text-xs font-600 uppercase tracking-[0.35em] text-[#D4AF37]">
                {props.city} &bull; Emlak Danışmanlığı
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-4xl font-700 leading-[1.1] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Hayalinizdeki Eve
              <br />
              <span className="text-[#D4AF37]">Bir Adım Uzaktasınız</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 max-w-lg font-[family-name:var(--font-raleway)] text-lg leading-relaxed text-white/70">
              {props.firmName} olarak {props.city} ve çevresinde satılık, kiralık mülk portföyümüzle
              size en uygun evi bulmak için buradayız.
            </motion.p>

            {/* Stat strip */}
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-8">
              {[
                { num: '500+', label: 'Aktif İlan' },
                { num: '15+', label: 'Yıl Deneyim' },
                { num: '%95', label: 'Müşteri Memnuniyeti' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#D4AF37]">{s.num}</div>
                  <div className="font-[family-name:var(--font-raleway)] text-xs font-500 uppercase tracking-wider text-white/50">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#0F172A] transition-all hover:bg-[#C5A028] hover:shadow-lg hover:shadow-[#D4AF37]/20"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#FDF8F0] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <motion.div variants={fadeInUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2">
              <span className="text-lg">⚠️</span>
              <span className="font-[family-name:var(--font-raleway)] text-sm font-600 text-red-700">Dikkat — Kaçırıyorsunuz</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#0F172A] sm:text-4xl">
              Ev arayanların <span className="text-red-600">%89&apos;u</span> önce online inceliyor
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-lg text-[#64748B]">
              İlanlarınız kendi sitenizde yoksa sadece sahibinden.com&apos;a bağımlısınız.
              Kendi web sitenizle marka gücünüzü artırın, komisyon ödemeden müşteri kazanın.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#0F172A] sm:text-4xl">
              Web Siteniz <span className="text-[#D4AF37]">Olursa</span> / <span className="text-red-500">Olmazsa</span>
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={slideFromLeft} className="rounded-2xl border-2 border-[#D4AF37]/20 bg-[#FEFDF8] p-8">
                <div className="mb-4 text-2xl">✅</div>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#0F172A]">Web Siteniz Olursa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-sm text-[#374151]">
                  {['İlanlarınız 7/24 online görünür', 'Google\'da "emlak + şehir" aramasında çıkarsınız', 'Kendi markanızla güven oluşturursunuz', 'Komisyonsuz doğrudan müşteri kazanırsınız', 'Profesyonel portföy ile fark yaratırsınız'].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#D4AF37]">●</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={slideFromRight} className="rounded-2xl border border-red-100 bg-red-50/50 p-8">
                <div className="mb-4 text-2xl">❌</div>
                <h3 className="mb-4 font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#0F172A]">Web Siteniz Olmazsa</h3>
                <ul className="space-y-3 font-[family-name:var(--font-raleway)] text-sm text-[#374151]">
                  {['Sadece portallara bağımlı kalırsınız', 'Müşteriler sizi bulamaz, rakibinize gider', 'İlan komisyonları bütçenizi eritir', 'Marka bilinirliğiniz sıfır kalır', 'Profesyonel görüntü oluşturamazsınız'].map((item) => (
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

      {/* ═══════════════════ İÇ MEKAN / İNTERİYÖR GÖRSELİ ═══════════════════ */}
      {interiorImg && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-hidden rounded-2xl">
              <img src={interiorImg} alt={`${props.firmName} ofis`} className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#0F172A] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-white sm:text-4xl">
              {props.firmName} İçin
              <br />
              <span className="text-[#D4AF37]">Profesyonel Web Sitenizi Oluşturalım</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-white/60">
              Ücretsiz demo ile farkı görün — taahhüt yok, baskı yok.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center gap-2 bg-[#D4AF37] px-10 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#0F172A] transition-all hover:bg-[#C5A028] hover:shadow-lg hover:shadow-[#D4AF37]/25"
              >
                Ücretsiz Teklif Al
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={scaleIn} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <span className="text-2xl">🔒</span>
            </motion.div>
            <motion.h3 variants={fadeInUp} className="font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#0F172A]">
              Taahhüt Yok, Risk Yok
            </motion.h3>
            <motion.p variants={fadeInUp} className="mt-2 font-[family-name:var(--font-raleway)] text-sm text-[#64748B]">
              Demo tamamen ücretsizdir. Beğenmezseniz hiçbir ödeme yapmazsınız.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-[family-name:var(--font-raleway)] text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} Vorte Studio — {props.firmName} için özel olarak hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
