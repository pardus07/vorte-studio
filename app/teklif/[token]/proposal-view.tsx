"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { acceptProposal, rejectProposal } from "@/actions/proposals";

// ── Label Maps ──
const SITE_TYPE_LABELS: Record<string, string> = {
  tanitim: "Tanitim Sitesi",
  "e-ticaret": "E-Ticaret Sitesi",
  portfoy: "Portfolyo Sitesi",
  randevu: "Randevu Sistemi",
  katalog: "Katalog Sitesi",
  belirsiz: "Ozel Proje",
};

const FEATURE_LABELS: Record<string, string> = {
  "online-randevu": "Online Randevu Sistemi",
  "urun-katalogu": "Urun Katalogu / Admin Paneli",
  whatsapp: "WhatsApp Entegrasyonu",
  harita: "Google Harita",
  galeri: "Fotograf Galerisi",
  blog: "Blog Sistemi",
  yorumlar: "Musteri Yorumlari",
  "sosyal-medya": "Sosyal Medya Entegrasyonu",
  "online-odeme": "Online Odeme Sistemi",
  "cok-dilli": "Cok Dilli Site",
  "canli-destek": "Canli Destek",
  seo: "SEO Optimizasyonu",
};

const TIMELINE_LABELS: Record<string, string> = {
  acil: "2 hafta icinde",
  "1-ay": "1 ay icinde",
  "2-3-ay": "2-3 ay icinde",
  esnek: "Esnek zamanlama",
};

