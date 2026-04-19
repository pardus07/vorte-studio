'use client'

import { Tenor_Sans, Karla } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const tenorSans = Tenor_Sans({
  subsets: ['latin-ext'],
  weight: ['400'],
  variable: '--font-tenor-sans',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-karla',
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function KuaforlerTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${tenorSans.variable} ${karla.variable} min-h-screen bg-[#FFFBEB] text-[#1C1917]`}>
      {/* ===== 1. HERO — Full-width bg image OR dark gradient ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background Image or Gradient */}
        {props.images?.['hero-bg'] ? (
          <>
            <img
              src={props.images['hero-bg']}
              alt={props.firmName}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/70 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917]">
            {/* Decorative gold lines */}
            <div className="absolute top-1/4 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
            <div className="absolute top-2/3 right-0 h-px w-1/4 bg-gradient-to-l from-transparent via-[#F59E0B]/15 to-transparent" />
            <div className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full border border-[#F59E0B]/5" />
            <div className="absolute top-1/3 right-1/5 h-48 w-48 rounded-full border border-[#F59E0B]/[0.03]" />
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 lg:px-12">
          {/* Gold accent line */}
          <motion.div variants={fadeInUp} className="mb-10 h-px w-20 bg-[#F59E0B]" />

          <motion.h1
            variants={fadeInUp}
            className="max-w-3xl font-[family-name:var(--font-tenor-sans)] text-4xl leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            {props.firmName} &mdash; Saçınız sizin en güzel aksesuarınız
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-xl font-[family-name:var(--font-karla)] text-base text-[#FFFBEB]/60 md:text-lg"
          >
            {suffixDe(props.city)} stil ve bakımın adresi
          </motion.p>

          {/* Gold divider */}
          <motion.div variants={fadeInUp} className="mt-8 h-px w-28 bg-gradient-to-r from-[#F59E0B] to-transparent" />

          {/* Google Rating Badge */}
          {props.googleRating && props.googleRating > 0 && (
            <motion.div
              variants={fadeInUp}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#F59E0B]/20 bg-[#1C1917]/50 px-5 py-2.5 backdrop-blur-sm"
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(props.googleRating!) ? 'text-[#F59E0B]' : 'text-[#F59E0B]/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-[family-name:var(--font-tenor-sans)] text-lg text-[#F59E0B]">
                {props.googleRating}
              </span>
              {props.googleReviews && (
                <span className="font-[family-name:var(--font-karla)] text-sm text-[#FFFBEB]/40">
                  ({props.googleReviews} değerlendirme)
                </span>
              )}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div variants={fadeInUp} className="mt-12">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center justify-center bg-[#F59E0B] px-10 py-3.5 font-[family-name:var(--font-karla)] text-sm font-700 uppercase tracking-[0.12em] text-[#1C1917] transition-all hover:bg-[#D97706] hover:shadow-lg hover:shadow-[#F59E0B]/20 active:scale-[0.97]"
            >
              Ücretsiz Teklif Al
            </a>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFFBEB] to-transparent" />
      </motion.section>

      {/* ===== 2. ALARM — Cream bg ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#FFFBEB] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#1C1917]/20" />
            <span className="font-[family-name:var(--font-karla)] text-xs font-500 uppercase tracking-[0.2em] text-[#1C1917]/40">
              Dikkat
            </span>
            <div className="h-px w-10 bg-[#1C1917]/20" />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-tenor-sans)] text-2xl leading-relaxed text-[#1C1917] md:text-3xl"
          >
            Yeni saç modeli arayanlar önce Instagram&apos;a, sonra Google&apos;a bakıyor. Sizi bulamazlarsa rakibinizi buluyorlar.
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto my-10 h-px w-20 bg-[#F59E0B]/40" />

          <motion.div variants={scaleIn} className="mx-auto max-w-xs">
            <p className="font-[family-name:var(--font-tenor-sans)] text-5xl text-[#F59E0B]">%68</p>
            <p className="mt-2 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/50">
              Kuaför müşterilerinin online araştırma yaparak geldiğini söylüyor
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== 3. COMPARISON — White bg ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="bg-white px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="font-[family-name:var(--font-tenor-sans)] text-3xl text-[#1C1917] md:text-4xl">
            Farkı Görün
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-[#F59E0B]" />
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-[#1C1917]/8 bg-[#FFFBEB]/60 p-8 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1917]/5">
                <svg className="h-4 w-4 text-[#1C1917]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-tenor-sans)] text-xl text-[#1C1917]">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Portföyünüz görünmüyor',
                'Rakibinizi tercih ediyorlar',
                'Stil çalışmalarınız bilinmiyor',
                'Fiyatlarınız meçhul',
                'Randevu telefona bağımlı',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/50"
                >
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#1C1917]/15" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border-2 border-[#F59E0B]/40 bg-white p-8 shadow-lg shadow-[#F59E0B]/5 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B]/10">
                <svg className="h-4 w-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-tenor-sans)] text-xl text-[#F59E0B]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Instagram-web entegrasyonu',
                'Google\'da öne çıkıyorsunuz',
                'Stil galeriniz açık',
                'Şeffaf fiyat listesi',
                'Online randevu sistemi',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/80"
                >
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== 4. SHOWCASE IMAGE — Circular image strip ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
        className="bg-[#FFFBEB] px-6 py-16 md:py-20"
      >
        <div className="mx-auto flex flex-col items-center">
          {/* Decorative top line */}
          <motion.div variants={fadeInUp} className="mb-10 h-px w-16 bg-[#F59E0B]/30" />

          {props.images?.showcase ? (
            <motion.div
              variants={scaleIn}
              className="relative"
            >
              {/* Gold ring */}
              <div className="absolute -inset-2 rounded-full border-2 border-[#F59E0B]/30" />
              <div className="absolute -inset-4 rounded-full border border-[#F59E0B]/10" />
              <div className="h-48 w-48 overflow-hidden rounded-full ring-4 ring-[#F59E0B]">
                <img
                  src={props.images.showcase}
                  alt={`${props.firmName} vitrin`}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={scaleIn}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-full border-2 border-[#F59E0B]/30" />
              <div className="absolute -inset-4 rounded-full border border-[#F59E0B]/10" />
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 ring-4 ring-[#F59E0B]">
                <span className="text-6xl">&#x2702;&#xFE0F;</span>
              </div>
            </motion.div>
          )}

          <motion.p
            variants={fadeInUp}
            className="mt-8 font-[family-name:var(--font-tenor-sans)] text-lg text-[#1C1917]/60"
          >
            Stilinizi yansıtan tasarım
          </motion.p>

          {/* Decorative bottom line */}
          <motion.div variants={fadeInUp} className="mt-10 h-px w-16 bg-[#F59E0B]/30" />
        </div>
      </motion.section>

      {/* ===== 5. CHAT CTA — Dark bg, pulsing gold CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#1C1917] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-8 h-px w-12 bg-[#F59E0B]" />

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-tenor-sans)] text-3xl text-[#FFFBEB] md:text-4xl"
          >
            Ücretsiz Stil Danışmanlığı
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-karla)] text-base text-[#FFFBEB]/50"
          >
            Salonunuzun dijital dönüşümünü birlikte planlayalım. Taahhüt yok, sadece profesyonel öneri.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center bg-[#F59E0B] px-12 py-4 font-[family-name:var(--font-karla)] text-sm font-700 uppercase tracking-[0.12em] text-[#1C1917] shadow-lg shadow-[#F59E0B]/20 transition-all hover:bg-[#D97706] active:scale-[0.97]"
          >
            Ücretsiz Teklif Al
          </motion.a>

          <motion.p
            variants={fadeInUp}
            className="mt-6 font-[family-name:var(--font-karla)] text-xs text-[#FFFBEB]/30"
          >
            2 dakika sohbet, sıfır taahhüt
          </motion.p>
        </div>
      </motion.section>

      {/* ===== 6. GUARANTEE — 3 cards ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-[#FFFBEB] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="font-[family-name:var(--font-tenor-sans)] text-3xl text-[#1C1917] md:text-4xl">
            Güvencelerimiz
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-[#F59E0B]" />
        </motion.div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              ),
              title: 'Ücretsiz Danışmanlık',
              desc: 'İlk görüşme ve analiz tamamen ücretsiz, herhangi bir taahhüt yok.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
              title: 'Uzman Stilistler',
              desc: 'Kuaför ve güzellik sektörüne özel deneyimli tasarım ekibi.',
            },
            {
              icon: (
                <svg className="h-6 w-6 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              title: 'Memnuniyet Garantisi',
              desc: 'Salonunuzun kimliğine uygun, şık ve modern tasarım garantisi.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="rounded-2xl border border-[#F59E0B]/15 bg-white p-8 text-center transition-all hover:border-[#F59E0B]/40 hover:shadow-md hover:shadow-[#F59E0B]/5"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/5">
                {item.icon}
              </div>
              <h3 className="font-[family-name:var(--font-tenor-sans)] text-lg text-[#1C1917]">
                {item.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-karla)] text-sm text-[#1C1917]/50">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== 7. FOOTER — Black bg, gold Vorte Studio ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="bg-black px-6 py-12 text-center md:px-12"
      >
        <div className="mx-auto mb-6 h-px w-10 bg-[#F59E0B]/30" />
        <p className="font-[family-name:var(--font-karla)] text-sm text-[#FFFBEB]/40">
          Bu sayfa {props.firmName} için{' '}
          <span className="font-700 text-[#F59E0B]">Vorte Studio</span> tarafından hazırlanmıştır.
        </p>
      </motion.section>
    </div>
  )
}
