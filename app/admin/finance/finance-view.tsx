"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPayment, markPaymentPaid } from "@/actions/finance";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "./revenue-chart";

type Payment = { id: string; projectTitle: string; projectId: string; amount: number; type: string; status: string; dueDate: string; paidAt: string | null; invoiceNo: string | null };
type Maintenance = { id: string; clientName: string; fee: number; renewalDate: string | null };
type Project = { id: string; title: string };

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  OVERDUE: { label: "Gecikmiş", color: "bg-admin-red-dim text-admin-red" },
  PENDING: { label: "Bekliyor", color: "bg-admin-amber-dim text-admin-amber" },
  PAID: { label: "Ödendi", color: "bg-admin-green-dim text-admin-green" },
  CANCELLED: { label: "İptal", color: "bg-admin-red-dim text-admin-red" },
};

const typeLabels: Record<string, string> = { DEPOSIT: "Peşinat", MILESTONE: "Aşama", FINAL: "Final", MAINTENANCE: "Bakım" };
const typeOptions = [
  { value: "DEPOSIT", label: "Peşinat" }, { value: "MILESTONE", label: "Aşama" },
  { value: "FINAL", label: "Final" }, { value: "MAINTENANCE", label: "Bakım" },
];

export default function FinanceView({ stats, payments: initialPayments, maintenances, monthlyRevenue, projects }: {
  stats: { thisMonthRevenue: number; pendingTotal: number; overdueCount: number; yearlyProjection: number; maintenanceTotal: number; maintenanceCount: number };
  payments: Payment[]; maintenances: Maintenance[];
  monthlyRevenue: { month: string; value: number }[];
  projects: Project[];
}) {
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ projectId: projects[0]?.id || "", amount: "", type: "MILESTONE", dueDate: "", invoiceNo: "" });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showNotif(msg: string, type: "success" | "error") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createPayment({ ...form, amount: Number(form.amount), type: form.type as "DEPOSIT" | "MILESTONE" | "FINAL" | "MAINTENANCE" });
    if (result.success) {
      setShowModal(false);
      setForm({ projectId: projects[0]?.id || "", amount: "", type: "MILESTONE", dueDate: "", invoiceNo: "" });
      router.refresh();
      showNotif("Ödeme oluşturuldu.", "success");
    } else {
      showNotif(result.error || "Hata oluştu.", "error");
    }
    setSaving(false);
  }

  async function handleMarkPaid(paymentId: string) {
    setPayments((prev) => prev.map((p) => p.id === paymentId ? { ...p, status: "PAID", paidAt: new Date().toISOString() } : p));
    const result = await markPaymentPaid(paymentId);
    if (!result.success) {
      setPayments(initialPayments);
      showNotif("Ödeme güncellenemedi.", "error");
    }
  }

  const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;
  const inputCls = "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none";

  return (
    <div className="space-y-5">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${notification.type === "success" ? "border-admin-green bg-admin-green-dim text-admin-green" : "border-admin-red bg-admin-red-dim text-admin-red"}`}>
          {notification.msg}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Bu ay gelir" value={fmt(stats.thisMonthRevenue)} sub={stats.thisMonthRevenue > 0 ? "Ödenen tutarlar" : "Henüz ödeme yok"} color="green" trend={stats.thisMonthRevenue > 0 ? "up" : undefined} />
        <StatCard label="Bekleyen ödeme" value={fmt(stats.pendingTotal)} sub={stats.overdueCount > 0 ? `${stats.overdueCount} gecikmiş` : "Gecikmiş yok"} color={stats.overdueCount > 0 ? "red" : "amber"} trend={stats.overdueCount > 0 ? "warn" : undefined} />
        <StatCard label="Yıllık projeksiyon" value={stats.yearlyProjection > 0 ? `₺${Math.round(stats.yearlyProjection / 1000)}K` : "₺0"} sub="Son 3 ay ortalaması × 12" color="blue" />
        <StatCard label="Aylık sabit gelir" value={fmt(stats.maintenanceTotal)} sub={`${stats.maintenanceCount} bakım müşterisi`} color="accent" />
      </div>

      {/* Chart + Maintenance */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-admin-bg2 p-5">
          <div className="mb-4 text-[13px] font-medium">📊 Son 6 Ay Gelir Trendi</div>
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">🔄 Aylık Bakım Gelirleri</div>
          <div className="divide-y divide-admin-border">
            {maintenances.length === 0 && <div className="px-4 py-6 text-center text-[12px] text-admin-muted">Aktif bakım paketi yok</div>}
            {maintenances.map((m) => {
              const daysToRenewal = m.renewalDate ? Math.ceil((new Date(m.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
              return (
                <div key={m.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="text-[12.5px] font-medium">{m.clientName}</div>
                    {m.renewalDate && (
                      <div className="text-[11px] text-admin-muted">
                        Yenileme: {new Date(m.renewalDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                        {daysToRenewal !== null && daysToRenewal <= 14 && <span className="ml-1 text-admin-amber">({daysToRenewal} gün)</span>}
                      </div>
                    )}
                  </div>
                  <div className="text-[13px] font-semibold text-admin-accent">{fmt(m.fee)}/ay</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
          <span className="text-[13px] font-medium">💰 Ödeme Takibi</span>
          <button onClick={() => setShowModal(true)} className="rounded-lg bg-admin-accent px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110">+ Ödeme Ekle</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">Proje</th><th className="px-4 py-2.5">Tür</th><th className="px-4 py-2.5">Tutar</th>
                <th className="px-4 py-2.5">Vade</th><th className="px-4 py-2.5">Fatura</th><th className="px-4 py-2.5">Durum</th><th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {payments.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[12px] text-admin-muted">Henüz ödeme kaydı yok</td></tr>
              )}
              {payments.map((p) => {
                const st = paymentStatusConfig[p.status] || paymentStatusConfig.PENDING;
                return (
                  <tr key={p.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-2.5 font-medium">{p.projectTitle}</td>
                    <td className="px-4 py-2.5 text-admin-muted">{typeLabels[p.type] || p.type}</td>
                    <td className="px-4 py-2.5 font-medium" style={{ fontFamily: "var(--font-geist-mono)" }}>{fmt(p.amount)}</td>
                    <td className={`px-4 py-2.5 ${p.status === "OVERDUE" ? "text-admin-red" : "text-admin-muted"}`}>
                      {new Date(p.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-2.5 text-admin-muted" style={{ fontFamily: "var(--font-geist-mono)" }}>{p.invoiceNo || "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      {p.status !== "PAID" && (
                        <button onClick={() => handleMarkPaid(p.id)} className="rounded bg-admin-green px-2 py-1 text-[9px] font-medium text-white hover:brightness-110">Ödendi</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ödeme Ekle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-admin-border bg-admin-bg2 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-admin-text">Yeni Ödeme</h3>
              <button onClick={() => setShowModal(false)} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
            </div>
            <form onSubmit={handleCreatePayment} className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-admin-muted">Proje *</label>
                <select value={form.projectId} onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))} className={inputCls}>
                  {projects.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Tutar (₺) *</label>
                  <input type="number" required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="10000" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Tür</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inputCls}>
                    {typeOptions.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Vade Tarihi *</label>
                  <input type="date" required value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Fatura No</label>
                  <input value={form.invoiceNo} onChange={(e) => setForm((f) => ({ ...f, invoiceNo: e.target.value }))} placeholder="INV-2026-XXX" className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3">İptal</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50">
                  {saving ? "Kaydediliyor..." : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
