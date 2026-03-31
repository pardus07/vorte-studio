'use client'

import { Montserrat, Nunito } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const montserrat = Montserrat({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  variable: '--font-nunito',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}

export default function TirnakStudyosuTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${montserrat.variable} ${nunito.variable} min-h-screen bg-[#FFF1F5] text-[#1C1917]`}>
      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-24 lg:py-32"
      >
        {/* Decorative background blobs */}
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,157,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }}
        />

        <div className={`relative mx-auto ${props.images?.hero ? 'max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center gap-12' : 'max-w-3xl text-center'}`}>
          <div>
            {/* Pill badge */}
            <motion.div
              variants={fadeInUp}
              className={`mb-8 flex items-center gap-2 ${props.images?.hero ? '' : 'justify-center'}`}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FF6B9D]/10 px-4 py-1.5 ring-1 ring-[#FF6B9D]/20">
                <span className="inline-block h-2 w-2 rounded-full bg-[#FF6B9D]" />
                <span className="font-[family-name:var(--font-nunito)] text-xs font-500 uppercase tracking-[0.18em] text-[#FF6B9D]">
                  Nail Art & Bakım
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-montserrat)] text-4xl font-800 leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
            >
              Her tırnak bir{' '}
              <span
                className="relative inline-block text-[#FF6B9D]"
              >
                sanat eseri
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C40 2 80 4 120 6C150 7.5 180 4 198 2"
                    stroke="#FF6B9D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{ opacity: 0.4 }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className={`mt-6 max-w-lg font-[family-name:var(--font-nunito)] text-base leading-relaxed text-[#1C1917]/55 md:text-lg ${props.images?.hero ? '' : 'mx-auto'}`}
            >
              {props.firmName} &mdash; {props.city}&apos;da profesyonel tırnak bakımı ve nail art tasarım stüdyosu
            </motion.p>

            {/* Google Rating */}
            {props.googleRating && props.googleRating > 0 && (
              <motion.div
                variants={fadeInUp}
                className={`mt-8 flex items-center gap-3 ${props.images?.hero ? '' : 'justify-center'}`}
              >
                <div className="flex items-center gap-0.5 rounded-full bg-white/80 px-4 py-2 shadow-sm ring-1 ring-[#FF6B9D]/10">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3.5 w-3.5 ${i < Math.round(props.googleRating!) ? 'text-[#FF6B9D]' : 'text-[#FF6B9D]/20'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 font-[family-name:var(--font-montserrat)] text-base font-700 text-[#FF6B9D]">
                    {props.googleRating}
                  </span>
                  {props.googleReviews && (
                    <span className="ml-1 font-[family-name:var(--font-nunito)] text-xs text-[#1C1917]/40">
                      ({props.googleReviews} yorum)
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              variants={fadeInUp}
              className={`mt-10 flex flex-col items-center gap-4 sm:flex-row ${props.images?.hero ? '' : 'sm:justify-center'}`}
            >
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center gap-2 rounded-full bg-[#FF6B9D] px-10 py-3.5 font-[family-name:var(--font-montserrat)] text-sm font-700 uppercase tracking-wide text-white shadow-lg shadow-[#FF6B9D]/25 transition-all hover:bg-[#f05a8b] hover:shadow-xl hover:shadow-[#FF6B9D]/35 active:scale-[0.97]"
              >
                Ücretsiz Teklif Al
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Hero Image — Pink-Shadowed Card */}
          {props.images?.hero ? (
            <motion.div
              variants={fadeInRight}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Pink shadow card behind */}
                <div className="absolute inset-0 rounded-2xl bg-[#FF6B9D]/30 translate-x-3 translate-y-3" />
                <div
                  className="relative h-80 w-72 overflow-hidden rounded-2xl shadow-xl"
                  style={{ transform: 'rotate(3deg)' }}
                >
                  <img
                    src={props.images.hero}
                    alt={props.firmName}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-4 py-2.5 shadow-lg ring-1 ring-[#FF6B9D]/10">
                  <span className="text-lg">💅</span>
                  <span className="ml-2 font-[family-name:var(--font-montserrat)] text-xs font-700 text-[#1C1917]">
                    Nail Art
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={scaleIn}
              className="mx-auto mt-14 flex h-36 w-36 items-center justify-center rounded-full lg:hidden"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(236,72,153,0.08))' }}
            >
              <span className="text-5xl">💅</span>
            </motion.div>
          )}
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
          <motion.div variants={fadeInUp} className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6B9D]/10">
            <span className="text-3xl">📱</span>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-montserrat)] text-2xl font-700 leading-relaxed text-white md:text-3xl"
          >
            Nail art arayanların{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#FF6B9D]">%95&apos;i</span>
              <span className="absolute bottom-0.5 left-0 right-0 z-0 h-3 rounded bg-[#FF6B9D]/15" />
            </span>{' '}
            görsel platformlarda geziyor
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto my-10 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#FF6B9D]/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B9D]" />
            <span className="h-px w-8 bg-[#FF6B9D]/40" />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-nunito)] text-base leading-relaxed text-white/50 md:text-lg"
          >
            Instagram&apos;ı web sitenizle desteklemelisiniz. Müşterileriniz sizi Instagram&apos;da keşfediyor ama fiyat, randevu ve galeri için profesyonel bir web sitesine ihtiyacınız var.
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
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-lg text-center">
          <span className="mb-3 inline-block font-[family-name:var(--font-nunito)] text-xs font-500 uppercase tracking-[0.2em] text-[#FF6B9D]">
            Karşılaştırma
          </span>
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-800 text-[#1C1917] md:text-4xl">
            Farkı görün
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInLeft}
            className="relative overflow-hidden rounded-3xl border border-[#1C1917]/8 bg-white/50 p-8 backdrop-blur-sm md:p-10"
          >
            {/* Top stripe */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-[#1C1917]/10" />
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C1917]/5 text-lg">😔</span>
              <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-700 text-[#1C1917]">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Portföyünüz görünmüyor',
                'Sadece Instagram\'a bağımlısınız',
                'Fiyat bilgisi kapalı',
                'Online randevu yok',
                'Yeni müşteri bulamıyorsunuz',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-[family-name:var(--font-nunito)] text-sm text-[#1C1917]/50"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1C1917]/5">
                    <svg className="h-3 w-3 text-[#1C1917]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Website */}
          <motion.div
            variants={fadeInRight}
            className="relative overflow-hidden rounded-3xl border-2 border-[#FF6B9D] bg-white/80 p-8 shadow-xl shadow-[#FF6B9D]/10 md:p-10"
          >
            {/* Top stripe */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#FF6B9D] to-[#EC4899]" />
            {/* Popular badge */}
            <div className="absolute -right-8 top-6 rotate-45 bg-[#FF6B9D] px-10 py-1">
              <span className="font-[family-name:var(--font-montserrat)] text-[10px] font-700 uppercase tracking-wider text-white">
                Tercih
              </span>
            </div>
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B9D]/10 text-lg">✨</span>
              <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-700 text-[#FF6B9D]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                'Nail art galeriniz açık',
                'Web + Instagram gücü',
                'Şeffaf fiyat listesi',
                '7/24 online randevu',
                'Google\'dan yeni müşteriler',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-[family-name:var(--font-nunito)] text-sm text-[#1C1917]/75"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B9D]/10">
                    <svg className="h-3 w-3 text-[#FF6B9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== GALLERY — Çalışmalarımız ===== */}
      {(props.images?.gallery || props.images?.gallery2) && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="px-6 py-16 md:px-12 lg:px-24"
        >
          <div className="mx-auto max-w-3xl">
            <motion.div variants={fadeInUp} className="mb-10 text-center">
              <span className="mb-2 inline-block font-[family-name:var(--font-nunito)] text-xs font-500 uppercase tracking-[0.2em] text-[#FF6B9D]">
                Portfolyo
              </span>
              <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-800 text-[#1C1917] md:text-3xl">
                Çalışmalarımız
              </h3>
            </motion.div>
            <div className="grid grid-cols-2 gap-5">
              {props.images?.gallery && (
                <motion.div
                  variants={fadeInLeft}
                  className="group relative overflow-hidden rounded-2xl border-2 border-[#FF6B9D]/30 transition-all hover:border-[#FF6B9D]/60 hover:shadow-lg hover:shadow-[#FF6B9D]/10"
                >
                  <img
                    src={props.images.gallery}
                    alt="Nail art 1"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              )}
              {props.images?.gallery2 && (
                <motion.div
                  variants={fadeInRight}
                  className="group relative overflow-hidden rounded-2xl border-2 border-[#FF6B9D]/30 transition-all hover:border-[#FF6B9D]/60 hover:shadow-lg hover:shadow-[#FF6B9D]/10"
                >
                  <img
                    src={props.images.gallery2}
                    alt="Nail art 2"
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ===== CHAT CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-6 py-20 md:px-12 lg:px-24 lg:py-28"
        style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #EC4899 100%)' }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div
            variants={scaleIn}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
          >
            <span className="text-3xl">💅</span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-montserrat)] text-3xl font-800 text-white md:text-4xl lg:text-5xl"
          >
            Stüdyonuzu dijitale taşıyalım
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-md font-[family-name:var(--font-nunito)] text-base leading-relaxed text-white/75"
          >
            Galeri, fiyat listesi ve online randevu sistemi ile müşterilerinize profesyonel bir deneyim sunun
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-12 py-4 font-[family-name:var(--font-montserrat)] text-sm font-700 uppercase tracking-wide text-[#FF6B9D] shadow-xl shadow-[#1C1917]/10 transition-all hover:bg-[#1C1917] hover:text-white active:scale-[0.97]"
          >
            Ücretsiz Teklif Al
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
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
        <motion.div variants={fadeInUp} className="mx-auto mb-14 max-w-md text-center">
          <span className="mb-3 inline-block font-[family-name:var(--font-nunito)] text-xs font-500 uppercase tracking-[0.2em] text-[#FF6B9D]">
            Neden biz?
          </span>
          <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-800 text-[#1C1917] md:text-4xl">
            Güvencemiz
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              emoji: '🎨',
              title: 'Ücretsiz Danışmanlık',
              desc: 'İlk görüşme ve tasarım analizi tamamen ücretsiz. Hiçbir taahhüt yok.',
              color: 'from-[#FF6B9D]/8 to-[#EC4899]/4',
            },
            {
              emoji: '🧴',
              title: 'Hijyen Garantisi',
              desc: 'Stüdyonuzun hijyen standartlarını öne çıkaran profesyonel tasarım.',
              color: 'from-[#EC4899]/8 to-[#FF6B9D]/4',
            },
            {
              emoji: '💎',
              title: 'Sanatsal Tasarım',
              desc: 'Nail art portföyünüzü en iyi şekilde sergileyen galeri odaklı site.',
              color: 'from-[#FF6B9D]/6 to-[#F472B6]/4',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-3xl border border-[#FF6B9D]/10 bg-white/60 p-8 text-center transition-all hover:border-[#FF6B9D]/30 hover:shadow-xl hover:shadow-[#FF6B9D]/8"
            >
              {/* Subtle gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B9D]/10 text-2xl transition-transform group-hover:scale-110">
                  {item.emoji}
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-base font-700 text-[#1C1917]">
                  {item.title}
                </h3>
                <p className="mt-3 font-[family-name:var(--font-nunito)] text-sm leading-relaxed text-[#1C1917]/50">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
        className="bg-[#1C1917] px-6 py-14 md:px-12"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-6 text-center">
            {/* Decorative divider */}
            <div className="flex items-center gap-2">
              <span className="h-px w-10 bg-[#FF6B9D]/25" />
              <span className="text-sm">💅</span>
              <span className="h-px w-10 bg-[#FF6B9D]/25" />
            </div>

            <p className="font-[family-name:var(--font-nunito)] text-sm text-white/35">
              Bu sayfa {props.firmName} için{' '}
              <span className="font-500 text-[#FF6B9D]">Vorte Studio</span>{' '}
              tarafından hazırlanmıştır.
            </p>

            <div className="flex items-center gap-4">
              {props.phone && (
                <a
                  href={`tel:${props.phone}`}
                  className="font-[family-name:var(--font-nunito)] text-xs text-white/25 transition-colors hover:text-[#FF6B9D]"
                >
                  {props.phone}
                </a>
              )}
              {props.phone && props.address && (
                <span className="h-3 w-px bg-white/10" />
              )}
              {props.address && (
                <span className="font-[family-name:var(--font-nunito)] text-xs text-white/25">
                  {props.address}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
