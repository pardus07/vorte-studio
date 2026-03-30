'use client'

import { Crimson_Pro, Hind } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const crimsonPro = Crimson_Pro({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson-pro',
  display: 'swap',
})

const hind = Hind({
  subsets: ['latin-ext'],
  weight: ['400', '500'],
  variable: '--font-hind',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function PsikologDanismaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)

  return (
    <div className={`${crimsonPro.variable} ${hind.variable} min-h-screen bg-[#FAF5FF] text-[#1C1917]`}>
      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-5 py-28 md:px-12 lg:px-24 lg:py-36"
      >
        {/* Soft lavender gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #FAF5FF 0%, #F3F0FF 100%)',
          }}
        />

        {/* Decorative soft blobs */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #DDD6FE 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #DDD6FE 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div variants={fadeInUp} className="mb-5 inline-block rounded-full bg-[#DDD6FE]/50 px-5 py-2">
            <span className="font-[family-name:var(--font-hind)] text-sm font-medium text-[#6D28D9]">
              Psikolojik Danışmanlık
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-[family-name:var(--font-crimson-pro)] text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            İyi hissetmek bir seçim &mdash;{' '}
            <span className="text-[#6D28D9]">doğru desteği almak da</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-xl font-[family-name:var(--font-hind)] text-base text-[#1C1917]/65 md:text-lg"
          >
            {props.firmName} &mdash; {props.city}&apos;da profesyonel psikolojik danışmanlık
          </motion.p>

          {/* Google Rating */}
          {props.googleRating && props.googleRating > 0 && (
            <motion.div variants={fadeInUp} className="mt-6 flex items-center justify-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(props.googleRating!) ? 'text-[#6D28D9]' : 'text-[#DDD6FE]'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-[family-name:var(--font-crimson-pro)] text-sm font-semibold text-[#6D28D9]">
                {props.googleRating}
              </span>
              {props.googleReviews && (
                <span className="font-[family-name:var(--font-hind)] text-sm text-[#1C1917]/45">
                  ({props.googleReviews} değerlendirme)
                </span>
              )}
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`/p/${props.slug}/demo`}
              onClick={() => trackEvent(props.slug, 'DEMO_CLICK')}
              className="inline-flex items-center justify-center rounded-full bg-[#6D28D9] px-9 py-3.5 font-[family-name:var(--font-hind)] text-base font-medium text-white shadow-lg shadow-[#6D28D9]/20 transition-all hover:bg-[#5B21B6] hover:shadow-xl hover:shadow-[#6D28D9]/30 active:scale-[0.97]"
            >
              Demo Siteyi Gör
            </a>
            <a
              href={`/p/${props.slug}/chat`}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center justify-center rounded-full bg-[#DDD6FE] px-9 py-3.5 font-[family-name:var(--font-hind)] text-base font-medium text-[#6D28D9] shadow-md shadow-[#DDD6FE]/30 transition-all hover:bg-[#C4B5FD] hover:shadow-lg active:scale-[0.97]"
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
        className="px-5 py-14 md:px-12 lg:px-24"
      >
        <motion.div
          variants={fadeInUp}
          className="mx-auto max-w-2xl rounded-2xl border-l-4 border-[#6D28D9] bg-white p-8 shadow-md shadow-[#6D28D9]/5 md:p-10"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDD6FE]/60">
              <svg className="h-5 w-5 text-[#6D28D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 className="font-[family-name:var(--font-crimson-pro)] text-xl font-bold text-[#1C1917] md:text-2xl">
              Biliyor muydunuz?
            </h2>
          </div>

          <p className="font-[family-name:var(--font-hind)] text-base leading-relaxed text-[#1C1917]/80">
            Psikolojik destek arayanların <strong className="text-[#6D28D9]">%90&apos;ı</strong> önce online araştırma yapıyor.
            Sizi bulamazlarsa, güvenmedikleri birine gidiyorlar.
          </p>

          <motion.p
            variants={fadeInUp}
            className="mt-4 font-[family-name:var(--font-crimson-pro)] text-base font-semibold text-[#6D28D9]/80"
          >
            Güvenilir bir online varlık, ilk adımı kolaylaştırır.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ===== COMPARISON ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-5 py-14 md:px-12 lg:px-24"
      >
        <motion.h2
          variants={fadeInUp}
          className="mb-10 text-center font-[family-name:var(--font-crimson-pro)] text-2xl font-bold md:text-3xl"
        >
          Fark nerede başlıyor?
        </motion.h2>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Without Website */}
          <motion.div
            variants={fadeInUp}
            className="rounded-2xl bg-[#FEF2F2] p-6 shadow-sm md:p-8"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-base font-bold text-red-500">
                ✕
              </span>
              <h3 className="font-[family-name:var(--font-crimson-pro)] text-lg font-bold text-red-800">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-3.5">
              {[
                'Danışanlar sizi bulamıyor',
                'Yaklaşımınızı anlatamıyorsunuz',
                'Gizlilik güvencesi veremiyorsunuz',
                'İlk seans korkusu artıyor',
                'Online seans seçeneği sunulamıyor',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-[family-name:var(--font-hind)] text-sm text-red-700/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200/60 text-xs text-red-500">
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
            className="rounded-2xl bg-[#F3F0FF] p-6 shadow-sm md:p-8"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDD6FE]/70 text-base font-bold text-[#6D28D9]">
                ✓
              </span>
              <h3 className="font-[family-name:var(--font-crimson-pro)] text-lg font-bold text-[#6D28D9]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-3.5">
              {[
                'Google\'da güvenle bulunuyorsunuz',
                'Terapi yaklaşımınızı tanıtabiliyorsunuz',
                'Gizlilik politikası ile güven veriyorsunuz',
                '"İlk seans ücretsiz" CTA ile cesaret veriyorsunuz',
                'Online danışmanlık hizmeti sunabiliyorsunuz',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-[family-name:var(--font-hind)] text-sm text-[#1C1917]/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DDD6FE]/60 text-xs text-[#6D28D9]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== DEMO CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-5 py-14 md:px-12 lg:px-24"
      >
        <motion.div
          variants={fadeInUp}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl p-8 text-center shadow-lg md:p-12"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
          }}
        >
          {/* Decorative soft circle */}
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #DDD6FE 0%, transparent 70%)' }}
          />

          <h2 className="relative font-[family-name:var(--font-crimson-pro)] text-2xl font-bold text-white md:text-3xl">
            Danışmanlık Pratiğinize Özel Demo Siteyi Görün
          </h2>
          <p className="relative mx-auto mt-4 max-w-md font-[family-name:var(--font-hind)] text-sm text-white/75">
            Size özel hazırlanan demo sayfayı inceleyerek web sitenizin nasıl görüneceğini keşfedin.
          </p>
          <a
            href={`/p/${props.slug}/demo`}
            onClick={() => trackEvent(props.slug, 'DEMO_CLICK')}
            className="relative mt-8 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 font-[family-name:var(--font-hind)] text-base font-medium text-[#6D28D9] shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-[0.97]"
          >
            Demo Siteyi Gör
          </a>
        </motion.div>
      </motion.section>

      {/* ===== CHAT CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="px-5 py-16 md:px-12 lg:px-24"
        style={{ background: 'linear-gradient(180deg, #FAF5FF 0%, #F3F0FF 40%, #EDE9FE 100%)' }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-crimson-pro)] text-2xl font-bold text-[#1C1917] md:text-4xl">
            Ücretsiz Teklif Alın &mdash; İlk Adımı Birlikte Atalım
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-[family-name:var(--font-hind)] text-base text-[#1C1917]/65">
            Danışanlarınıza güven veren, sizi doğru yansıtan bir web sitesi için
            hemen iletişime geçin.
          </p>

          <motion.a
            href={`/p/${props.slug}/chat`}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#6D28D9] px-12 py-4 font-[family-name:var(--font-hind)] text-lg font-medium text-white shadow-xl shadow-[#6D28D9]/25 transition-all hover:bg-[#5B21B6] active:scale-[0.97]"
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
        className="px-5 py-14 md:px-12 lg:px-24"
      >
        <motion.h2
          variants={fadeInUp}
          className="mb-10 text-center font-[family-name:var(--font-crimson-pro)] text-2xl font-bold md:text-3xl"
        >
          Güvenle çalışın
        </motion.h2>

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-7 w-7 text-[#6D28D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              ),
              title: 'Ücretsiz Keşif',
              desc: 'İlk görüşme ve ihtiyaç analizi tamamen ücretsiz.',
            },
            {
              icon: (
                <svg className="h-7 w-7 text-[#6D28D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ),
              title: 'Tam Gizlilik',
              desc: 'Bilgileriniz tamamen gizli tutulur.',
            },
            {
              icon: (
                <svg className="h-7 w-7 text-[#6D28D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
              ),
              title: 'Online Seans Desteği',
              desc: 'Online danışmanlık altyapısı hazır gelir.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="rounded-2xl bg-[#F3F0FF] p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDD6FE]/50">
                  {item.icon}
                </div>
              </div>
              <h3 className="font-[family-name:var(--font-crimson-pro)] text-base font-bold text-[#1C1917]">
                {item.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-hind)] text-sm text-[#1C1917]/60">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeInUp}
          className="mt-8 text-center font-[family-name:var(--font-crimson-pro)] text-base font-semibold text-[#6D28D9]/80"
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
        className="mt-8 bg-[#2E1065] px-5 py-10 text-center md:px-12"
      >
        <p className="font-[family-name:var(--font-hind)] text-sm text-white/50">
          Bu sayfa {props.firmName} için{' '}
          <span className="font-medium text-[#DDD6FE]">Vorte Studio</span> tarafından hazırlanmıştır.
        </p>
      </motion.section>
    </div>
  )
}
