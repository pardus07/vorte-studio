"use client";

import { useState, useTransition } from "react";
import { updateProposalStatus } from "@/actions/proposals";

interface Proposal {
  id: string;
  token: string;
  firmName: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  sector: string | null;
  city: string | null;
  siteType: string | null;
  totalPrice: number;
  estimatedHours: number | null;
  status: string;
  validUntil: string;
  viewedAt: string | null;
  acceptedAt: string | null;
  sentAt: string | null;
  createdAt: string;
  score: string | null;
  slug: string | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-white/5", text: "text-white/50", label: "Taslak" },
  SENT: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Gonderildi" },
  VIEWED: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Goruntulendi" },
  ACCEPTED: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Onaylandi" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", label: "Reddedildi" },
  EXPIRED: { bg: "bg-white/5", text: "text-white/30", label: "Suresi Doldu" },
};

const SITE_LABELS: Record<string, string> = {
  tanitim: "Tanitim",
  "e-ticaret": "E-Ticaret",
  portfoy: "Portfolyo",
  randevu: "Randevu",
  katalog: "Katalog",
};

export default function ProposalsList({ initialData }: { initialData: Proposal[] }) {
  const [items, setItems] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function handleStatusChange(id: string, status: "SENT" | "ACCEPTED" | "REJECTED") {
    startTransition(async () => {
      const res = await updateProposalStatus(id, status);
      if (res.success) {
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      }
    });
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/teklif/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  // İstatistikler
  const stats = {
    total: items.length,
    draft: items.filter((p) => p.status === "DRAFT").length,
    sent: items.filter((p) => p.status === "SENT").length,
    viewed: items.filter((p) => p.status === "VIEWED").length,
    accepted: items.filter((p) => p.status === "ACCEPTED").length,
    totalRevenue: items
      .filter((p) => p.status === "ACCEPTED")
      .reduce((sum, p) => sum + p.totalPrice, 0),
  };

  return (
    <div className="space-y-4">
      {/* İstatistikler */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Toplam", value: stats.total, color: "text-admin-text" },
          { label: "Taslak", value: stats.draft, color: "text-white/50" },
          { label: "Gonderildi", value: stats.sent, color: "text-amber-400" },
          { label: "Goruntulendi", value: stats.viewed, color: "text-blue-400" },
          { label: "Onaylandi", value: stats.accepted, color: "text-emerald-400" },
          {
            label: "Toplam Gelir",
            value: `${(stats.totalRevenue / 1000).toFixed(0)}K`,
            color: "text-admin-accent",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-admin-border bg-admin-bg2 p-3"
          >
            <div className="text-[11px] uppercase tracking-wider text-admin-muted">
              {s.label}
            </div>
            <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tablo */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] uppercase tracking-wider text-admin-muted">
                <th className="px-4 py-3">Firma</th>
                <th className="px-4 py-3">Tur</th>
                <th className="px-4 py-3">Fiyat</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3 text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-admin-muted">
                    Henuz teklif olusturulmadi. Basvurular sayfasindan teklif olusturabilirsiniz.
                  </td>
                </tr>
              )}
              {items.map((p) => {
                const style = STATUS_STYLES[p.status] || STATUS_STYLES.DRAFT;
                const daysLeft = Math.max(
                  0,
                  Math.ceil((new Date(p.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                );

                return (
                  <tr key={p.id} className="transition-colors hover:bg-admin-bg/50">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-admin-text">{p.firmName}</div>
                      <div className="mt-0.5 text-xs text-admin-muted">
                        {p.contactName || ""}
                        {p.sector && ` · ${p.sector}`}
                        {p.city && ` · ${p.city}`}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-admin-muted">
                      {p.siteType ? SITE_LABELS[p.siteType] || p.siteType : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-admin-accent">
                        {p.totalPrice.toLocaleString("tr-TR")} TL
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                      {p.status === "SENT" && daysLeft > 0 && (
                        <span className="ml-1.5 text-[10px] text-admin-muted">
                          {daysLeft}g
                        </span>
                      )}
                      {p.viewedAt && p.status !== "ACCEPTED" && (
                        <div className="mt-1 text-[10px] text-blue-400/60">
                          Goruntulendi: {formatDate(p.viewedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-admin-muted">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Link kopyala */}
                        <button
                          onClick={() => copyLink(p.token)}
                          className="rounded-md px-2 py-1 text-[10px] text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-text"
                          title="Teklif linkini kopyala"
                        >
                          {copied === p.token ? "Kopyalandi" : "Link"}
                        </button>

                        {/* Önizle */}
                        <a
                          href={`/teklif/${p.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md px-2 py-1 text-[10px] text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-text"
                        >
                          Onizle
                        </a>

                        {/* Durum değiştir */}
                        {p.status === "DRAFT" && (
                          <button
                            onClick={() => handleStatusChange(p.id, "SENT")}
                            disabled={isPending}
                            className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
                          >
                            Gonder
                          </button>
                        )}
                        {(p.status === "SENT" || p.status === "VIEWED") && (
                          <>
                            <button
                              onClick={() => handleStatusChange(p.id, "ACCEPTED")}
                              disabled={isPending}
                              className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusChange(p.id, "REJECTED")}
                              disabled={isPending}
                              className="rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                            >
                              Reddet
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
