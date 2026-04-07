"use client";

import Link from "next/link";
import WorkflowTimeline from "./WorkflowTimeline";

interface DashboardData {
  user: { id: string; name: string; email: string; firmName: string };
  proposal: {
    id: string; token: string; firmName: string; status: string;
    totalPrice: number; siteType: string | null; features: string[];
    timeline: string | null; createdAt: string;
  };
  contract: { id: string; status: string; signedAt: string | null } | null;
  payments: {
    id: string; stage: number; label: string; amount: number;
    status: string; paidAt: string | null;
  }[];
  recentMessages: {
    id: string; content: string; senderType: string;
    isRead: boolean; createdAt: string;
  }[];
  recentFiles: {
    id: string; fileName: string; fileSize: number;
    uploadedBy: string; createdAt: string;
  }[];
  logoStatus: string | null;
  design: {
    stagingUrl: string | null;
    designApprovedAt: string | null;
    usedRevisions: number;
  };
  unreadCount: number;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Taslak", color: "text-white/40" },
  SENT: { label: "Gönderildi", color: "text-blue-400" },
  VIEWED: { label: "Görüntülendi", color: "text-amber-400" },
  ACCEPTED: { label: "Kabul Edildi", color: "text-green-400" },
  REJECTED: { label: "Reddedildi", color: "text-red-400" },
  PENDING: { label: "Bekleniyor", color: "text-amber-400" },
  SIGNED: { label: "İmzalandı", color: "text-green-400" },
  PAID: { label: "Ödendi", color: "text-green-400" },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0 }).format(price);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function PortalDashboardView({ data }: { data: DashboardData }) {
  const { user, proposal, contract, payments, recentMessages, logoStatus, design, unreadCount } = data;
  const designIsApproved = Boolean(design.designApprovedAt);
  const designHasUrl = Boolean(design.stagingUrl);

  const paidTotal = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const totalDue = payments.reduce((s, p) => s + p.amount, 0);
  const progressPercent = totalDue > 0 ? Math.round((paidTotal / totalDue) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hoş geldin */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Merhaba, <span className="text-accent">{user.name}</span>
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {user.firmName} projesi — Portal paneli
        </p>
      </div>

      {/* Özet Kartları */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Proje Durumu */}
        <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Proje Durumu</p>
          <p className={`mt-2 text-lg font-bold ${STATUS_MAP[proposal.status]?.color || "text-white"}`}>
            {STATUS_MAP[proposal.status]?.label || proposal.status}
          </p>
        </div>

        {/* Sözleşme */}
        <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Sözleşme</p>
          <p className={`mt-2 text-lg font-bold ${contract ? (STATUS_MAP[contract.status]?.color || "text-white") : "text-white/30"}`}>
            {contract ? STATUS_MAP[contract.status]?.label || contract.status : "Henüz yok"}
          </p>
        </div>

        {/* Ödeme */}
        <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider">Ödeme Durumu</p>
          <p className="mt-2 text-lg font-bold text-white">
            {formatPrice(paidTotal)} <span className="text-sm text-white/30">/ {formatPrice(totalDue)} ₺</span>
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Mesajlar */}
        <Link href="/portal/mesajlar" className="group rounded-2xl border border-white/[0.07] bg-bg2 p-5 transition-colors hover:border-accent/30">
          <p className="text-xs text-white/40 uppercase tracking-wider">Mesajlar</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-lg font-bold text-white">{unreadCount}</p>
            {unreadCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                Yeni
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/30 group-hover:text-white/50">Okunmamış mesaj →</p>
        </Link>
      </div>

      {/* Proje Yol Haritası — Sıradaki adımlar timeline'ı */}
      <div className="mb-8">
        <WorkflowTimeline
          state={{
            proposalStatus: proposal.status,
            contractStatus: contract?.status || null,
            logoStatus,
            payments: payments.map((p) => ({ stage: p.stage, status: p.status })),
          }}
        />
      </div>

      {/* Tasarım Önizleme — staging URL geldiyse göster */}
      {designHasUrl && (
        <div className="mb-8">
          <Link
            href="/portal/tasarim"
            className={`group block rounded-2xl border p-6 transition-all ${
              designIsApproved
                ? "border-green-500/20 bg-green-500/[0.03] hover:border-green-500/40"
                : "border-accent/30 bg-accent/[0.04] hover:border-accent/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                  designIsApproved ? "bg-green-500/10" : "bg-accent/10"
                }`}
              >
                <svg
                  className={`h-6 w-6 ${designIsApproved ? "text-green-400" : "text-accent"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">Tasarım Önizleme</h2>
                  {!designIsApproved && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">
                      İnceleme Bekliyor
                    </span>
                  )}
                  {designIsApproved && (
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                      Onaylandı
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/50">
                  {designIsApproved
                    ? "Tasarımınız onaylandı, üretim aşamasına geçildi."
                    : "Tasarımınız hazır. İnceleyip revizyon talep edebilir veya onaylayabilirsiniz."}
                </p>
              </div>
              <svg
                className="h-5 w-5 flex-shrink-0 text-white/30 group-hover:translate-x-1 group-hover:text-white/60 transition-all"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>
      )}

      {/* Ödeme Planı */}
      <div className="mb-8 rounded-2xl border border-white/[0.07] bg-bg2 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Ödeme Planı</h2>
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${p.status === "PAID" ? "bg-green-500" : "bg-white/20"}`} />
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  {p.paidAt && <p className="text-xs text-white/30">{formatDate(p.paidAt)}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatPrice(p.amount)} ₺</p>
                <p className={`text-xs ${STATUS_MAP[p.status]?.color || "text-white/40"}`}>
                  {STATUS_MAP[p.status]?.label || p.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Son Mesajlar */}
      {recentMessages.length > 0 && (
        <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Son Mesajlar</h2>
            <Link href="/portal/mesajlar" className="text-xs text-accent hover:underline">
              Tümünü gör →
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((m) => (
              <div key={m.id} className="flex gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
                <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${m.senderType === "ADMIN" ? "bg-accent" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-white/50">
                      {m.senderType === "ADMIN" ? "Vorte Studio" : user.name}
                    </p>
                    <span className="text-xs text-white/20">{timeAgo(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/70 line-clamp-2">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
