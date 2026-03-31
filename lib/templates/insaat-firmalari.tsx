'use client'

import { Oswald, Source_Sans_3 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const oswald = Oswald({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin-ext'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-source-sans',
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

export default function InsaatFirmalariTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const projectsImg = props.images?.projects

  return (
    <div className={`${oswald.variable} ${sourceSans.variable} min-h-screen bg-[#F8FAFC] text-[#1E293B]`}>
      {/* ═══════════════════ HERO — Blueprint Grid + Construction Badge Strip ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Blueprint grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#1E3A5F 1px, transparent 1px), linear-gradient(90deg, #1E3A5F 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Construction badge strip */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
              {['🏗️ Konut', '🏢 Ticari', '🏭 Endüstriyel', '🔨 Prefabrik'].map((badge, i) => (
                <span key={i} className="border border-[#D97706]/30 bg-[#D97706]/10 px-4 py-1.5 font-[family-name:var(--font-source-sans)] text-xs font-600 uppercase text-[#D97706]">
                  {badge}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-1 w-10 bg-[#D97706]" />
                <span className="font-[family-name:var(--font-source-sans)] text-sm font-600 uppercase tracking-[0.3em] text-[#D97706]">
                  {props.city} &bull; İnşaat
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Sağlam
                <br />
                Temeller
                <br />
                <span className="text-[#D97706]">Kalıcı Yapılar</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-sans)] text-base leading-relaxed text-[#1E293B]/60">
                <strong className="text-[#1E293B]">{props.firmName}</strong> — konut, ticari ve
                endüstriyel projeler. Sertifikalı, referanslı, zamanında teslimat.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#1E3A5F] px-8 py-4 font-[family-name:var(--font-oswald)] text-base font-600 uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#0F2A45] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#D97706]/20 bg-[#D97706]/5 px-5 py-3">
                  <div className="flex gap-0.5 text-[#D97706]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-sans)] text-sm text-[#1E293B]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Blueprint-framed project image */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden bg-[#E2E8F0]">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} proje`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#1E3A5F]/5">
                      <div className="text-center">
                        <div className="text-6xl">🏗️</div>
                        <p className="mt-3 font-[family-name:var(--font-source-sans)] text-sm text-[#1E293B]/30">Proje Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Blueprint corner marks */}
                <div className="absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2 border-[#D97706]" />
                <div className="absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2 border-[#D97706]" />
                <div className="absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 border-[#D97706]" />
                <div className="absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2 border-[#D97706]" />
              </div>

              {/* Stats badges */}
              <div className="absolute -left-3 bottom-8 bg-[#1E3A5F] px-4 py-2 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase text-white shadow-lg">
                150+ Proje
              </div>
              <div className="absolute -right-3 top-8 bg-[#D97706] px-4 py-2 font-[family-name:var(--font-oswald)] text-sm font-600 uppercase text-white shadow-lg">
                25+ Yıl
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#1E3A5F] py-20 text-white">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-oswald)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            İnşaat İşi Verenler
            <br />
            <span className="text-[#D97706]">Referans ve Portfolyo Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-sans)] text-lg text-white/70">
            İnşaat firması arayanların <strong className="text-white">%84&apos;ü</strong> tamamlanan
            projeleri ve referansları online inceliyor.
          </motion.p>

          {projectsImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden">
              <img src={projectsImg} alt={`${props.firmName} projeler`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🏗️', stat: '%84', text: 'Portfolyo inceliyor' },
              { emoji: '📋', stat: '%72', text: 'Sertifika/belge arıyor' },
              { emoji: '⭐', stat: '%68', text: 'Müşteri yorumlarını okuyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-oswald)] text-2xl font-700 text-[#D97706]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-sans)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#D97706]">Olan</span> vs <span className="text-[#1E293B]/30">Olmayan</span> İnşaat Firması
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#D97706]/20 bg-[#D97706]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#D97706]">✅ Web Sitesi Olan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1E293B]/70">
                {['Tamamlanan projeler online görünüyor', 'Sertifika ve referanslar erişilebilir', 'Google\'da "inşaat firması" üst sırada', 'Teklif talepleri artıyor', 'Kurumsal güvenilirlik kanıtlanıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#D97706]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1E293B]/10 bg-[#1E293B]/[0.03] p-8">
              <div className="mb-4 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase text-[#1E293B]/30">❌ Web Sitesi Olmayan Firma</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-sans)] text-[#1E293B]/30">
                {['Proje geçmişi kanıtlanamıyor', 'Belgeler paylaşılamıyor', 'Arama sonuçlarında görünmüyor', 'Sadece ağızdan ağıza müşteri', 'Büyük ihale ve projeleri kaçırıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🏗️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-oswald)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            Firmanızı <span className="text-[#D97706]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-sans)] text-base text-[#1E293B]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#1E3A5F] px-10 py-5 font-[family-name:var(--font-oswald)] text-lg font-600 uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#0F2A45] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1E3A5F]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🏗️', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📋', title: 'Proje Portfolyosu', desc: 'Tamamlanan projelerinizi profesyonelce sergileyin.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#1E3A5F]/10 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-oswald)] text-base font-600 uppercase text-[#D97706]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-sans)] text-sm text-[#1E293B]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1E3A5F]/10 py-8 text-center font-[family-name:var(--font-source-sans)] text-sm text-[#1E293B]/30">
        <p>Bu sayfa <strong className="text-[#1E293B]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