interface ProposalData {
  id: string;
  token: string;
  firmName: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  sector: string | null;
  city: string | null;
  siteType: string | null;
  features: string[];
  pageCount: string | null;
  contentStatus: string | null;
  hostingStatus: string | null;
  hostingProvider: string | null;
  domainStatus: string | null;
  domainName: string | null;
  timeline: string | null;
  items: Array<{ label: string; hours?: number; cost: number }>;
  totalPrice: number;
  estimatedHours: number | null;
  paymentPlan: Array<{ label: string; percent: number; amount: number; description: string }>;
  status: string;
  validUntil: string;
  viewedAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const fmt = (n: number) => n.toLocaleString("tr-TR");

export default function ProposalView({ proposal }: { proposal: ProposalData }) {
  const [accepted, setAccepted] = useState(proposal.status === "ACCEPTED");
  const [rejected, setRejected] = useState(proposal.status === "REJECTED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const isExpired = new Date(proposal.validUntil) < new Date();
  const canAccept = !accepted && !rejected && !isExpired && proposal.status !== "DRAFT";
  const validDate = new Date(proposal.validUntil).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const createdDate = new Date(proposal.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(proposal.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  // KDV hesaplama (%20)
  const kdvRate = 0.20;
  const kdvAmount = Math.round(proposal.totalPrice * kdvRate);
  const totalWithKdv = proposal.totalPrice + kdvAmount;

  async function handleAccept() {
    setLoading(true);
    setError(null);
    const res = await acceptProposal(proposal.token);
    if (res.success) {
      setAccepted(true);
    } else {
      setError(res.error || "Bir hata olustu");
    }
    setLoading(false);
  }

  async function handleReject() {
    setLoading(true);
    setError(null);
    const res = await rejectProposal(proposal.token);
    if (res.success) {
      setRejected(true);
      setShowRejectConfirm(false);
    } else {
      setError(res.error || "Bir hata olustu");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header Bar */}
      <div className="border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF4500] to-orange-600 text-sm font-bold">
              V
            </div>
            <span className="text-sm font-semibold tracking-tight">
              VORTE<span className="text-[#FF4500]">.</span>STUDIO
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            {!isExpired && !accepted && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {daysLeft} gun gecerli
              </span>
            )}
            {accepted && (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400 border border-emerald-500/20">
                Onaylandi
              </span>
            )}
            {isExpired && !accepted && (
              <span className="rounded-full bg-red-500/15 px-3 py-1 text-red-400 border border-red-500/20">
                Suresi doldu
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Teklif · {createdDate}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {proposal.firmName}
          </h1>
          <p className="mt-3 text-sm text-white/40">
            {proposal.siteType ? SITE_TYPE_LABELS[proposal.siteType] || proposal.siteType : "Web Projesi"}
            {proposal.sector && ` · ${proposal.sector}`}
            {proposal.city && ` · ${proposal.city}`}
          </p>
        </motion.div>

        {/* Fiyat Kartı */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
        >
          <div className="text-xs uppercase tracking-widest text-white/30 mb-3">
            Toplam Proje Bedeli
          </div>
          <div className="text-5xl font-bold tracking-tight text-[#FF4500] sm:text-6xl">
            {fmt(totalWithKdv)} <span className="text-2xl text-white/30">TL</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-xs text-white/30">
              {fmt(proposal.totalPrice)} TL + %{kdvRate * 100} KDV ({fmt(kdvAmount)} TL)
            </div>
            <div className="text-[10px] text-white/15">
              Gecerlilik: {validDate}
            </div>
          </div>
        </motion.div>

        {/* Ödeme Planı */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {proposal.paymentPlan.map((pay, i) => {
            const colors = [
              { border: "border-emerald-500/20", bg: "bg-emerald-500/5", text: "text-emerald-400", accent: "#22c55e" },
              { border: "border-amber-500/20", bg: "bg-amber-500/5", text: "text-amber-400", accent: "#f59e0b" },
              { border: "border-blue-500/20", bg: "bg-blue-500/5", text: "text-blue-400", accent: "#3b82f6" },
            ][i] || { border: "border-white/10", bg: "bg-white/5", text: "text-white/60", accent: "#fff" };

            return (
              <div
                key={pay.label}
                className={`rounded-xl border ${colors.border} ${colors.bg} p-5 text-center`}
              >
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                  {pay.label} (%{pay.percent})
                </div>
                <div className={`text-2xl font-bold ${colors.text}`}>
                  {fmt(pay.amount)} TL
                </div>
                <div className="mt-1.5 text-xs text-white/30">
                  {pay.description}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Proje Kapsamı */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
            Proje Kapsami
          </h2>

          {/* Özellikler */}
          {proposal.features.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 text-xs text-white/30 uppercase tracking-wider">
                Dahil Ozellikler
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {proposal.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
                  >
                    <svg className="h-4 w-4 shrink-0 text-[#FF4500]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white/70">{FEATURE_LABELS[f] || f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proje Detayları Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Sayfa Sayisi", value: proposal.pageCount },
              { label: "Zamanlama", value: proposal.timeline ? TIMELINE_LABELS[proposal.timeline] || proposal.timeline : null },
              { label: "Hosting", value: proposal.hostingProvider || proposal.hostingStatus },
              { label: "Domain", value: proposal.domainName || proposal.domainStatus },
            ].map(
              (item) =>
                item.value && (
                  <div key={item.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/25">{item.label}</div>
                    <div className="mt-1 text-sm text-white/60">{item.value}</div>
                  </div>
                )
            )}
          </div>
        </motion.div>

        {/* Fiyat Kırılımı */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
        >
          <div className="border-b border-white/5 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Fiyat Kirilimi
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {proposal.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#FF4500]/60" />
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-white/80">
                  {fmt(item.cost)} TL
                </span>
              </div>
            ))}
          </div>

          {/* Ara Toplam + KDV + Toplam */}
          <div className="border-t border-white/10 bg-white/[0.03] px-6 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">Ara Toplam</span>
              <span className="text-sm text-white/60">{fmt(proposal.totalPrice)} TL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">KDV (%{kdvRate * 100})</span>
              <span className="text-sm text-white/60">{fmt(kdvAmount)} TL</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-sm font-semibold text-white/70">TOPLAM (KDV Dahil)</span>
              <span className="text-xl font-bold text-[#FF4500]">{fmt(totalWithKdv)} TL</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
          className="mb-12"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {accepted ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-emerald-400">Teklif Onaylandi!</h3>
              <p className="mt-2 text-sm text-white/40">
                En kisa surede sizinle iletisime gececegiz. Tesekkur ederiz.
              </p>
            </div>
          ) : rejected ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-400">Teklif Reddedildi</h3>
              <p className="mt-2 text-sm text-white/40">
                Fikrinizi degistirirseniz bizimle iletisime gecebilirsiniz.
              </p>
            </div>
          ) : canAccept ? (
            <div className="space-y-3">
              {/* Red onay dialog'u */}
              {showRejectConfirm && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm text-red-300 mb-3">Teklifi reddetmek istediginizden emin misiniz?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={loading}
                      className="flex-1 rounded-lg bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {loading ? "Isleniyor..." : "Evet, Reddet"}
                    </button>
                    <button
                      onClick={() => setShowRejectConfirm(false)}
                      className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/5"
                    >
                      Vazgec
                    </button>
                  </div>
                </div>
              )}

              {/* Kabul butonu */}
              <button
                onClick={handleAccept}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#FF4500] to-orange-600 px-8 py-5 text-lg font-semibold text-white shadow-2xl shadow-[#FF4500]/20 transition-all hover:shadow-[#FF4500]/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Isleniyor..." : "Teklifi Kabul Ediyorum"}
              </button>

              {/* Red butonu */}
              {!showRejectConfirm && (
                <button
                  onClick={() => setShowRejectConfirm(true)}
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white/30 transition-colors hover:border-red-500/20 hover:text-red-400/60"
                >
                  Teklifi Reddet
                </button>
              )}
            </div>
          ) : isExpired ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <h3 className="text-lg font-semibold text-red-400">Teklifin suresi dolmustur</h3>
              <p className="mt-2 text-sm text-white/40">
                Guncel teklif icin bizimle iletisime gecin.
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* İletişim */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
          className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 text-center"
        >
          <p className="text-xs text-white/25 mb-3">Sorulariniz mi var?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/905431883425"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/10"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:studio@vorte.com.tr"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/10"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              E-posta
            </a>
          </div>
          <div className="mt-4 text-[10px] text-white/15">
            Vorte Studio · vortestudio.com
          </div>
        </motion.div>
      </main>
    </div>
  );
}
