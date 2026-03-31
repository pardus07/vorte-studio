'use client'

import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const playfair = Playfair_Display({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-serif',
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

export default function HukukBurosuTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const officeImg = props.images?.office

  return (
    <div className={`${playfair.variable} ${sourceSerif.variable} min-h-screen bg-white text-[#1C1917]`}>
      {/* ═══════════════════ HERO — Reverse Asymmetric: LEFT image, RIGHT text ═══════════════════ */}
      {/* BU HERO: Ters düzen — sol tarafta büyük görsel, sağ tarafta metin. Klasik hukuk estetiği */}
      <section className="relative min-h-[90vh] overflow-hidden bg-[#1E3A5F]">
        {/* Subtle law pattern — scales of justice hint */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)`,
        }} />

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-12">
            {/* SOL — Görsel (5/12) — TERS DÜZEN */}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative lg:col-span-5">
              <div className="relative overflow-hidden">
                {/* Gold corner accents — hukuki prestij */}
                <div className="absolute left-0 top-0 z-10 h-16 w-16 border-l-2 border-t-2 border-[#D4AF37]" />
                <div className="absolute bottom-0 right-0 z-10 h-16 w-16 border-b-2 border-r-2 border-[#D4AF37]" />
                <div className="aspect-[3/4]">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} avukat`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#D4AF37]/5">
                      <div className="text-center">
                        <div className="text-7xl">⚖️</div>
                        <p className="mt-3 font-[family-name:var(--font-source-serif)] text-sm text-white/30">Hukuk Bürosu</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Vertical gold bar — sol taraf aksanı */}
              <div className="absolute -right-3 bottom-10 top-10 w-1 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
            </motion.div>

            {/* SAĞ — Metin (7/12) — TERS DÜZEN */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8 text-white lg:col-span-7 lg:pl-8"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#D4AF37]" />
                <span className="font-[family-name:var(--font-source-serif)] text-sm font-400 uppercase tracking-[0.3em] text-[#D4AF37]">
                  {props.city} &bull; Hukuk Bürosu
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-4xl font-700 leading-tight sm:text-5xl lg:text-6xl">
                Hakkınızı
                <br />
                <span className="text-[#D4AF37]">Aramanızı Sağlıyoruz</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-md font-[family-name:var(--font-source-serif)] text-base leading-relaxed text-white/60">
                <strong className="text-white">{props.firmName}</strong> — ceza hukuku, iş hukuku, aile hukuku
                ve ticaret hukuku alanlarında profesyonel hukuki danışmanlık.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-8 py-4 font-[family-name:var(--font-source-serif)] text-sm font-600 uppercase tracking-wider text-[#1E3A5F] transition-all hover:bg-transparent hover:text-[#D4AF37]">
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {(props.googleRating || props.googleReviews) && (
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 border border-[#D4AF37]/20 px-5 py-3">
                  <div className="flex gap-0.5 text-[#D4AF37]">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <span className="font-[family-name:var(--font-source-serif)] text-sm text-white/50">
                    {props.googleRating} ({props.googleReviews}+ yorum)
                  </span>
                </motion.div>
              )}

              {/* Practice areas — hero organik parçası */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
                {['Ceza Hukuku', 'İş Hukuku', 'Aile Hukuku', 'Ticaret'].map((s, i) => (
                  <span key={i} className="border border-[#D4AF37]/20 px-4 py-2 font-[family-name:var(--font-source-serif)] text-xs uppercase tracking-wider text-[#D4AF37]/60">
                    {s}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 bg-[#1E3A5F] px-5 py-2 text-sm text-white">
            <span>⚠️</span>
            <span className="font-[family-name:var(--font-source-serif)] font-600 uppercase tracking-wider">Dikkat</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl">
            Avukat Arayanlar
            <br />
            <span className="text-[#1E3A5F]">Uzmanlık Alanını ve Referansları İnceliyor</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-source-serif)] text-lg text-[#1C1917]/60">
            Hukuki destek arayanların <strong className="text-[#1C1917]">%78&apos;i</strong> avukatı seçmeden
            önce web sitesinden uzmanlık alanlarını ve deneyimini inceliyor.
          </motion.p>

          {officeImg && (
            <motion.div variants={scaleIn} className="mx-auto mt-10 max-w-lg overflow-hidden border-2 border-[#1E3A5F]/20">
              <img src={officeImg} alt={`${props.firmName} büro`} className="w-full object-cover" style={{ maxHeight: '280px' }} />
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { emoji: '⚖️', stat: '%78', text: 'Web sitesi inceliyor' },
              { emoji: '📋', stat: 'Uzmanlık', text: 'Alan bilgisi arıyor' },
              { emoji: '🤝', stat: '%52', text: 'Online randevu istiyor' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="border border-[#1E3A5F]/10 bg-[#1E3A5F]/5 p-5">
                <div className="text-2xl">{item.emoji}</div>
                <div className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-700 text-[#1E3A5F]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-source-serif)] text-sm text-[#1C1917]/50">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KARŞILAŞTIRMA ═══════════════════ */}
      <section className="bg-[#F5F3EF] py-20">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl">
            Web Sitesi <span className="text-[#1E3A5F]">Olan</span> vs <span className="text-[#1C1917]/30">Olmayan</span> Hukuk Büroları
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div variants={slideFromLeft} className="border-2 border-[#D4AF37]/30 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-playfair)] text-base font-700 text-[#1E3A5F]">✅ Web Sitesi Olan</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-serif)] text-[#1C1917]/70">
                {['Uzmanlık alanları net görünüyor', 'Online danışmanlık formu mevcut', 'Müvekkil yorumları güven veriyor', 'Google\'da "avukat" aramasında çıkıyor', 'Kurumsal prestij sağlıyor'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-1 text-[#D4AF37]">▸</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={slideFromRight} className="border border-[#1C1917]/10 bg-white p-8">
              <div className="mb-4 font-[family-name:var(--font-playfair)] text-base font-700 text-[#1C1917]/30">❌ Web Sitesi Olmayan</div>
              <ul className="space-y-3 font-[family-name:var(--font-source-serif)] text-[#1C1917]/30">
                {['Uzmanlık alanı bilinmiyor', 'İletişim için sadece telefon', 'Referans gösterilemiyor', 'Online görünürlüğü sıfır', 'Güvenilirlik algısı düşük'].map((item, i) => (
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
          <motion.div variants={fadeInUp} className="text-4xl">⚖️</motion.div>
          <motion.h2 variants={fadeInUp} className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-700 sm:text-4xl lg:text-5xl">
            Hukuki Destek <span className="text-[#D4AF37]">Bir Tık Uzağınızda</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-source-serif)] text-base text-white/50">
            Taahhüt yok, zorlama yok — {props.firmName} ile ücretsiz ön görüşme randevusu alın.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8">
            <a href={chatLink} onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-10 py-5 font-[family-name:var(--font-playfair)] text-base font-700 text-[#1E3A5F] shadow-xl transition-all hover:bg-transparent hover:text-[#D4AF37]">
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
            { icon: '🏛️', title: 'Deneyimli Kadro', desc: 'Uzman avukatlardan oluşan profesyonel ekip.' },
            { icon: '🤝', title: 'Gizlilik Taahhüdü', desc: 'Tüm bilgileriniz avukat-müvekkil gizliliğinde.' },
            { icon: '📞', title: 'Hızlı İletişim', desc: 'Acil hukuki ihtiyaçlarınız için 7/24 ulaşın.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-[#D4AF37]/20 bg-white p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-source-serif)] text-sm font-600 uppercase tracking-wider text-[#1E3A5F]">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-source-serif)] text-sm text-[#1C1917]/50">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-[#1E3A5F]/10 py-8 text-center font-[family-name:var(--font-source-serif)] text-sm text-[#1C1917]/30">
        <p>Bu sayfa <strong className="text-[#1C1917]/50">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
