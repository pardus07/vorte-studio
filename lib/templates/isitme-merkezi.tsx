'use client'

import { Poppins, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  variable: '--font-open-sans',
  display: 'swap',
})

/* ── Animation Variants ── */

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

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

/* ── Component ── */

export default function IsitmeMerkeziTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const rating = props.googleRating ?? 4.8
  const reviews = props.googleReviews ?? 0

  return (
    <div className={`${poppins.variable} ${openSans.variable} min-h-screen bg-white text-[#1E293B]`}>

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-white px-6 py-24 md:px-12 lg:px-24 lg:py-32"
      >
        {/* Decorative gradient circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#0369A1]/6 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[#F97316]/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0369A1]/4 blur-2xl" />
        </div>

        <div className={`relative mx-auto ${props.images?.hero ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center gap-12' : 'max-w-3xl text-center'}`}>
          {/* Left — Text Content */}
          <div>
            {/* Google Rating Badge */}
            {rating > 0 && (
              <motion.div variants={fadeInUp} className={`mb-8 flex ${props.images?.hero ? 'justify-start' : 'justify-center'}`}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#0369A1]/15 bg-[#0369A1]/5 px-5 py-2.5 font-[family-name:var(--font-open-sans)] text-sm font-500 text-[#1E293B]">
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(rating) ? 'text-[#F97316]' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </span>
                  <span className="font-600 text-[#0369A1]">{rating}</span>
                  {reviews > 0 && (
                    <span className="text-[#1E293B]/40">({reviews} değerlendirme)</span>
                  )}
                </span>
              </motion.div>
            )}

            {/* No-image fallback — centered emoji circle */}
            {!props.images?.hero && (
              <motion.div variants={scaleIn} className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#0369A1]/10 to-[#0369A1]/5">
                <span className="text-5xl">&#x1F9BB;</span>
              </motion.div>
            )}

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-poppins)] text-4xl font-800 leading-tight tracking-tight text-[#1E293B] md:text-5xl lg:text-[3.4rem]"
            >
              Duymak bir hak &mdash;{' '}
              <span className="bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
                doğru cihazla hayat değişiyor
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className={`mt-6 max-w-xl font-[family-name:var(--font-open-sans)] text-base leading-relaxed text-[#1E293B]/60 md:text-lg ${props.images?.hero ? '' : 'mx-auto'}`}
            >
              {props.firmName} &mdash; {props.city}
              {props.district ? `, ${props.district}` : ''}&apos;da işitme sağlığınız için güvenilir adres.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className={`mt-10 flex flex-col items-center gap-4 sm:flex-row ${props.images?.hero ? '' : 'sm:justify-center'}`}>
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-8 py-4 font-[family-name:var(--font-poppins)] text-sm font-700 uppercase tracking-wide text-white shadow-lg shadow-[#F97316]/25 transition-all hover:bg-[#EA6C0C] hover:shadow-xl active:scale-[0.97]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                Ücretsiz İşitme Testi
              </a>
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#0369A1]/20 bg-transparent px-8 py-4 font-[family-name:var(--font-poppins)] text-sm font-600 tracking-wide text-[#0369A1] transition-all hover:border-[#0369A1]/40 hover:bg-[#0369A1]/5 active:scale-[0.97]"
              >
                Teklif Al
              </a>
            </motion.div>
          </div>

          {/* Right — Hero Image (Slot 1) */}
          {props.images?.hero && (
            <motion.div variants={slideInRight} className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="h-80 w-80 overflow-hidden rounded-3xl shadow-2xl shadow-[#0369A1]/20 ring-4 ring-[#0369A1]/15">
                  <img
                    src={props.images.hero}
                    alt={props.firmName}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Floating badge — top left */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -left-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/5"
                >
                  <span className="font-[family-name:var(--font-poppins)] text-sm font-600 text-[#1E293B]">
                    &#x1F50A; Dijital Cihazlar
                  </span>
                </motion.div>
                {/* Floating badge — bottom right */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -right-4 bottom-10 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/5"
                >
                  <span className="font-[family-name:var(--font-poppins)] text-sm font-600 text-[#1E293B]">
                    &#x1F3E5; Uzman Kadro
                  </span>
                </motion.div>
                {/* Blue decorative dot */}
                <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-[#0369A1]" />
                {/* Orange decorative dot */}
                <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#F97316]" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — ALARM
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-3xl text-center">
          {/* Warning icon */}
          <motion.div variants={scaleIn} className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#F97316]/10">
            <svg className="h-8 w-8 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-poppins)] text-2xl font-700 leading-relaxed text-[#1E293B] md:text-3xl"
          >
            İşitme cihazı araştıranlar önce{' '}
            <span className="text-[#F97316]">online bilgi topluyor.</span>{' '}
            Sizi bulamazlarsa rakibinizin bilgisine güveniyorlar.
          </motion.h2>

          <motion.div variants={fadeInUp} className="mx-auto my-8 h-1 w-16 rounded-full bg-[#F97316]/40" />

          {/* Stat card */}
          <motion.div
            variants={fadeInUp}
            className="mx-auto mt-8 flex items-center justify-center gap-4 rounded-2xl border border-[#F97316]/20 bg-white p-6 shadow-sm"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white">
              <span className="font-[family-name:var(--font-poppins)] text-xl font-800">%83</span>
            </div>
            <p className="text-left font-[family-name:var(--font-open-sans)] text-base font-500 text-[#1E293B] md:text-lg">
              İşitme kaybı yaşayanların %83&apos;ü çözümü internette arıyor
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — DEVICE BANNER (Slot 2 — conditional)
      ═══════════════════════════════════════════════════ */}
      {props.images?.device && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative h-56 md:h-72 overflow-hidden"
        >
          <img
            src={props.images.device}
            alt="İşitme cihazı teknolojisi"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0369A1]/80 to-[#0369A1]/40" />
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <motion.div variants={fadeInUp} className="text-center">
              <motion.p
                variants={fadeInUp}
                className="font-[family-name:var(--font-poppins)] text-2xl font-800 text-white md:text-3xl lg:text-4xl"
              >
                Son Teknoloji İşitme Cihazları
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-white/70 md:text-base"
              >
                Dijital, şarj edilebilir ve Bluetooth uyumlu cihazlarla hayatınızı kolaylaştırın
              </motion.p>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — COMPARISON TABLE
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-[#1E293B] sm:text-4xl"
          >
            Farkı Duyun
          </motion.h2>
          <motion.div variants={fadeInUp} className="mx-auto mb-14 h-1 w-16 rounded-full bg-[#0369A1]" />

          <div className="grid gap-8 md:grid-cols-2">
            {/* Without Website */}
            <motion.div
              variants={slideInLeft}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-poppins)] text-xl font-700 text-[#1E293B]">
                  Web Siteniz Yoksa
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Hastalar sizi bulamıyor',
                  'Rakibinizin bilgisine güveniyorlar',
                  'Cihaz fiyatlarınız görünmüyor',
                  'Güven oluşturamıyorsunuz',
                  'Büyüyemiyorsunuz',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-[family-name:var(--font-open-sans)] text-sm text-[#1E293B]/55"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-xs text-red-400">
                      &times;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* With Website */}
            <motion.div
              variants={slideInRight}
              className="rounded-2xl border-2 border-[#0369A1]/25 bg-gradient-to-br from-white to-[#0369A1]/[0.02] p-8 shadow-lg shadow-[#0369A1]/5 md:p-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0369A1]/10">
                  <svg className="h-5 w-5 text-[#0369A1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-poppins)] text-xl font-700 text-[#0369A1]">
                  Web Siteniz Olursa
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Google\'da ilk sırada çıkıyorsunuz',
                  'Doğru bilgiyi siz sunuyorsunuz',
                  'Şeffaf fiyat listesi',
                  'Profesyonel marka imajı',
                  'Hasta portföyü sürekli artıyor',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-[family-name:var(--font-open-sans)] text-sm font-500 text-[#1E293B]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0369A1]/10 text-xs font-700 text-[#0369A1]">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — CHAT CTA
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative overflow-hidden bg-gradient-to-br from-[#0369A1] to-[#024E7A] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#F97316]/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div variants={scaleIn} className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <svg className="h-7 w-7 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-poppins)] text-3xl font-700 text-white md:text-4xl"
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-open-sans)] text-base text-white/60"
          >
            {props.firmName} için profesyonel bir web sitesi tasarlayalım.
            Sadece 2 dakikada ücretsiz teklifinizi alın.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-12 py-4 font-[family-name:var(--font-poppins)] text-sm font-700 uppercase tracking-wide text-white shadow-lg shadow-[#F97316]/30 transition-all hover:bg-[#EA6C0C] hover:shadow-xl active:scale-[0.97]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Hemen Teklif Al
          </motion.a>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — GUARANTEE BADGES
      ═══════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-5xl">
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-center font-[family-name:var(--font-poppins)] text-3xl font-700 text-[#1E293B] sm:text-4xl"
          >
            Neden Biz?
          </motion.h2>
          <motion.div variants={fadeInUp} className="mx-auto mb-14 h-1 w-16 rounded-full bg-[#0369A1]" />

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                ),
                title: 'Ücretsiz Test',
                desc: 'İlk işitme testi ve ihtiyaç analizi tamamen ücretsiz, taahhütsüz.',
              },
              {
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                title: 'Uzman Kadro',
                desc: 'Odyoloji uzmanları ve deneyimli teknik ekiple profesyonel hizmet.',
              },
              {
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Cihaz Garantisi',
                desc: 'Tüm cihazlarda üretici garantisi ve satış sonrası teknik destek.',
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={scaleIn}
                className="group rounded-2xl border-2 border-[#0369A1]/10 bg-white p-8 text-center transition-all hover:border-[#0369A1]/30 hover:shadow-lg hover:shadow-[#0369A1]/5"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#0369A1]/8 text-[#0369A1] transition-colors group-hover:bg-[#0369A1] group-hover:text-white">
                  {card.icon}
                </div>
                <h3 className="font-[family-name:var(--font-poppins)] text-lg font-700 text-[#1E293B]">
                  {card.title}
                </h3>
                <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm leading-relaxed text-[#1E293B]/50">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer className="bg-[#0F172A] px-6 py-12 text-center md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto mb-5 h-px w-12 bg-[#0369A1]/30" />
          <p className="font-[family-name:var(--font-open-sans)] text-sm text-white/40">
            Bu sayfa {props.firmName} için{' '}
            <a
              href="https://vorte.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-500 text-[#0369A1] transition-colors hover:text-[#0369A1]/80"
            >
              Vorte Studio
            </a>{' '}
            tarafından hazırlanmıştır.
          </p>
        </div>
      </footer>
    </div>
  )
}
