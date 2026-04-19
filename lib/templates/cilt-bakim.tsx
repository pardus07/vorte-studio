'use client'

import { Gilda_Display, Hind_Siliguri } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { suffixDe, suffixIn } from './turkish-grammar'
import { useTrackPageView, trackEvent } from './use-track'

const gildaDisplay = Gilda_Display({
  subsets: ['latin-ext'],
  weight: ['400'],
  variable: '--font-gilda-display',
  display: 'swap',
})

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-hind-siliguri',
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

export default function CiltBakimTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)
  const hasHero = !!props.images?.hero
  const center = hasHero ? '' : 'justify-center'
  const centerMx = hasHero ? '' : 'mx-auto'

  return (
    <div className={`${gildaDisplay.variable} ${hindSiliguri.variable} min-h-screen bg-[#FEF9F0] text-[#3B1A06]`}>

      {/* ===== HERO ===== */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-24 lg:py-32"
      >
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #92400E 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className={`relative mx-auto ${hasHero
          ? 'grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2'
          : 'max-w-3xl text-center'}`}
        >
          {/* Text column */}
          <div>
            <motion.div variants={fadeInUp} className={`mb-8 flex items-center gap-3 ${center}`}>
              <div className="h-px w-12 bg-[#92400E]/40" />
              <span className="font-[family-name:var(--font-hind-siliguri)] text-xs uppercase tracking-[0.2em] text-[#92400E]/50">
                Profesyonel Cilt Bakımı
              </span>
              <div className="h-px w-12 bg-[#92400E]/40" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-gilda-display)] text-4xl leading-[1.15] tracking-tight text-[#92400E] md:text-5xl lg:text-[3.5rem]"
            >
              Cildiniz için doğru bakım, doğru uzman
            </motion.h1>

            <motion.p variants={fadeInUp}
              className={`mt-6 max-w-xl font-[family-name:var(--font-hind-siliguri)] text-base leading-relaxed text-[#3B1A06]/55 md:text-lg ${centerMx}`}
            >
              {props.firmName} &mdash; {suffixDe(props.city)} cildinize özel bakım protokolleri sunan güvenilir adres.
            </motion.p>

            <motion.div variants={fadeInUp} className={`mt-8 h-px w-20 bg-[#92400E]/25 ${centerMx}`} />

            {/* Google Rating */}
            {props.googleRating && props.googleRating > 0 && (
              <motion.div variants={fadeInUp} className={`mt-8 flex items-center gap-3 ${center}`}>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(props.googleRating!) ? 'text-[#92400E]' : 'text-[#92400E]/20'}`}
                      fill="currentColor" viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-[family-name:var(--font-gilda-display)] text-lg text-[#92400E]">
                  {props.googleRating}
                </span>
                {props.googleReviews && (
                  <span className="font-[family-name:var(--font-hind-siliguri)] text-sm text-[#3B1A06]/40">
                    ({props.googleReviews} değerlendirme)
                  </span>
                )}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div variants={fadeInUp}
              className={`mt-12 flex flex-col items-center gap-4 sm:flex-row ${hasHero ? '' : 'sm:justify-center'}`}
            >
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#16A34A] px-10 py-3.5 font-[family-name:var(--font-hind-siliguri)] text-sm font-600 uppercase tracking-[0.12em] text-white shadow-lg shadow-[#16A34A]/20 transition-all hover:bg-[#15803D] hover:shadow-xl hover:shadow-[#16A34A]/30 active:scale-[0.97]"
              >
                <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Ücretsiz Teklif Al
              </a>
            </motion.div>
          </div>

          {/* Hero Image — Tall Vertical Card (Slot 1: hero, 1:1) */}
          {hasHero ? (
            <motion.div variants={fadeInUp} className="hidden items-center justify-center lg:flex">
              <div className="relative">
                <div className="h-96 w-72 overflow-hidden rounded-2xl border border-[#92400E]/20 shadow-xl shadow-[#92400E]/10">
                  <img src={props.images!.hero} alt={props.firmName} className="h-full w-full object-cover" />
                </div>
                {/* Leaf decoration */}
                <div className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A]/10 text-2xl">
                  🍃
                </div>
                {/* Accent dot */}
                <div className="absolute -left-2 -top-2 h-5 w-5 rounded-full border-2 border-[#92400E]/30 bg-[#FEF9F0]" />
              </div>
            </motion.div>
          ) : (
            <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-[#92400E]/10 to-[#16A34A]/10">
                <span className="text-7xl">🌿</span>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* ===== ALARM ===== */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative bg-[#78350F] px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FEF9F0]/20 to-transparent" />
        <div className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp}
            className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#FEF9F0]/15"
          >
            <svg className="h-6 w-6 text-[#FEF9F0]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </motion.div>

          <motion.p variants={fadeInUp}
            className="font-[family-name:var(--font-gilda-display)] text-2xl leading-relaxed text-[#FEF9F0] md:text-3xl"
          >
            Cilt sorunu yaşayanlar online uzman arıyor. Bulamazlarsa yanlış ürün alıyorlar.
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto my-10 h-px w-20 bg-[#FEF9F0]/20" />

          <motion.div variants={fadeInUp}
            className="inline-flex items-center gap-3 rounded-full border border-[#FEF9F0]/10 bg-[#FEF9F0]/5 px-6 py-3"
          >
            <span className="font-[family-name:var(--font-gilda-display)] text-2xl text-[#FEF9F0]">%74</span>
            <span className="font-[family-name:var(--font-hind-siliguri)] text-sm text-[#FEF9F0]/50">
              cilt bakımı araştırmasında dijital kaynak tercih ediliyor
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== COMPARISON ===== */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <motion.div variants={fadeInUp} className="mb-14 text-center">
          <span className="mb-3 inline-block font-[family-name:var(--font-hind-siliguri)] text-xs uppercase tracking-[0.2em] text-[#16A34A]">
            Karşılaştırma
          </span>
          <h2 className="font-[family-name:var(--font-gilda-display)] text-2xl text-[#92400E] md:text-3xl">
            Farkı hissedin
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Without */}
          <motion.div variants={fadeInUp}
            className="rounded-2xl border border-[#92400E]/12 bg-gradient-to-b from-[#FEF9F0] to-[#F5EDE0] p-8 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B1A06]/8">
                <svg className="h-4 w-4 text-[#3B1A06]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-gilda-display)] text-xl text-[#3B1A06]">
                Web Siteniz Yoksa
              </h3>
            </div>
            <ul className="space-y-4">
              {['Uzmanlığınız bilinmiyor', 'Yanlış ürün alıyorlar', 'Güven oluşturamıyorsunuz', 'Sertifikalarınız görünmüyor', 'Büyüyemiyorsunuz'].map((t) => (
                <li key={t} className="flex items-start gap-3 font-[family-name:var(--font-hind-siliguri)] text-sm text-[#3B1A06]/55">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B1A06]/20" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With */}
          <motion.div variants={fadeInUp}
            className="rounded-2xl border border-[#16A34A]/25 bg-gradient-to-b from-[#FEF9F0] to-[#F0FAF3] p-8 shadow-sm shadow-[#16A34A]/5 md:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A]/10">
                <svg className="h-4 w-4 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-gilda-display)] text-xl text-[#16A34A]">
                Web Siteniz Olursa
              </h3>
            </div>
            <ul className="space-y-4">
              {['Dermatoloji deneyiminizi sergiliyorsunuz', 'Doğru bakım öneriyorsunuz', 'Profesyonel güven imajı', 'Tüm sertifikalar açık', 'Müşteri portföyü artıyor'].map((t) => (
                <li key={t} className="flex items-start gap-3 font-[family-name:var(--font-hind-siliguri)] text-sm text-[#3B1A06]/80">
                  <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== CHAT CTA ===== */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="relative px-6 py-20 md:px-12 lg:px-24 lg:py-28"
        style={{ background: 'linear-gradient(145deg, #92400E 0%, #78350F 55%, #451A03 100%)' }}
      >
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FEF9F0]/[0.03]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-1/3 translate-y-1/3 rounded-full bg-[#16A34A]/[0.06]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div variants={fadeInUp} className="mx-auto mb-8 h-px w-12 bg-[#FEF9F0]/25" />

          <motion.h2 variants={fadeInUp}
            className="font-[family-name:var(--font-gilda-display)] text-3xl text-[#FEF9F0] md:text-4xl"
          >
            Cildinize Özel Teklif Alın
          </motion.h2>

          <motion.p variants={fadeInUp}
            className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-hind-siliguri)] text-base leading-relaxed text-[#FEF9F0]/50"
          >
            Doğal ve etkili çözümlerle tanışın. Uzman kadromuzla ücretsiz cilt
            analizi yapın, size özel bakım protokolünüzü oluşturalım.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mt-10 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FEF9F0] px-12 py-4 font-[family-name:var(--font-hind-siliguri)] text-sm font-600 uppercase tracking-[0.12em] text-[#92400E] shadow-lg shadow-black/10 transition-all hover:bg-white hover:shadow-xl active:scale-[0.97]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ücretsiz Teklif Al
          </motion.a>
        </div>
      </motion.section>

      {/* ===== GUARANTEE ===== */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="px-6 py-20 md:px-12 lg:px-24 lg:py-28"
      >
        <div className="mx-auto max-w-4xl">
          {/* Products Image Card (Slot 2: products, 4:3) */}
          {props.images?.products && (
            <motion.div variants={fadeInUp}
              className="mb-12 overflow-hidden rounded-2xl border border-[#16A34A]/20 shadow-md"
            >
              <div className="relative h-48 md:h-56">
                <img
                  src={props.images.products}
                  alt="Cilt bakım ürünleri"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FEF9F0]/80 to-transparent" />
                <p className="absolute bottom-4 left-6 font-[family-name:var(--font-gilda-display)] text-xl text-[#92400E]">
                  Doğal &amp; Profesyonel Ürünler
                </p>
              </div>
            </motion.div>
          )}

          {/* 3 Guarantee Badges */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                title: 'Ücretsiz Cilt Analizi',
                desc: 'İlk görüşme ve cilt tipi tespiti tamamen ücretsiz.',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ),
                title: 'Doğal Ürünler',
                desc: 'Cildinize uygun doğal ve güvenli bakım önerileri.',
              },
              {
                icon: (
                  <svg className="h-6 w-6 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Uzman Kadro',
                desc: 'Deneyimli dermatoloji uzmanlarından güvenilir bakım.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="rounded-2xl border border-[#92400E]/10 bg-gradient-to-b from-[#FEF9F0] to-[#FAF5EB] p-8 text-center transition-all hover:border-[#16A34A]/30 hover:shadow-md"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A]/10">
                  {item.icon}
                </div>
                <h3 className="font-[family-name:var(--font-gilda-display)] text-lg text-[#92400E]">
                  {item.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-hind-siliguri)] text-sm text-[#3B1A06]/50">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.section
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        className="bg-[#451A03] px-6 py-12 text-center md:px-12"
      >
        <div className="mx-auto mb-6 h-px w-10 bg-[#FEF9F0]/15" />
        <p className="font-[family-name:var(--font-hind-siliguri)] text-sm text-[#FEF9F0]/35">
          Bu sayfa {props.firmName} için{' '}
          <a
            href="https://vorte.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-500 text-[#16A34A] transition-colors hover:text-[#22C55E]"
          >
            Vorte Studio
          </a>{' '}
          tarafından hazırlanmıştır.
        </p>
      </motion.section>
    </div>
  )
}
