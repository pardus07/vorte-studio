"use client";

import { useState, useTransition } from "react";
import { updateProposalStatus, deleteProposal } from "@/actions/proposals";
import { markPaymentPaid, revertPayment } from "@/actions/payments";

interface PaymentItem {
  id: string;
  stage: number;
  label: string;
  amount: number;
  paidAt: string | null;
  status: string;
  notes: string | null;
}

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
  // Sözleşme
  contractId: string | null;
  contractStatus: string | null;
  contractSignedAt: string | null;
  contractSignerName: string | null;
  // Ödemeler
  payments: PaymentItem[];
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

const fmt = (n: number) => n.toLocaleString("tr-TR");

export default function ProposalsList({ initialData }: { initialData: Proposal[] }) {
  const [items, setItems] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [paymentNote, setPaymentNote] = useState("");

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

  function handlePayment(paymentId: string, proposalId: string) {
    startTransition(async () => {
      const res = await markPaymentPaid(paymentId, paymentNote || undefined);
      if (res.success) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  payments: p.payments.map((pay) =>
                    pay.id === paymentId
                      ? { ...pay, status: "PAID", paidAt: new Date().toISOString(), notes: paymentNote || null }
                      : pay
                  ),
                }
              : p
          )
        );
        setPaymentNote("");
      }
    });
  }

  function handleRevertPayment(paymentId: string, proposalId: string) {
    startTransition(async () => {
      const res = await revertPayment(paymentId);
      if (res.success) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  payments: p.payments.map((pay) =>
                    pay.id === paymentId ? { ...pay, status: "PENDING", paidAt: null, notes: null } : pay
                  ),
                }
              : p
          )
        );
      }
    });
  }

  // İstatistikler
  const stats = {
    total: items.length,
    sent: items.filter((p) => p.status === "SENT" || p.status === "VIEWED").length,
    accepted: items.filter((p) => p.status === "ACCEPTED").length,
    contracted: items.filter((p) => p.contractStatus === "SIGNED").length,
    totalRevenue: items
      .filter((p) => p.status === "ACCEPTED")
      .reduce((sum, p) => sum + p.totalPrice, 0),
    paidAmount: items.reduce(
      (sum, p) => sum + p.payments.filter((pay) => pay.status === "PAID").reduce((s, pay) => s + pay.amount, 0),
      0
    ),
  };

  return (
    <div className="space-y-4">
      {/* İstatistikler */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Toplam", value: stats.total.toString(), color: "text-admin-text" },
          { label: "Bekleyen", value: stats.sent.toString(), color: "text-amber-400" },
          { label: "Onaylanan", value: stats.accepted.toString(), color: "text-emerald-400" },
          { label: "Sozlesme", value: stats.contracted.toString(), color: "text-blue-400" },
          { label: "Toplam Gelir", value: `${(stats.totalRevenue / 1000).toFixed(0)}K`, color: "text-admin-accent" },
          { label: "Alinan Odeme", value: `${fmt(stats.paidAmount)}`, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-admin-border bg-admin-bg2 p-3">
            <div className="text-[11px] uppercase tracking-wider text-admin-muted">{s.label}</div>
            <div className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</div>
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
                <th className="px-4 py-3">Fiyat</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Sozlesme</th>
                <th className="px-4 py-3">Odeme</th>
                <th className="px-4 py-3 text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-admin-muted">
                    Henuz teklif olusturulmadi.
                  </td>
                </tr>
              )}
              {items.map((p) => {
                const style = STATUS_STYLES[p.status] || STATUS_STYLES.DRAFT;
                const paidCount = p.payments.filter((pay) => pay.status === "PAID").length;
                const totalPayments = p.payments.length;
                const isExpanded = expandedId === p.id;

                return (
                  <>
                    <tr
                      key={p.id}
                      className={`transition-colors hover:bg-admin-bg/50 cursor-pointer ${isExpanded ? "bg-admin-bg/30" : ""}`}
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-admin-text">{p.firmName}</div>
                        <div className="mt-0.5 text-xs text-admin-muted">
                          {p.contactName || ""}
                          {p.sector && ` · ${p.sector}`}
                          {p.city && ` · ${p.city}`}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-admin-accent">
                          {fmt(p.totalPrice)} TL
                        </span>
                        <div className="text-[10px] text-admin-muted">
                          KDV dahil: {fmt(Math.round(p.totalPrice * 1.2))} TL
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {p.contractStatus === "SIGNED" ? (
                          <div>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
                              Imzalandi
                            </span>
                            {p.contractSignedAt && (
                              <div className="mt-1 text-[10px] text-admin-muted">
                                {formatDate(p.contractSignedAt)}
                              </div>
                            )}
                          </div>
                        ) : p.status === "ACCEPTED" ? (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                            Imza Bekleniyor
                          </span>
                        ) : (
                          <span className="text-[10px] text-admin-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {totalPayments > 0 ? (
                          <div className="flex items-center gap-2">
                            {/* Ödeme progress bar */}
                            <div className="flex gap-0.5">
                              {p.payments.map((pay) => (
                                <div
                                  key={pay.id}
                                  className={`h-2 w-6 rounded-sm ${
                                    pay.status === "PAID" ? "bg-emerald-500" : "bg-white/10"
                                  }`}
                                  title={`${pay.label}: ${pay.status === "PAID" ? "Odendi" : "Bekliyor"}`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-admin-muted">
                              {paidCount}/{totalPayments}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-admin-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => copyLink(p.token)}
                            className="rounded-md px-2 py-1 text-[10px] text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-text"
                          >
                            {copied === p.token ? "Kopyalandi" : "Link"}
                          </button>
                          <a
                            href={`/teklif/${p.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md px-2 py-1 text-[10px] text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-text"
                          >
                            Onizle
                          </a>
                          {p.status === "DRAFT" && (
                            <button
                              onClick={() => handleStatusChange(p.id, "SENT")}
                              disabled={isPending}
                              className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400 hover:bg-amber-500/20 disabled:opacity-50"
                            >
                              Gonder
                            </button>
                          )}
                          {deleteConfirm === p.id ? (
                            <>
                              <button
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await deleteProposal(p.id);
                                    if (res.success) {
                                      setItems((prev) => prev.filter((x) => x.id !== p.id));
                                      setDeleteConfirm(null);
                                    }
                                  });
                                }}
                                disabled={isPending}
                                className="rounded-md bg-red-500/20 px-2 py-1 text-[10px] font-medium text-red-400 disabled:opacity-50"
                              >
                                Evet
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="rounded-md px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text"
                              >
                                Vazgec
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="rounded-md px-2 py-1 text-[10px] text-admin-muted/40 hover:bg-red-500/10 hover:text-red-400"
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Genişletilmiş ödeme detay paneli */}
                    {isExpanded && (
                      <tr key={`${p.id}-detail`}>
                        <td colSpan={6} className="bg-admin-bg/20 px-6 py-4">
                          <div className="space-y-4">
                            {/* Sözleşme bilgisi */}
                            {p.contractStatus === "SIGNED" && (
                              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-blue-400">
                                      Sozlesme Imzalandi
                                    </span>
                                    <span className="text-[10px] text-blue-400/50">
                                      — {p.contractSignerName} · {p.contractSignedAt && formatDate(p.contractSignedAt)}
                                    </span>
                                  </div>

                                  {/* PDF butonları */}
                                  {p.contractId && (
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                      <a
                                        href={`/api/contracts/${p.contractId}/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
                                      >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Onizle
                                      </a>
                                      <a
                                        href={`/api/contracts/${p.contractId}/pdf?download=1`}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                                      >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        Indir
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Ödeme kartları */}
                            {p.payments.length > 0 ? (
                              <div>
                                <div className="mb-3 text-[11px] uppercase tracking-wider text-admin-muted">
                                  Odeme Takibi
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                  {p.payments.map((pay) => {
                                    const isPaid = pay.status === "PAID";
                                    const colors = [
                                      { border: "border-emerald-500/30", bg: "bg-emerald-500/5", accent: "text-emerald-400" },
                                      { border: "border-amber-500/30", bg: "bg-amber-500/5", accent: "text-amber-400" },
                                      { border: "border-blue-500/30", bg: "bg-blue-500/5", accent: "text-blue-400" },
                                    ][pay.stage - 1] || { border: "border-white/10", bg: "bg-white/5", accent: "text-white/60" };

                                    return (
                                      <div
                                        key={pay.id}
                                        className={`rounded-xl border ${isPaid ? "border-emerald-500/30 bg-emerald-500/5" : colors.border + " " + colors.bg} p-4`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-[10px] uppercase tracking-wider text-admin-muted">
                                            {pay.label}
                                          </span>
                                          {isPaid ? (
                                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                                              ODENDI
                                            </span>
                                          ) : (
                                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                                              BEKLIYOR
                                            </span>
                                          )}
                                        </div>

                                        <div className={`text-2xl font-bold ${isPaid ? "text-emerald-400" : colors.accent}`}>
                                          {fmt(pay.amount)} TL
                                        </div>

                                        {isPaid && pay.paidAt && (
                                          <div className="mt-1 text-[10px] text-emerald-400/60">
                                            {formatDate(pay.paidAt)}
                                            {pay.notes && ` · ${pay.notes}`}
                                          </div>
                                        )}

                                        {/* Ödeme aksiyonları */}
                                        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                                          {!isPaid ? (
                                            <div className="space-y-2">
                                              <input
                                                type="text"
                                                placeholder="Odeme notu (istege bagli)"
                                                value={paymentNote}
                                                onChange={(e) => setPaymentNote(e.target.value)}
                                                onFocus={() => setPaymentNote("")}
                                                className="w-full rounded-md border border-admin-border bg-admin-bg px-2 py-1.5 text-[11px] text-admin-text placeholder-admin-muted outline-none focus:border-admin-accent/30"
                                              />
                                              <button
                                                onClick={() => handlePayment(pay.id, p.id)}
                                                disabled={isPending}
                                                className="w-full rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30 disabled:opacity-50"
                                              >
                                                {isPending ? "Isleniyor..." : "Odeme Yapildi"}
                                              </button>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => handleRevertPayment(pay.id, p.id)}
                                              disabled={isPending}
                                              className="w-full rounded-md px-2 py-1 text-[10px] text-admin-muted/40 transition-colors hover:text-red-400 disabled:opacity-50"
                                            >
                                              Geri Al
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-xs text-admin-muted py-4">
                                {p.contractStatus === "SIGNED"
                                  ? "Odeme kayitlari olusturuluyor..."
                                  : "Sozlesme imzalandiktan sonra odeme takibi aktif olacak."}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
