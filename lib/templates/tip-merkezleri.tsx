'use client'

import { Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function TipMerkezleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  return (
    <div className={`${inter.className} min-h-screen bg-[#F8FAFC] text-[#1E293B]`}>
      {/* ── HERO ── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="bg-[#0F172A] text-white"
      >
        <div className={`mx-auto max-w-6xl px-5 py-20 lg:py-28 ${props.images?.hero ? 'lg:grid lg:grid-cols-2 lg:items-center lg:gap-12' : ''}`}>
          <div className={props.images?.hero ? 'text-center lg:text-left' : 'text-center'}>
            {/* Kurumsal badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8]/20 px-5 py-2 text-sm font-medium text-[#93C5FD] mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Kurumsal Sağlık Çözümleri
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Sağlığınız için doğru adres:{' '}
              <span className="text-[#60A5FA]">{props.firmName}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className={`text-lg sm:text-xl text-[#94A3B8] mb-8 ${props.images?.hero ? 'lg:mx-0' : 'max-w-2xl mx-auto'}`}
            >
              {props.city}&apos;da uzman hekim kadrosuyla hizmetinizdeyiz
            </motion.p>

            {/* Google Rating Badge */}
            {props.googleRating && props.googleRating > 0 && (
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2.5 bg-[#1D4ED8]/15 border border-[#1D4ED8]/30 rounded-lg px-5 py-2.5 mb-10"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(props.googleRating!) ? 'text-yellow-400' : 'text-[#475569]'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-bold text-white text-lg">{props.googleRating}</span>
                {props.googleReviews && (
                  <span className="text-[#94A3B8] text-sm">({props.googleReviews} değerlendirme)</span>
                )}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className={`flex flex-col sm:flex-row gap-4 ${props.images?.hero ? 'justify-center lg:justify-start' : 'justify-center'}`}
            >
              <a
                href={chatLink}
                onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#60A5FA] text-[#60A5FA] font-semibold px-8 py-4 rounded-lg hover:bg-[#60A5FA]/10 transition-colors text-lg"
              >
                Ücretsiz Teklif Al
              </a>
            </motion.div>
          </div>

          {/* Hero Image */}
          {props.images?.hero && (
            <motion.div
              variants={fadeUp}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="h-80 w-80 overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/20 ring-4 ring-white/10">
                <img
                  src={props.images.hero}
                  alt={props.firmName}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ── ALARM ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-16 lg:py-20"
      >
        <div className="mx-auto max-w-4xl px-5">
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-[#1D4ED8] p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-lg lg:text-xl text-[#334155] leading-relaxed mb-4">
                  Uzman hekim arayan hastalar online randevu bekliyor. Dijital sisteminiz yoksa bu hastaları kaybediyorsunuz.
                </p>
                <div className="inline-flex items-center gap-2 bg-[#DBEAFE] rounded-lg px-4 py-2">
                  <svg className="w-5 h-5 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="font-semibold text-[#1D4ED8]">
                    Hastaların %68&apos;i doktor seçimini online araştırmaya göre yapıyor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── KARŞILAŞTIRMA ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-16 lg:py-20 bg-white"
      >
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-center mb-4"
          >
            Farkı Görün
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#64748B] mb-12 max-w-xl mx-auto"
          >
            Dijital varlığınızın olup olmaması arasındaki fark
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dijital Sisteminiz Yoksa */}
            <motion.div
              variants={fadeUp}
              className="bg-[#FEF2F2] rounded-2xl p-8 lg:p-10 border border-[#FECACA] shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#DC2626] mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                Dijital Sisteminiz Yoksa
              </h3>
              <ul className="space-y-4">
                {[
                  'Hastalar size ulaşamıyor',
                  'Branş ve uzman bilgisi eksik kalıyor',
                  'Randevu sisteminiz yetersiz',
                  'Kurumsal güveniniz zedeleniyor',
                  'Hasta memnuniyeti düşüyor',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#991B1B]">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[#DC2626] flex-shrink-0" />
                    <span className="text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Dijital Sisteminiz Olursa */}
            <motion.div
              variants={fadeUp}
              className="bg-[#EFF6FF] rounded-2xl p-8 lg:p-10 border border-[#BFDBFE] shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#1D4ED8] mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Dijital Sisteminiz Olursa
              </h3>
              <ul className="space-y-4">
                {[
                  "Google'da hemen bulunuyorsunuz",
                  'Tüm branşları ve uzmanları sergiliyorsunuz',
                  '7/24 online randevu sistemi',
                  'Akredite ve güvenilir imaj',
                  'Hasta sadakati artıyor',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#1E40AF]">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#1D4ED8]/15 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── CHAT CTA ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="bg-[#0F172A] py-20 lg:py-24"
      >
        <div className="mx-auto max-w-4xl px-5 text-center">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-[#1D4ED8]/15 border border-[#1D4ED8]/30 rounded-full px-4 py-1.5 text-sm font-medium text-[#93C5FD] mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ücretsiz Danışmanlık
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
          >
            Ücretsiz Teklif Alın
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg text-[#94A3B8] mb-4 max-w-xl mx-auto"
          >
            Kurumsal Dijital Dönüşümünüzü Başlatın
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[#64748B] mb-10 max-w-md mx-auto"
          >
            Taahhüt yok, zorlama yok — sadece profesyonel bir dijital çözüm önerisi
          </motion.p>

          <motion.a
            variants={fadeUp}
            href={chatLink}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-[#1D4ED8] text-white font-bold px-12 py-5 rounded-xl hover:bg-[#2563EB] transition-colors text-xl shadow-xl shadow-[#1D4ED8]/30"
          >
            Ücretsiz Teklif Al
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </div>
      </motion.section>

      {/* ── GÜVENCE ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-16 lg:py-20 bg-white"
      >
        <div className="mx-auto max-w-4xl px-5">
          <motion.p
            variants={fadeUp}
            className="text-center text-lg text-[#64748B] mb-10"
          >
            Tamamen ücretsiz keşif görüşmesi. Beğenmezseniz hiçbir ücret ödemezsiniz.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
                title: 'Ücretsiz Keşif',
                desc: 'İlk görüşme ve analiz tamamen ücretsiz',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: 'Taahhütsüz',
                desc: 'Beğenmezseniz hiçbir zorunluluk yok',
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                ),
                title: 'Kurumsal Çözüm',
                desc: 'Sağlık sektörüne özel profesyonel tasarım',
              },
            ].map((badge) => (
              <motion.div
                key={badge.title}
                variants={fadeUp}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-8 flex flex-col items-center gap-4 text-center hover:border-[#1D4ED8]/30 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                  {badge.icon}
                </div>
                <span className="font-bold text-lg text-[#1E293B]">{badge.title}</span>
                <span className="text-sm text-[#64748B]">{badge.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] py-10">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <div className="mx-auto mb-4 h-px w-12 bg-[#1D4ED8]/30" />
          <p className="text-[#64748B] text-sm">
            Bu sayfa{' '}
            <strong className="text-[#94A3B8]">{props.firmName}</strong> için{' '}
            <a
              href="https://studio.vorte.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#60A5FA] hover:underline"
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
