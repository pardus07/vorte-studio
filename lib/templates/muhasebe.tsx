'use client'

import { Raleway, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
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

export default function MuhasebeTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const officeImg = props.images?.office
  const teamImg = props.images?.team

  return (
    <div className={`${raleway.variable} ${openSans.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Minimal Typography-Only (hero'da görsel YOK) ═══════════════════ */}
      {/* BU HERO: Saf tipografi — büyük rakamlar, istatistik kartları, görsel yok */}
      <section className="relative overflow-hidden bg-white pb-20 pt-24">
        {/* Subtle grid lines — muhasebe defter hissi */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(22,101,52,0.03) 1px, transparent 1px)`,
          backgroundSize: '100% 40px',
        }} />

        {/* Left green accent bar */}
        <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-gradient-to-b from-[#166534] via-[#166534]/50 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="h-1 w-10 bg-[#166534]" />
              <span className="font-[family-name:var(--font-open-sans)] text-xs font-600 uppercase tracking-[0.4em] text-[#166534]">
                {props.city} &bull; Mali Müşavirlik
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="mt-8 font-[family-name:var(--font-raleway)] text-5xl font-800 leading-tight text-[#1E3A5F] sm:text-6xl lg:text-7xl">
              Mali İşleriniz
              <br />
              <span className="text-[#166534]">Güvende</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-lg leading-relaxed text-[#1C1917]/60">
              <strong className="text-[#1C1917]">{props.firmName}</strong> — defter tutma, vergi beyannamesi,
              SGK işlemleri ve şirket kuruluşu. İşinize odaklanın, muhasebeyi bize bırakın.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center gap-3 bg-[#166534] px-8 py-4 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-white shadow-lg shadow-[#166534]/20 transition-all hover:bg-[#14532D] hover:shadow-xl">
                Ücretsiz Teklif Al
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

            {(props.googleRating || props.googleReviews) && (
              <motion.div variants={fadeInUp} className="mt-6 inline-flex items-center gap-3 border border-[#166534]/20 px-5 py-3">
                <div className="flex gap-0.5 text-[#166534]">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <span className="font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/50">
                  {props.googleRating} ({props.googleReviews}+ yorum)
                </span>
              </motion.div>
            )}

            {/* Stat cards as hero visual — görsel yerine sayılar */}
            <motion.div variants={staggerContainer} className="mt-14 grid gap-4 sm:grid-cols-4">
              {[
                { num: '500+', label: 'Aktif Müşteri', color: '#166534' },
                { num: '15+', label: 'Yıl Deneyim', color: '#1E3A5F' },
                { num: '%99', label: 'Zamanında Beyan', color: '#166534' },
                { num: '7/24', label: 'Destek Hattı', color: '#1E3A5F' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="border-l-4 bg-[#F8FAF9] p-5" style={{ borderLeftColor: item.color }}>
                  <div className="font-[family-name:var(--font-raleway)] text-3xl font-800" style={{ color: item.color }}>
                    {item.num}
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-open-sans)] text-xs font-600 uppercase tracking-wider text-[#1C1917]/50">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#F8FAF9] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#1E3A5F] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-raleway)] font-600 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl">
            Muhasebeci Arayanlar
            <br />
            <span className="text-[#166534]">Hizmet Kapsamı ve Referansları İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-[#1C1917]/60">
            Mali müşavir arayanların <strong className="text-[#1C1917]">%68&apos;i</strong> hizmet kapsamını
            ve müşteri referanslarını web sitesinden inceliyor.
          </motion.p>

          {officeImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#166534]/20">
              <img src={officeImg} alt={`${props.firmName} ofis`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '📊', stat: '%68', text: 'Online inceliyor' },
              { emoji: '💼', stat: 'Hizmet', text: 'Kapsam bilgisi arıyor' },
              { emoji: '📱', stat: '%45', text: 'Online randevu istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#166534]/10 bg-white p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-raleway)] text-2xl font-700 text-[#166534]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ EKİP GÖRSELİ — hero'da olmadığı için burada ═══════════════════ */}
      {teamImg && (
        <section className="py-16">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.h3 variants={fadeInUp} className="mb-6 text-center font-[family-name:var(--font-raleway)] text-2xl font-700">
              Profesyonel <span className="text-[#166534]">Ekibimiz</span>
            </motion.h3>
            <motion.div variants={scaleIn} className="overflow-hidden">
              <img src={teamImg} alt={`${props.firmName} ekip`} className="w-full object-cover" style={{ maxHeight: '320px' }} />
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#166534]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Muhasebe Büroları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-l-4 border-[#166534] bg-[#F8FAF9] p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-base font-700 uppercase tracking-wider text-[#166534]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#1C1917]/70">
                {['Hizmet kapsamı ve fiyatlandırma net', 'Online beyanname takip sistemi', 'Müşteri referansları güven veriyor', 'Google\'da "muhasebeci" aramasında çıkıyor', 'Yeni müşteri akışı sürekli'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#166534]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border-l-4 border-[#1C1917]/10 bg-[#F8FAF9] p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-base font-700 uppercase tracking-wider text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#1C1917]/30">
                {['Hizmet kapsamı belirsiz', 'Beyanname takibi telefonla', 'Referans gösterilemiyor', 'Online görünürlüğü yok', 'Yeni müşteri bulmak zor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-[#1E3A5F] py-24 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">📊</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-raleway)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Mali İşlerinizi <span className="text-[#22C55E]">Profesyonele Bırakın</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz ön görüşme ve fiyat teklifi alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#166534] px-10 py-5 font-[family-name:var(--font-raleway)] text-base font-600 uppercase tracking-wider text-white shadow-xl shadow-[#166534]/30 transition-all hover:bg-[#14532D] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#166534]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '📋', title: 'Beyanname Takibi', desc: 'Tüm beyannamelerinizi zamanında veriyoruz.' },
            { icon: '💰', title: 'Vergi Optimizasyonu', desc: 'Yasal indirimlerden maksimum faydalanın.' },
            { icon: '🔒', title: 'Gizlilik Garantisi', desc: 'Mali bilgileriniz tam gizlilik altında.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border-l-4 border-[#166534] bg-[#F8FAF9] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-raleway)] text-sm font-600 uppercase tracking-wider text-[#166534]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#166534]/10 py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
