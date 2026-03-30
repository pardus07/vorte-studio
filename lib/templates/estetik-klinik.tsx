'use client'

import { Cormorant_Garamond, Jost } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const cormorant = Cormorant_Garamond({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

export default function EstetikKlinikTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${cormorant.variable} ${jost.variable} min-h-screen bg-[#F8F5F0] text-[#1C1917]`}>
      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative px-6 py-32 md:px-12 lg:px-24 lg:py-40"
      >
        <div className="mx-auto max-w-3xl text-center">
          {/* Thin gold line above heading */}
          <motion.div variants={fadeInUp} className="mx-auto mb-10 h-px w-16 bg-[#C9A96E]" />

          <motion.h1
            variants={fadeInUp}
            className="font-[family-name:var(--font-cormorant)] text-4xl font-700 leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            Güzelliğinizi en değerli ellere emanet edin
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-xl font-[family-name:var(--font-jost)] text-base text-[#1C1917]/60 md:text-lg"
          >
            {props.firmName} &mdash; {props.city}&apos;da estetik ve güzelliğin adresi
          </motion.p>

          {/* Thin gold line below subtext */}
          <motion.div variants={fadeInUp} className="mx-auto mt-8 h-px w-24 bg-[#C9A96E]" />

          {/* Google Rating */}
          {props.googleRating && props.googleRating > 0 && (
            <motion.div variants={fadeInUp} className="mt-8 flex items-center justify-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(props.googleRating!) ? 'text-[#C9A96E]' : 'text-[#C9A96E]/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-[family-name:var(--font-cormorant)] text-lg font-600 text-[#C9A96E]">
                {props.googleRating}
              </span>
              {props.googleReviews && (
                <span className="font-[family-name:var(--font-jost)] text-sm text-[#1C1917]/40">
                  ({props.googleReviews} değerlendirme)
                </span>
              )}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center justify-center border border-[#1C1917] bg-transparent px-10 py-3.5 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-[0.15em] text-[#1C1917] transition-all hover:bg-[#1C1917] hover:text-[#F8F5F0] active:scale-[0.97]"
            >
              Ücretsiz Teklif Al
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== ALARM ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#1C1917] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-cormorant)] text-2xl font-600 leading-relaxed text-[#F8F5F0] md:text-3xl"
          >
            Estetik işlem araştıran kişilerin %78&apos;i online araştırma yapıyor.
            Sizi bulamazlarsa güvenemiyorlar.
          </motion.p>

          {/* Gold divider */}
          <motion.div variants={fadeInUp} className="mx-auto my-10 h-px w-20 bg-[#C9A96E]" />

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-jost)] text-base text-[#F8F5F0]/50 md:text-lg"
          >
            Güven, profesyonel bir online varlıkla başlar
          </motion.p>
        </div>
      </motion.section>

      {/* ===== COMPARISON ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInUp}
            className="border border-[#C9A96E]/20 bg-[#F8F5F0] p-8 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-6 bg-[#1C1917]/20" />
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#1C1917]">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Potansiyel hastalar sizi bulamıyor',
                'Portföyünüzü gösteremiyorsunuz',
                'Güven ve prestij oluşturamıyorsunuz',
                'Sertifikalarınız görünmüyor',
                'Gizlilik güvencesi veremiyorsunuz',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-jost)] text-sm text-[#1C1917]/60"
                >
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1C1917]/20" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Website */}
          <motion.div
            variants={fadeInUp}
            className="border border-[#C9A96E] bg-[#F8F5F0] p-8 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-6 bg-[#C9A96E]" />
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-700 text-[#C9A96E]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Google\'da premium konumlanma',
                'Before/after portföy sergileme',
                'Lüks ve güvenilir marka imajı',
                'Tüm sertifikalar ve akreditasyonlar',
                'Gizlilik politikası ile güvence',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-jost)] text-sm text-[#1C1917]/80"
                >
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A96E]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== CHAT CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#1C1917] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-8 h-px w-12 bg-[#C9A96E]" />

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-cormorant)] text-3xl font-700 text-[#C9A96E] md:text-4xl"
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-jost)] text-base text-[#F8F5F0]/50"
          >
            Gizliliğinize saygı duyuyoruz. Tüm süreç güvenli ve kişiye özel.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center border border-[#C9A96E] bg-[#C9A96E] px-12 py-4 font-[family-name:var(--font-jost)] text-sm font-500 uppercase tracking-[0.15em] text-[#1C1917] transition-all hover:bg-[#B8963F] hover:border-[#B8963F] active:scale-[0.97]"
          >
            Hemen Teklif Al
          </motion.a>
        </div>
      </motion.section>

      {/* ===== GUARANTEE ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              ),
              title: 'Ücretsiz Keşif',
              desc: 'İlk görüşme ve analiz tamamen ücretsiz, taahhütsüz.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Gizlilik Güvencesi',
              desc: 'Hasta bilgileri ve kişisel veriler tam koruma altında.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
              title: 'Premium Tasarım',
              desc: 'Kliniğinizin prestijine yakışan lüks web tasarımı.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="border border-[#C9A96E]/15 bg-[#F8F5F0] p-8 text-center transition-all hover:border-[#C9A96E]/40"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-[#C9A96E]/30">
                {item.icon}
              </div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-700 text-[#1C1917]">
                {item.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-jost)] text-sm text-[#1C1917]/50">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="bg-[#1C1917] px-6 py-12 text-center md:px-12"
      >
        <div className="mx-auto mb-6 h-px w-10 bg-[#C9A96E]/30" />
        <p className="font-[family-name:var(--font-jost)] text-sm text-[#F8F5F0]/40">
          Bu sayfa {props.firmName} için{' '}
          <span className="font-500 text-[#C9A96E]">Vorte Studio</span> tarafından hazırlanmıştır.
        </p>
      </motion.section>
    </div>
  )
}
