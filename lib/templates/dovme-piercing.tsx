'use client'

import { Barlow_Condensed, Barlow } from 'next/font/google'
import { motion } from 'framer-motion'
import { TemplateProps, buildChatLink } from './types'
import { useTrackPageView, trackEvent } from './use-track'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin-ext'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
  display: 'swap',
})

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function DovmePiercingTemplate(props: TemplateProps) {
  useTrackPageView(props.slug)
  const chatLink = buildChatLink(props.slug)

  const heroImg = props.images?.hero
  const portfolioImg = props.images?.portfolio

  return (
    <div className={`${barlowCondensed.variable} ${barlow.variable} min-h-screen bg-[#0A0A0A] text-white`}>
      {/* ═══════════════════ HERO — Dark Portfolio Grid ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Neon glow effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#FF3D00]/10 blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#FF3D00]/5 blur-[120px]" />
        </div>

        {/* Grid lines overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Sol — Text */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#FF3D00]" />
                <span className="font-[family-name:var(--font-barlow)] text-sm uppercase tracking-[0.3em] text-[#FF3D00]">
                  {props.city} &bull; Dövme & Piercing
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-[family-name:var(--font-barlow-condensed)] text-5xl font-800 uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
              >
                Sanatınızı
                <br />
                <span className="text-[#FF3D00]">Taşıyın</span>
                <br />
                <span className="text-white/40">Kalıcı, Özgün, Sizin</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="max-w-md font-[family-name:var(--font-barlow)] text-lg leading-relaxed text-white/50"
              >
                <strong className="text-white">{props.firmName}</strong> — profesyonel ekipman,
                steril ortam ve sanatsal bakış açısıyla hayalinizdeki dövmeyi gerçeğe dönüştürüyoruz.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <a
                  href={chatLink}
                  onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
                  className="group inline-flex items-center gap-3 bg-[#FF3D00] px-8 py-4 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wider text-white transition-all hover:bg-[#FF5722] hover:shadow-[0_0_40px_rgba(255,61,0,0.4)]"
                >
                  Ücretsiz Teklif Al
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>

              {/* Stats strip */}
              <motion.div variants={fadeInUp} className="flex gap-8 border-t border-white/10 pt-6">
                {[
                  { num: '10+', label: 'Yıl Deneyim' },
                  { num: '5.000+', label: 'Tamamlanan Eser' },
                  { num: '%100', label: 'Sterilizasyon' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-700 text-[#FF3D00]">{s.num}</div>
                    <div className="font-[family-name:var(--font-barlow)] text-xs uppercase tracking-wider text-white/40">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Sağ — Portfolio grid hero */}
            <motion.div variants={scaleIn} className="relative">
              <div className="grid grid-cols-2 gap-3">
                {/* Main hero — large */}
                <div className="col-span-2 aspect-video overflow-hidden border border-white/10 bg-white/5">
                  {heroImg ? (
                    <img src={heroImg} alt={`${props.firmName} portfolyo`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl">🎨</div>
                        <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-white/30">Portfolyo Görseli</p>
                      </div>
                    </div>
                  )}
                  {/* Neon border effect */}
                  <div className="absolute inset-0 border border-[#FF3D00]/20" />
                </div>

                {/* Portfolio second image */}
                <div className="aspect-square overflow-hidden border border-white/10 bg-white/5">
                  {portfolioImg ? (
                    <img src={portfolioImg} alt={`${props.firmName} eser`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-2xl">🖋️</div>
                    </div>
                  )}
                </div>

                {/* Decorative info card */}
                <div className="flex aspect-square flex-col items-center justify-center border border-[#FF3D00]/20 bg-[#FF3D00]/5 p-4">
                  <div className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 text-[#FF3D00]">
                    {props.googleRating ?? '4.9'}
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[#FF3D00]">★</span>
                    ))}
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-barlow)] text-xs text-white/40">
                    {props.googleReviews ?? 150}+ Değerlendirme
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ALARM ═══════════════════ */}
      <section className="relative border-y border-[#FF3D00]/10 bg-[#0D0D0D] py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 border border-[#FF3D00]/20 bg-[#FF3D00]/5 px-4 py-2 text-sm text-[#FF3D00]">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Kaçırıyorsunuz
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase tracking-wide sm:text-4xl lg:text-5xl"
          >
            Portfolyonuz Online Değilse
            <br />
            <span className="text-[#FF3D00]">Müşteri Almanız İmkansız</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-lg text-white/50"
          >
            Dövme yaptıracak kişilerin <strong className="text-white">%92&apos;si</strong> ustanın
            portfolyosunu önce online inceliyor. Web siteniz yoksa güven oluşturamıyorsunuz —
            müşteri rakibinize gidiyor.
          </motion.p>

          <motion.div variants={fadeInUp} className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { icon: '📱', stat: '%92', text: 'Online portfolyo arıyor' },
              { icon: '💸', stat: '~₺15.000', text: 'Aylık kayıp potansiyel' },
              { icon: '🏆', stat: '3x', text: 'Daha fazla randevu' },
            ].map((item, i) => (
              <div key={i} className="border border-white/5 bg-white/[0.02] p-5">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-2 font-[family-name:var(--font-barlow-condensed)] text-2xl font-700 text-[#FF3D00]">{item.stat}</div>
                <div className="mt-1 font-[family-name:var(--font-barlow)] text-sm text-white/40">{item.text}</div>
              </div>
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
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-[family-name:var(--font-barlow-condensed)] text-3xl font-700 uppercase tracking-wide sm:text-4xl">
            Web Sitesi <span className="text-[#FF3D00]">Olan</span> vs <span className="text-white/40">Olmayan</span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Olan */}
            <motion.div variants={slideFromLeft} className="border border-[#FF3D00]/20 bg-[#FF3D00]/5 p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-xl font-700 uppercase text-[#FF3D00]">
                ✅ Web Sitesi Olan Stüdyo
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/70">
                {[
                  'Portfolyo 7/24 online — müşteri güveniyor',
                  'Google\'da ilk sayfada çıkıyor',
                  'Online randevu alıyor',
                  'Profesyonel görünüm = premium fiyat',
                  'Sterilizasyon sertifikaları görünür',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-[#FF3D00]">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Olmayan */}
            <motion.div variants={slideFromRight} className="border border-white/5 bg-white/[0.02] p-8">
              <div className="mb-4 font-[family-name:var(--font-barlow-condensed)] text-xl font-700 uppercase text-white/30">
                ❌ Web Sitesi Olmayan Stüdyo
              </div>
              <ul className="space-y-3 font-[family-name:var(--font-barlow)] text-white/40">
                {[
                  'Portfolyo sadece Instagram — kısıtlı erişim',
                  'Arama motorlarında görünmüyor',
                  'Müşteri DM ile randevu almaya çalışıyor',
                  'Amatör algısı — fiyat kırma baskısı',
                  'Güvenilirlik sorusu yanıtsız kalıyor',
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
      <section className="relative overflow-hidden border-t border-[#FF3D00]/10 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF3D00]/8 blur-[200px]" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-[family-name:var(--font-barlow-condensed)] text-4xl font-800 uppercase tracking-wide sm:text-5xl lg:text-6xl"
          >
            Stüdyonuzu
            <br />
            <span className="text-[#FF3D00]">Dijitale Taşıyalım</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-lg text-white/50"
          >
            Taahhüt yok, zorlama yok — sadece {props.firmName} için özel tasarlanmış
            profesyonel portfolyo web sitesi teklifi.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8">
            <a
              href={chatLink}
              onClick={() => trackEvent(props.slug, 'CHAT_CLICK')}
              className="group inline-flex items-center gap-3 bg-[#FF3D00] px-10 py-5 font-[family-name:var(--font-barlow-condensed)] text-xl font-700 uppercase tracking-wider text-white transition-all hover:bg-[#FF5722] hover:shadow-[0_0_60px_rgba(255,61,0,0.4)]"
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
      <section className="border-t border-white/5 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3 sm:px-6"
        >
          {[
            { icon: '🎨', title: 'Ücretsiz Tasarım', desc: 'İlk görüşme ve tasarım analizi tamamen ücretsiz. Taahhüt yok.' },
            { icon: '⚡', title: '48 Saat Teslimat', desc: 'Profesyonel web siteniz 48 saat içinde hazır.' },
            { icon: '🛡️', title: 'Teknik Destek', desc: 'Lansman sonrası 30 gün ücretsiz teknik destek.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-[family-name:var(--font-barlow-condensed)] text-lg font-700 uppercase tracking-wide">{item.title}</h3>
              <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm text-white/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-white/5 py-8 text-center font-[family-name:var(--font-barlow)] text-sm text-white/20">
        <p>Bu sayfa <strong className="text-white/40">Vorte Studio</strong> tarafından {props.firmName} için özel hazırlanmıştır.</p>
      </footer>
    </div>
  )
}
