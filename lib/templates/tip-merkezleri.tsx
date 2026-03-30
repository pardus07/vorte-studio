'use client'

import { Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import type { TemplateProps } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const inter = Inter({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'] })

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

export default function TipMerkezleriTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)

  return (
    <div className={`${inter.className} bg-[#F8FAFC] text-[#1E293B]`}>
      {/* ── HERO ── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="bg-[#0F172A] text-white"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8]/20 px-4 py-1.5 text-sm text-[#93C5FD] mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            Kurumsal Sağlık Çözümleri
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Sağlığınız için doğru adres:{' '}
            <span className="text-[#60A5FA]">{props.firmName}</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-8">
            {props.city}&apos;da uzman hekim kadrosuyla hizmetinizdeyiz
          </p>

          {props.googleRating && (
            <div className="inline-flex items-center gap-2 bg-[#1E3A5F] rounded-lg px-5 py-2.5 mb-10">
              <span className="text-yellow-400 text-lg">&#9733;</span>
              <span className="font-semibold text-white">{props.googleRating}</span>
              {props.googleReviews && (
                <span className="text-[#94A3B8] text-sm">({props.googleReviews} değerlendirme)</span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/p/${props.slug}/demo`}
              onClick={() => trackEvent(props.slug, 'DEMO_CLICK')}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1D4ED8] font-semibold px-8 py-4 rounded-lg hover:bg-[#F1F5F9] transition-colors text-lg"
            >
              Demo Siteyi Gör
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
            <a
              href={`/p/${props.slug}/chat`}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#60A5FA] text-[#60A5FA] font-semibold px-8 py-4 rounded-lg hover:bg-[#60A5FA]/10 transition-colors text-lg"
            >
              Ücretsiz Teklif Al
            </a>
          </div>
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
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-[#DC2626] p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#DC2626] mb-3">
                  Dijital Varlığınız Olmadan Hasta Kaybediyorsunuz
                </h2>
                <p className="text-lg text-[#475569] leading-relaxed">
                  Uzman hekim arayan hastaların <strong>%68&apos;i</strong> doktor seçimini online araştırmaya göre yapıyor.
                  Dijital sisteminiz yoksa bu hastaları kaybediyorsunuz.
                </p>
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
        variants={fadeUp}
        className="py-16 lg:py-20 bg-white"
      >
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Farkı Görün
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Yoksa */}
            <div className="bg-[#FEF2F2] rounded-2xl p-8 border border-[#FECACA]">
              <h3 className="text-xl font-bold text-[#DC2626] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                Web Siteniz Yoksa
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
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#DC2626]/20 flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Olursa */}
            <div className="bg-[#EFF6FF] rounded-2xl p-8 border border-[#BFDBFE]">
              <h3 className="text-xl font-bold text-[#1D4ED8] mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Web Siteniz Olursa
              </h3>
              <ul className="space-y-4">
                {[
                  "Google'da hemen bulunuyorsunuz",
                  'Tüm branşları ve uzmanları sergiliyorsunuz',
                  '7/24 online randevu sistemi',
                  'Akredite ve güvenilir kurumsal imaj',
                  'Hasta sadakati ve portföyünüz artıyor',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#1E40AF]">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[#1D4ED8]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#1D4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── DEMO CTA ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-16 lg:py-20"
      >
        <div className="mx-auto max-w-4xl px-5">
          <div className="bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF] rounded-2xl p-10 lg:p-14 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tıp Merkezinize Özel Profesyonel Demo Siteyi Görün
            </h2>
            <p className="text-lg text-[#BFDBFE] mb-8">
              Size özel hazırlanmış kurumsal web sitesini hemen inceleyin
            </p>
            <a
              href={`/p/${props.slug}/demo`}
              onClick={() => trackEvent(props.slug, 'DEMO_CLICK')}
              className="inline-flex items-center gap-2 bg-white text-[#1D4ED8] font-bold px-10 py-4 rounded-xl hover:bg-[#F1F5F9] transition-colors text-lg shadow-lg"
            >
              Demo Siteyi Gör
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
          </div>
        </div>
      </motion.section>

      {/* ── CHAT CTA ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="bg-[#0F172A] py-20 lg:py-24"
      >
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ücretsiz Teklif Alın
          </h2>
          <p className="text-lg text-[#94A3B8] mb-10 max-w-xl mx-auto">
            Kurumsal dijital dönüşümünüzü başlatın — taahhüt yok, zorlama yok
          </p>
          <motion.a
            href={`/p/${props.slug}/chat`}
            onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-bold px-12 py-5 rounded-xl hover:bg-[#2563EB] transition-colors text-xl shadow-xl shadow-[#1D4ED8]/30"
          >
            Ücretsiz Teklif Al
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </motion.a>
        </div>
      </motion.section>

      {/* ── GÜVENCE ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="py-16 lg:py-20 bg-white"
      >
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="text-lg text-[#64748B] mb-10">
            Tamamen ücretsiz keşif görüşmesi. Beğenmezseniz hiçbir ücret ödemezsiniz.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🎁', title: 'Ücretsiz Keşif' },
              { icon: '🤝', title: 'Taahhütsüz' },
              { icon: '🏢', title: 'Kurumsal Çözüm' },
            ].map((badge) => (
              <div
                key={badge.title}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center gap-3"
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="font-semibold text-[#334155]">{badge.title}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] py-8">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-[#64748B] text-sm">
            Bu sayfa <strong className="text-[#94A3B8]">{props.firmName}</strong> için{' '}
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
