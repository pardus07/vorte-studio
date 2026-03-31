'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
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

export default function TabelaReklamTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const worksImg = props.images?.works

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#111111] text-white`}>
      {/* ═══════════════════ HERO — Full-Width Neon Glow Background + Floating Text ═══════════════════ */}
      {/* BU HERO: Tam ekran siyah bg, neon turuncu glow efektleri, tipografi odaklı */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Neon glow circles — tabela ışık estetiği */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#F97316]/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#F97316]/8 blur-[100px]" />
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316]/15 blur-[80px]" />
        </div>

        {/* Grid overlay — reklam panosu hissi */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Floating hero image — background olarak, grid overlay üstünde */}
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt={`${props.firmName} tabela`} className="h-full w-full object-cover" style={{ opacity: 0.15 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/60" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-3">
              {/* Neon dot */}
              <div className="h-3 w-3 rounded-full bg-[#F97316] shadow-[0_0_12px_#F97316,0_0_24px_#F97316]" />
              <span className="font-[family-name:var(--font-barlow)] text-sm font-600 uppercase tracking-[0.4em] text-[#F97316]">
                {props.city} &bull; Tabela & Reklam
              </span>
              <div className="h-3 w-3 rounded-full bg-[#F97316] shadow-[0_0_12px_#F97316,0_0_24px_#F97316]" />
            </motion.div>

            {/* Giant neon-style text — hero'nun kendisi tipografi */}
            <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-6xl font-800 uppercase leading-none sm:text-8xl lg:text-9xl">
              <span className="block text-white">Markanızı</span>
              <span className="block" style={{
                color: '#F97316',
                textShadow: '0 0 20px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.3), 0 0 80px rgba(249,115,22,0.15)',
              }}>
                Parlatalım
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto max-w-lg font-[family-name:var(--font-barlow)] text-lg leading-relaxed text-white/50">
              <strong className="text-white">{props.firmName}</strong> — ışıklı tabela, kutu harf, totem,
              araç giydirme ve dijital baskı. İşinizi görünür kılıyoruz.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                className="group inline-flex items-center gap-3 bg-[#F97316] px-8 py-4 font-[family-name:var(--font-barlow-condensed)] text-base font-700 uppercase tracking-wider text-[#0A0A0A] shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]">
                Ücretsiz Teklif Al
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

            {(props.googleRating || props.googleReviews) && (
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#F97316]/20 px-5 py-3 backdrop-blur-sm">
                <div className="flex gap-0.5 text-[#F97316]">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                </div>
                <span className="font-[family-name:var(--font-barlow)] text-sm text-white/50">
                  {props.googleRating} ({props.googleReviews}+ yorum)
                </span>
              </motion.div>
            )}

            {/* Service type neon badges — hero parçası */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 pt-4">
              {['Işıklı Tabela', 'Kutu Harf', 'Araç Giydirme', 'Totem'].map((s, i) => (
                <span key={i} className="border border-[#F97316]/30 px-4 py-2 font-[family-name:var(--font-barlow)] text-xs font-600 uppercase tracking-wider text-[#F97316]/70 transition-colors hover:border-[#F97316] hover:text-[#F97316]">
                  {s}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="bg-[#111111] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#F97316] px-5 py-2 text-sm text-[#0A0A0A]">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-barlow-condensed)] font-700 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl">
            İşletme Tabelası Yaptırmak İsteyenler
            <br />
            <span className="text-[#F97316]">Referans ve Fiyat Karşılaştırması Yapıyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-lg text-white/50">
            Tabela ve reklam arayanların <strong className="text-white">%64&apos;ü</strong> online
            referans çalışmalar ve fiyat karşılaştırması yapıyor.
          </motion.p>

          {worksImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#F97316]/20">
              <img src={worksImg} alt={`${props.firmName} çalışmalar`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '💡', stat: '%64', text: 'Online araştırıyor' },
              { emoji: '📸', stat: 'Referans', text: 'Çalışma görmek istiyor' },
              { emoji: '🏪', stat: '%48', text: 'Hemen karar veriyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#F97316]/10 bg-[#F97316]/5 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-barlow-condensed)] text-2xl font-700 text-[#F97316]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-barlow)] text-sm text-white/40">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#0A0A0A] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl">
            Web Sitesi <span className="text-[#F97316]">Olan</span> vs <span className="text-white/20">Olmayan</span> Tabela Firmaları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#F97316]/20 bg-[#F97316]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase text-[#F97316]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/70">
                {['Referans çalışmalar galeri ile sergileniyor', 'Müşteriler fiyat bilgisine hemen ulaşıyor', 'Hizmet çeşitleri net görünüyor', 'Google\'da "tabela" aramasında çıkıyor', 'Profesyonel imaj oluşturuyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#F97316]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-white/10 bg-white/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase text-white/20">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/20">
                {['Önceki işleri gösterilemiyor', 'Fiyat sorulamadan karar verilemiyor', 'Hangi hizmetleri sunduğu belirsiz', 'Online görünürlüğü sıfır', 'Müşteri güveni oluşmuyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative overflow-hidden py-24">
        {/* Neon glow behind */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F97316]/15 blur-[100px]" />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="text-4xl">💡</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase sm:text-4xl lg:text-5xl">
            İşletmenizi <span style={{ color: '#F97316', textShadow: '0 0 20px rgba(249,115,22,0.4)' }}>Görünür Kılın</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-base text-white/40">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz keşif ve fiyat teklifi alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#F97316] px-10 py-5 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-[#0A0A0A] shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]">
              Ücretsiz Teklif Al
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ GÜVENCE ═══════════════════ */}
      <section className="border-t border-white/5 bg-[#0A0A0A] py-16">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: '💡', title: 'Işıklı Tabela', desc: 'LED ve neon tabela ile gece-gündüz görünürlük.' },
            { icon: '🎨', title: 'Özel Tasarım', desc: 'Markanıza özel tabela ve reklam tasarımı.' },
            { icon: '🔧', title: 'Montaj Dahil', desc: 'Profesyonel montaj ve bakım hizmeti.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#F97316]/10 bg-[#F97316]/5 p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-sm font-700 uppercase tracking-wider text-[#F97316]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-white/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center font-[family-name:var(--font-barlow)] text-sm text-white/20">
        <p>Bu sayfa <strong className="text-white/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
