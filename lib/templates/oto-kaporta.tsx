'use client'

import { Rajdhani, Lato } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const rajdhani = Rajdhani({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin-ext'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
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

export default function OtoKaportaTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const galleryImg = props.images?.gallery

  return (
    <div className={`${rajdhani.variable} ${lato.variable} min-h-screen bg-[#0F172A] text-[#F1F5F9]`}>
      {/* ═══════════════════ HERO — Before/After Diagonal Split ═══════════════════ */}
      <section className="relative overflow-hidden pb-20 pt-16">
        {/* Metallic shimmer gradient */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.03]"
          style={{ background: 'linear-gradient(135deg, transparent 0%, #C0C0C0 50%, transparent 100%)' }}
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
                <div className="h-px w-10 bg-[#94A3B8]" />
                <span className="font-[family-name:var(--font-lato)] text-sm font-300 uppercase tracking-[0.3em] text-[#94A3B8]">
                  {props.city} &bull; Kaporta & Boya
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-5xl font-700 uppercase leading-none sm:text-6xl lg:text-7xl">
                Kaza Öncesi
                <br />
                Gibi <span className="bg-gradient-to-r from-[#94A3B8] to-white bg-clip-text text-transparent">Olacak</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-lato)] text-base font-300 leading-relaxed text-[#F1F5F9]/50">
                <strong className="font-700 text-[#F1F5F9]">{props.firmName}</strong> — sigorta
                anlaşmalı, garantili kaporta ve boya işçiliği.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-white px-8 py-4 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase tracking-wider text-[#0F172A] shadow-lg transition-all hover:bg-[#F1F5F9] hover:shadow-xl"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#94A3B8]/20 bg-white/5 px-5 py-3 backdrop-blur-sm">
                  <div className="flex gap-0.5 text-[#94A3B8]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-lato)] text-sm text-[#F1F5F9]/70">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}
            </div>

            {/* Sağ — Diagonal Before/After split */}
            <motion.div variants={scaleIn} className="relative">
              <div className="relative overflow-hidden" style={{ borderRadius: '4px' }}>
                <div className="aspect-[4/3] bg-[#1E293B]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} kaporta`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">🎨</div>
                        <p className="mt-3 font-[family-name:var(--font-lato)] text-sm text-[#F1F5F9]/30">Kaporta & Boya Görseli</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Diagonal divider line */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-0 h-full w-px origin-top -rotate-12 bg-gradient-to-b from-white/60 via-[#94A3B8]/40 to-transparent" />
                </div>
                {/* Metallic gradient bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #94A3B8, #F1F5F9, #94A3B8)' }} />
              </div>

              {/* Before / After labels */}
              <div className="absolute left-4 top-4 bg-[#0F172A]/90 px-3 py-1 font-[family-name:var(--font-rajdhani)] text-xs font-600 uppercase tracking-wider text-[#94A3B8] backdrop-blur-sm">
                Öncesi
              </div>
              <div className="absolute right-4 top-4 bg-white/90 px-3 py-1 font-[family-name:var(--font-rajdhani)] text-xs font-600 uppercase tracking-wider text-[#0F172A] backdrop-blur-sm">
                Sonrası ✓
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #94A3B8, #64748B)' }}>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase text-white sm:text-4xl">
            Kaza Sonrası Araç Sahipleri
            <br />
            <span className="text-[#0F172A]">Güvenilir Kaporta Arıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-lato)] text-lg text-white/70">
            Kaporta yaptırmak isteyenlerin <strong className="text-white">%82&apos;si</strong> öncesi/sonrası
            fotoğrafları ve sigorta anlaşması olan servisleri tercih ediyor.
          </motion.p>

          {galleryImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden rounded-sm">
              <img src={galleryImg} alt={`${props.firmName} galeri`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '🎨', stat: '%82', text: 'Portfolyo inceliyor' },
              { emoji: '🛡️', stat: '%68', text: 'Sigorta anlaşması soruyor' },
              { emoji: '⏱️', stat: '%74', text: 'Süre garantisi istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/10 p-5 backdrop-blur-sm">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-rajdhani)] text-2xl font-700 text-[#0F172A]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-lato)] text-sm text-white/60">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#94A3B8]">Olan</span> vs <span className="text-[#F1F5F9]/30">Olmayan</span> Kaporta
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border border-[#94A3B8]/20 bg-[#94A3B8]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#94A3B8]">✅ Web Sitesi Olan Kaporta</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#F1F5F9]/70">
                {['Öncesi/sonrası galeri güven veriyor', 'Sigorta anlaşmaları belirtiliyor', 'Google\'da "kaporta" aramasında üst sırada', 'Süre ve fiyat garantisi net', 'Online teklif talepleri artıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#94A3B8]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#F1F5F9]/5 bg-[#F1F5F9]/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase text-[#F1F5F9]/30">❌ Web Sitesi Olmayan Kaporta</div>
              <ul className="space-y-3 font-[family-name:var(--font-lato)] text-[#F1F5F9]/30">
                {['İş kalitesi kanıtlanamıyor', 'Sigorta bilgisi belirsiz', 'Arama sonuçlarında görünmüyor', 'Sadece ağızdan ağıza müşteri', 'Rakiplere müşteri kaybediyor'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">🎨</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-rajdhani)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            İşletmenizi <span className="bg-gradient-to-r from-[#94A3B8] to-white bg-clip-text text-transparent">Dijitale Taşıyalım</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-lato)] text-base font-300 text-[#F1F5F9]/50">
            Taahhüt yok, zorlama yok — {props.firmName} için özel hazırlanmış profesyonel web sitesi teklifi.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-white px-10 py-5 font-[family-name:var(--font-rajdhani)] text-lg font-700 uppercase tracking-wider text-[#0F172A] shadow-xl transition-all hover:bg-[#F1F5F9] hover:shadow-2xl">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-[#94A3B8]/10 py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '🛡️', title: 'Ücretsiz Danışmanlık', desc: 'İlk görüşme ve hasar tespiti tamamen ücretsiz.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🎨', title: 'Garanti', desc: 'Boya ve kaporta işçiliğine garanti veriyoruz.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#94A3B8]/10 bg-[#1E293B] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-rajdhani)] text-base font-700 uppercase text-[#94A3B8]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-lato)] text-sm text-[#F1F5F9]/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#94A3B8]/10 py-8 text-center font-[family-name:var(--font-lato)] text-sm text-[#F1F5F9]/20">
        <p>Bu sayfa <strong className="text-[#F1F5F9]/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
