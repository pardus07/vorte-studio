'use client'

import { Nunito, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function VeterinerKlinikleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${nunito.variable} ${inter.variable} min-h-screen bg-[#FFFDF7] text-[#1C1917]`}>
      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-5 pt-16 pb-20 md:px-12 lg:px-24 lg:pt-24 lg:pb-28"
      >
        {/* Soft green gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(255,253,247,0) 60%)',
          }}
        />

        {/* Decorative organic blob */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div variants={fadeInUp} className="mb-4 inline-block rounded-full bg-[#10B981]/10 px-4 py-1.5">
            <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#10B981]">
              Veteriner Kliniği
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-[family-name:var(--font-nunito)] text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            {props.firmName} &mdash;{' '}
            <span className="text-[#10B981]">{props.city}&apos;in</span> güvenilir veteriner kliniği
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-5 max-w-xl font-[family-name:var(--font-inter)] text-base text-[#1C1917]/70 md:text-lg"
          >
            Evcil dostlarınız en iyi bakımı hak ediyor. Profesyonel veteriner hekimlerimizle her zaman yanınızdayız.
          </motion.p>

          {/* Google Rating */}
          {props.googleRating && props.googleRating > 0 && (
            <motion.div variants={fadeInUp} className="mt-6 flex items-center justify-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(props.googleRating!) ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-[family-name:var(--font-nunito)] text-sm font-semibold text-[#1C1917]/80">
                {props.googleRating}
              </span>
              {props.googleReviews && (
                <span className="font-[family-name:var(--font-inter)] text-sm text-[#1C1917]/50">
                  ({props.googleReviews} değerlendirme)
                </span>
              )}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center justify-center rounded-full bg-[#92400E] px-8 py-3.5 font-[family-name:var(--font-nunito)] text-base font-bold text-white shadow-lg shadow-[#92400E]/20 transition-all hover:bg-[#78350F] hover:shadow-xl hover:shadow-[#92400E]/25 active:scale-[0.97]"
            >
              Ücretsiz Teklif Al
            </a>
          </motion.div>
        </div>

        {/* Paw print decorative element */}
        <div className="pointer-events-none absolute bottom-6 left-8 text-5xl opacity-[0.06] select-none">
          🐾
        </div>
      </motion.section>

      {/* ===== ALARM ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-5 py-12 md:px-12 lg:px-24"
      >
        <motion.div
          variants={fadeInUp}
          className="mx-auto max-w-2xl rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50/80 to-orange-50/60 p-8 text-center shadow-sm md:p-10"
        >
          <div className="mb-4 text-4xl">🚨</div>
          <h2 className="font-[family-name:var(--font-nunito)] text-xl font-bold text-red-800 md:text-2xl">
            Evcil hayvanı hasta olan sahipler acil veteriner arıyor.
          </h2>
          <p className="mt-2 font-[family-name:var(--font-nunito)] text-lg font-semibold text-red-700/90">
            Sizi bulamazlarsa rakibinize gidiyorlar.
          </p>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-md font-[family-name:var(--font-inter)] text-sm text-red-700/70"
          >
            Acil durumlarda saniyeler önemli &mdash; online görünürlük hayat kurtarır.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ===== COMPARISON ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-5 py-12 md:px-12 lg:px-24"
      >
        <motion.h2
          variants={fadeInUp}
          className="mb-10 text-center font-[family-name:var(--font-nunito)] text-2xl font-bold md:text-3xl"
        >
          Fark nerede başlıyor?
        </motion.h2>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50/60 to-[#FFFDF7] p-6 shadow-sm md:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-lg">✗</span>
              <h3 className="font-[family-name:var(--font-nunito)] text-lg font-bold text-red-800">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                'Acil durumlarda sizi bulamıyorlar',
                'Hizmetlerinizi öğrenemiyorlar',
                'Aşı takvimi gibi bilgiler paylaşılamıyor',
                'Güven oluşturamıyorsunuz',
                'Rakipleriniz öne geçiyor',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-[family-name:var(--font-inter)] text-sm text-red-700/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs text-red-600">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl border border-[#10B981]/20 bg-gradient-to-br from-green-50/60 to-[#FFFDF7] p-6 shadow-sm md:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-lg">✓</span>
              <h3 className="font-[family-name:var(--font-nunito)] text-lg font-bold text-[#059669]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                '7/24 online randevu alabiliyorlar',
                'Tüm hizmetlerinizi görebiliyorlar',
                'Aşı hatırlatma sistemi kurabilirsiniz',
                'Profesyonel ve güvenilir görünüyorsunuz',
                'Yeni müşteri akışı artıyor',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-[family-name:var(--font-inter)] text-sm text-[#1C1917]/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-[#10B981]">
                    ✓
                  </span>
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
        variants={fadeInUp}
        className="px-5 py-16 md:px-12 lg:px-24"
      >
        <div
          className="mx-auto max-w-4xl rounded-2xl p-10 text-center md:p-16"
          style={{
            background: 'linear-gradient(135deg, #92400E 0%, #78350F 60%, #451A03 100%)',
          }}
        >
          <div className="mb-3 text-4xl">🐕</div>

          <h2 className="font-[family-name:var(--font-nunito)] text-2xl font-bold text-white md:text-4xl">
            Ücretsiz Teklif Alın
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-[family-name:var(--font-inter)] text-base text-white/80">
            Evcil dostlarınız için en iyisi &mdash; profesyonel bir web sitesiyle güven verin.
          </p>

          <motion.a
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#FFFDF7] px-10 py-4 font-[family-name:var(--font-nunito)] text-lg font-bold text-[#92400E] shadow-xl transition-all hover:bg-white active:scale-[0.97]"
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
        className="px-5 py-12 md:px-12 lg:px-24"
      >
        <motion.h2
          variants={fadeInUp}
          className="mb-8 text-center font-[family-name:var(--font-nunito)] text-2xl font-bold md:text-3xl"
        >
          Risk yok, sadece kazanç var
        </motion.h2>

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
          {[
            { icon: '🎁', title: 'Ücretsiz Keşif', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '🤝', title: 'Taahhütsüz', desc: 'Sözleşme zorunluluğu yok, istediğiniz zaman vazgeçin.' },
            { icon: '⚡', title: 'Hızlı Teslimat', desc: 'Web siteniz en kısa sürede hazır.' },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="rounded-2xl border border-[#10B981]/10 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{item.icon}</div>
              <h3 className="font-[family-name:var(--font-nunito)] text-base font-bold text-[#1C1917]">
                {item.title}
              </h3>
              <p className="mt-1.5 font-[family-name:var(--font-inter)] text-sm text-[#1C1917]/60">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeInUp}
          className="mt-8 text-center font-[family-name:var(--font-nunito)] text-base font-semibold text-[#10B981]"
        >
          Beğenmezseniz ödeme yapmazsınız.
        </motion.p>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="mt-8 bg-[#1C1917] px-5 py-10 text-center md:px-12"
      >
        <p className="font-[family-name:var(--font-inter)] text-sm text-white/50">
          Bu sayfa {props.firmName} için{' '}
          <span className="font-medium text-[#10B981]">Vorte Studio</span> tarafından hazırlanmıştır.
        </p>
      </motion.section>
    </div>
  )
}
