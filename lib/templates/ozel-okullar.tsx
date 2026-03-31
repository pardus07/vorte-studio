'use client'

import { Nunito, Hind } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const nunito = Nunito({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const hind = Hind({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
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

export default function OzelOkullarTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const campusImg = props.images?.campus

  return (
    <div className={`${nunito.variable} ${hind.variable} min-h-screen bg-[#F8FAFC] text-[#1E293B]`}>
      {/* ═══════════════════ HERO — Geometric Blocks + Stats ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <span className="font-[family-name:var(--font-hind)] text-sm font-600 uppercase tracking-[0.2em] text-[#1E40AF]">
                  {props.city} &bull; Eğitim Kurumu
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-4xl font-800 leading-tight sm:text-5xl lg:text-6xl">
                Geleceğinizi <span className="text-[#1E40AF]">Şekillendirin</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-hind)] text-lg leading-relaxed text-[#1E293B]/60">
                <strong className="text-[#1E293B]">{props.firmName}</strong> — uzman
                kadro, modern eğitim yöntemleri ve bireysel gelişim programlarıyla geleceğe hazırlıyoruz.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#1E40AF] px-8 py-4 font-[family-name:var(--font-nunito)] text-base font-700 text-white shadow-lg transition-all hover:bg-[#1E3A8A] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-2xl border border-[#1E40AF]/10 bg-white/70 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#FCD34D]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-hind)] text-sm font-600 text-[#1E293B]">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Geometric blocks hero with stats */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#1E40AF]/15 bg-white shadow-2xl">
                <div className="aspect-[4/3]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} kampüs`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1E40AF]/5 to-[#FCD34D]/10">
                      <div className="text-center">
                        <div className="text-6xl">🎓</div>
                        <p className="mt-3 font-[family-name:var(--font-hind)] text-sm text-[#1E40AF]/40">Eğitim Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Stats counter blocks */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-[#1E40AF] p-4 text-center text-white shadow-xl">
                <div className="font-[family-name:var(--font-nunito)] text-2xl font-800">15+</div>
                <div className="font-[family-name:var(--font-hind)] text-xs">Yıl Tecrübe</div>
              </div>
              <div className="absolute -right-4 -top-2 rounded-2xl bg-[#FCD34D] p-4 text-center text-[#1E293B] shadow-xl">
                <div className="font-[family-name:var(--font-nunito)] text-2xl font-800">%98</div>
                <div className="font-[family-name:var(--font-hind)] text-xs">Başarı Oranı</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#1E40AF] py-20 text-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-nunito)]">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Kurs Araştıran Aileler
            <br />
            <span className="text-[#FCD34D]">Önce Online Araştırıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-hind)] text-lg text-white/70">
            Kurs araştıran ailelerin <strong className="text-white">%85&apos;i</strong> önce
            online araştırıyor. Web siteniz yoksa &quot;ciddi bir kurum&quot; olarak görülmüyorsunuz.
          </motion.p>

          {campusImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl">
              <img src={campusImg} alt={`${props.firmName} kampüs`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🎓', stat: '%85', text: 'Online kurs araştırıyor' },
              { emoji: '📱', stat: '%72', text: 'Mobil karşılaştırma yapıyor' },
              { emoji: '⭐', stat: '%68', text: 'Yorumları okuyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-nunito)] text-2xl font-800 text-[#FCD34D]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-hind)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl">
            Web Sitesi <span className="text-[#1E40AF]">Olan</span> vs <span className="text-[#1E293B]/30">Olmayan</span> Kurum
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="rounded-2xl border border-[#1E40AF]/20 bg-[#1E40AF]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1E40AF]">✅ Web Sitesi Olan Kurum</div>
              <ul className="space-y-3 font-[family-name:var(--font-hind)] text-[#1E293B]/80">
                {['Program detayları online görünüyor', 'Kayıt talepleri online geliyor', 'Google\'da "kurs" aramasında üst sırada', 'Başarı hikayeleri güven veriyor', 'Online tanıtım/deneme dersi imkânı'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#1E40AF]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="rounded-2xl border border-[#1E293B]/5 bg-[#1E293B]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-nunito)] text-lg font-700 text-[#1E293B]/30">❌ Web Sitesi Olmayan Kurum</div>
              <ul className="space-y-3 font-[family-name:var(--font-hind)] text-[#1E293B]/40">
                {['Program bilgisi net değil', 'Sadece çevreden öğrenci', 'Arama sonuçlarında görünmüyor', 'Güven algısı düşük — "amatör" izlenimi', 'Online kayıt/başvuru gelmiyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#DBEAFE]/30 py-24">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">🎓</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-nunito)] text-3xl font-800 sm:text-4xl lg:text-5xl">
            Kurumunuzu <span className="text-[#1E40AF]">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-hind)] text-lg text-[#1E293B]/60">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel eğitim web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#1E40AF] px-10 py-5 font-[family-name:var(--font-nunito)] text-lg font-700 text-white shadow-xl transition-all hover:bg-[#1E3A8A] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#1E40AF]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🎓', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve analiz tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '📱', title: 'Online Başvuru', desc: 'Öğrencileriniz online kayıt olabilir.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="rounded-2xl border border-[#1E40AF]/10 bg-white/60 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-nunito)] text-base font-700 text-[#1E40AF]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-hind)] text-sm text-[#1E293B]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1E40AF]/10 py-8 text-center font-[family-name:var(--font-hind)] text-sm text-[#1E293B]/30">
        <p>Bu sayfa <strong className="text-[#1E293B]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
