'use client'

import { Raleway, Open_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const raleway = Raleway({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-raleway',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
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
  hidden: { opacity: 0, scale: 0.9 },
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

export default function CateringTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const showcaseImg = props.images?.showcase

  return (
    <div className={`${raleway.variable} ${openSans.variable} min-h-screen bg-[#F8FAFC] text-[#0F172A]`}>
      {/* ═══════════════════ HERO — Corporate 2-col Grid ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1E3A5F] py-20 text-white lg:py-0 lg:min-h-[90vh]">
        {/* Geometric pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 lg:py-24"
          >
            {/* Sol — Text */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-[#F59E0B]" />
                <span className="font-[family-name:var(--font-open-sans)] text-sm font-600 uppercase tracking-[0.2em] text-[#F59E0B]">
                  {props.city} &bull; Kurumsal Catering
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-[family-name:var(--font-raleway)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl"
              >
                Kurumsal
                <br />
                Etkinlikleriniz İçin
                <br />
                <span className="text-[#F59E0B]">Lezzetli Çözümler</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-md font-[family-name:var(--font-open-sans)] text-lg leading-relaxed text-white/60"
              >
                <strong className="text-white">{props.firmName}</strong> — toplantılarınız, lansman
                etkinlikleriniz ve özel organizasyonlarınız için profesyonel yemek hizmetleri.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#F59E0B] px-8 py-4 font-[family-name:var(--font-raleway)] text-base font-700 text-[#1E3A5F] transition-all hover:bg-[#FBBF24] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {/* Capacity strip */}
              <motion.div variants={fadeInUp} className="flex gap-6 border-t border-white/10 pt-6">
                {[
                  { num: '500+', label: 'Kişilik Kapasite' },
                  { num: '200+', label: 'Kurumsal Etkinlik' },
                  { num: '50+', label: 'Referans Şirket' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-[family-name:var(--font-raleway)] text-2xl font-800 text-[#F59E0B]">{s.num}</div>
                    <div className="font-[family-name:var(--font-open-sans)] text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Sağ — Corporate hero image */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                {heroImg ? (
                  <img src={heroImg} alt={`${props.firmName} catering`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1E3A5F] to-[#0F172A]">
                    <div className="text-center">
                      <div className="text-5xl">🍽️</div>
                      <p className="mt-3 font-[family-name:var(--font-open-sans)] text-sm text-white/30">Catering Görseli</p>
                    </div>
                  </div>
                )}

                {/* Corner accent */}
                <div className="absolute left-0 top-0 h-16 w-16 border-l-4 border-t-4 border-[#F59E0B]" />
                <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-[#F59E0B]" />
              </div>

              {/* Rating card */}
              {(props.googleRating || props.googleReviews) && (
                <div className="absolute -bottom-5 -right-3 border-2 border-[#F59E0B]/30 bg-[#1E3A5F] px-5 py-4 shadow-xl sm:-right-5">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-raleway)] text-2xl font-800 text-[#F59E0B]">{props.googleRating}</span>
                    <div>
                      <div className="flex gap-0.5 text-sm text-[#F59E0B]">
                        {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                      </div>
                      <p className="font-[family-name:var(--font-open-sans)] text-xs text-white/50">{props.googleReviews}+ Değerlendirme</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#1E3A5F]/10 bg-[#1E3A5F]/5 px-4 py-2">
            <span className="text-[#DC2626]">⚠️</span>
            <span className="font-[family-name:var(--font-open-sans)] text-sm font-600 text-[#1E3A5F]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-3xl font-800 sm:text-4xl">
            Kurumsal Yemek Organize Edenler
            <br />
            <span className="text-[#1E3A5F]/70">Online Teklif Alıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-open-sans)] text-lg text-[#0F172A]/60">
            Şirket yemeği organize edenlerin <strong className="text-[#0F172A]">%76&apos;sı</strong> online
            teklif karşılaştırıyor. Web siteniz yoksa teklif sürecine dahil bile edilmiyorsunuz.
          </motion.p>

          {/* Showcase image */}
          {showcaseImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border border-[#1E3A5F]/10 shadow-lg">
              <img src={showcaseImg} alt={`${props.firmName} etkinlik`} className="w-full object-cover" />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { icon: '💼', stat: '%76', text: 'Online teklif karşılaştırıyor' },
              { icon: '💰', stat: '~₺25.000', text: 'Aylık kayıp potansiyel' },
              { icon: '🏢', stat: '5x', text: 'Daha fazla kurumsal talep' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#1E3A5F]/10 bg-[#1E3A5F]/5 p-5 text-center">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-2 font-[family-name:var(--font-raleway)] text-2xl font-800 text-[#1E3A5F]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="border-y border-[#1E3A5F]/10 bg-white py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-raleway)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#15803D]">Olan</span> vs <span className="text-[#0F172A]/30">Olmayan</span> Catering
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#15803D]/20 bg-[#15803D]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-lg font-700 text-[#15803D]">
                ✅ Web Sitesi Olan Catering
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#0F172A]/80">
                {[
                  'Menü paketleri online — müşteri kolay karar veriyor',
                  'Teklif formu 7/24 açık — hiçbir talep kaçmıyor',
                  'Referans şirketler görünür — güven artıyor',
                  'Kapasite ve hizmet detayları net',
                  'Kurumsal taleplerde tercih ediliyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#15803D]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={slideFromRight} className="border border-[#0F172A]/5 bg-[#0F172A]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-raleway)] text-lg font-700 text-[#0F172A]/30">
                ❌ Web Sitesi Olmayan Catering
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-open-sans)] text-[#0F172A]/40">
                {[
                  'Menü bilgisi yok — müşteri bilemeden geçiyor',
                  'Teklif sadece telefonla — kaçırılan fırsatlar',
                  'Referans gösterilemiyor — güven düşük',
                  'Hizmet kapsamı belirsiz',
                  'Kurumsal ihale listelerine giremiyor',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-[#1E3A5F] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(45deg, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mx-auto mb-6 h-1 w-16 bg-[#F59E0B]" />

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-raleway)] text-4xl font-800 sm:text-5xl">
            Catering İşletmenizi
            <br />
            <span className="text-[#F59E0B]">Dijitale Taşıyalım</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-open-sans)] text-lg text-white/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış
            profesyonel catering web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F59E0B] px-10 py-5 font-[family-name:var(--font-raleway)] text-lg font-700 text-[#1E3A5F] transition-all hover:bg-[#FBBF24] hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]"
            >
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1E3A5F]/10 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '💼', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve ihtiyaç analizi tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel catering web siteniz 48 saat içinde hazır.' },
            { icon: '🏢', title: 'Kurumsal Tasarım', desc: 'İşletmenizin profesyonel imajını yansıtan web sitesi.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#1E3A5F]/10 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-raleway)] text-base font-700 text-[#1E3A5F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#0F172A]/5 py-8 text-center font-[family-name:var(--font-open-sans)] text-sm text-[#0F172A]/30">
        <p>Bu sayfa <strong className="text-[#0F172A]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
