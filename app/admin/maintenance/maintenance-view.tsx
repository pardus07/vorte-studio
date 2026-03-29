"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMaintenanceAction, renewSSL, getClientActivities } from "@/actions/maintenance";
import StatCard from "@/components/admin/StatCard";

type Maintenance = { id: string; clientId: string; clientName: string; websiteUrl: string; monthlyFee: number; renewalDate: string | null; domainExpiry: string | null; sslExpiry: string | null; plan: string | null };
type Client = { id: string; name: string };
type Activity = { id: string; type: string; description: string; createdAt: string };

function daysUntil(dateStr: string | null) {
  if (!dateStr) return 999;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function daysBadge(days: number) {
  if (days < 0) return { text: "EXPIRED", color: "text-admin-red", bg: "bg-admin-red-dim" };
  if (days <= 7) return { text: `${days} gün ⚠️`, color: "text-admin-red", bg: "bg-admin-red-dim" };
  if (days <= 30) return { text: `${days} gün`, color: "text-admin-amber", bg: "bg-admin-amber-dim" };
  return { text: `${days} gün`, color: "text-admin-green", bg: "bg-admin-green-dim" };
}

const planOptions = [
  { value: "basic", label: "Temel" },
  { value: "standard", label: "Standart" },
  { value: "premium", label: "Premium" },
];

export default function MaintenanceView({ stats, maintenances: initial, clients }: {
  stats: { activeCount: number; totalFee: number; sslWarnings: number };
  maintenances: Maintenance[]; clients: Client[];
}) {
  const router = useRouter();
  const [maintenances, setMaintenances] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [logModal, setLogModal] = useState<{ clientId: string; clientName: string; activities: Activity[] } | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ clientId: clients[0]?.id || "", websiteUrl: "", monthlyFee: "", startDate: "", renewalDate: "", domainExpiry: "", sslExpiry: "", plan: "standard" });
  const [saving, setSaving] = useState(false);

  function showNotif(msg: string, type: "success" | "error") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createMaintenanceAction({ ...form, monthlyFee: Number(form.monthlyFee) });
    if (result.success) { setShowModal(false); router.refresh(); showNotif("Bakım paketi oluşturuldu.", "success"); }
    else showNotif(result.error || "Hata.", "error");
    setSaving(false);
  }

  async function handleRenewSSL(id: string) {
    const result = await renewSSL(id);
    if (result.success) {
      // Optimistic: SSL tarihini 1 yıl uzat
      setMaintenances((prev) => prev.map((m) => {
        if (m.id !== id) return m;
        const newExpiry = new Date();
        newExpiry.setFullYear(newExpiry.getFullYear() + 1);
        return { ...m, sslExpiry: newExpiry.toISOString() };
      }));
      showNotif("SSL sertifikası yenilendi.", "success");
    } else showNotif(result.error || "Hata.", "error");
  }

  async function handleShowLog(clientId: string, clientName: string) {
    const activities = await getClientActivities(clientId);
    setLogModal({ clientId, clientName, activities });
  }

  const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;
  const inputCls = "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none";

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${notification.type === "success" ? "border-admin-green bg-admin-green-dim text-admin-green" : "border-admin-red bg-admin-red-dim text-admin-red"}`}>{notification.msg}</div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Aktif paket" value={String(stats.activeCount)} sub="Tümü aktif" color="green" />
        <StatCard label="Bu ay bakım geliri" value={fmt(stats.totalFee)} sub="Aylık sabit gelir" color="accent" />
        <StatCard label="SSL uyarısı" value={String(stats.sslWarnings)} sub={stats.sslWarnings > 0 ? "Acil yenileme gerekli" : "Sorun yok"} color={stats.sslWarnings > 0 ? "red" : "green"} trend={stats.sslWarnings > 0 ? "warn" : undefined} />
      </div>

      <div className="flex items-center justify-end">
        <button onClick={() => setShowModal(true)} className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110">+ Yeni Bakım Müşterisi</button>
      </div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">Müşteri</th><th className="px-4 py-2.5">Website</th><th className="px-4 py-2.5">Ücret</th>
                <th className="px-4 py-2.5">Yenileme</th><th className="px-4 py-2.5">Domain</th><th className="px-4 py-2.5">SSL</th><th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {maintenances.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-[12px] text-admin-muted">Aktif bakım paketi yok</td></tr>}
              {maintenances.map((m) => {
                const domainDays = daysUntil(m.domainExpiry);
                const sslDays = daysUntil(m.sslExpiry);
                const dBadge = daysBadge(domainDays);
                const sBadge = daysBadge(sslDays);
                return (
                  <tr key={m.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.clientName}</div>
                      <div className="text-[10px] text-admin-muted capitalize">{m.plan || "standard"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`https://${m.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-admin-blue hover:underline">{m.websiteUrl}</a>
                    </td>
                    <td className="px-4 py-3 font-medium text-admin-green">{fmt(m.monthlyFee)}/ay</td>
                    <td className="px-4 py-3 text-admin-muted">
                      {m.renewalDate ? new Date(m.renewalDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {m.domainExpiry ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${dBadge.bg} ${dBadge.color}`}>{dBadge.text}</span> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {m.sslExpiry ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sBadge.bg} ${sBadge.color}`}>{sBadge.text}</span> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleShowLog(m.clientId, m.clientName)} className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">Log</button>
                        <button onClick={() => handleRenewSSL(m.id)}
                          className={`rounded px-2 py-1 text-[10px] font-medium ${sslDays <= 30 ? "bg-admin-accent text-white" : "border border-admin-border text-admin-muted hover:text-admin-text"}`}>
                          SSL Yenile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yeni Bakım Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-admin-border bg-admin-bg2 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-admin-text">Yeni Bakım Müşterisi</h3>
              <button onClick={() => setShowModal(false)} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Müşteri *</label>
                  <select value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} className={inputCls}>
                    {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Website URL *</label>
                  <input required value={form.websiteUrl} onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))} placeholder="example.com" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Aylık Ücret (₺) *</label>
                  <input type="number" required value={form.monthlyFee} onChange={(e) => setForm((f) => ({ ...f, monthlyFee: e.target.value }))} placeholder="2000" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-admin-muted">Plan</label>
                  <select value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))} className={inputCls}>
                    {planOptions.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-[11px] font-medium text-admin-muted">Yenileme Tarihi</label><input type="date" value={form.renewalDate} onChange={(e) => setForm((f) => ({ ...f, renewalDate: e.target.value }))} className={inputCls} /></div>
                <div><label className="mb-1 block text-[11px] font-medium text-admin-muted">Domain Bitiş</label><input type="date" value={form.domainExpiry} onChange={(e) => setForm((f) => ({ ...f, domainExpiry: e.target.value }))} className={inputCls} /></div>
              </div>
              <div><label className="mb-1 block text-[11px] font-medium text-admin-muted">SSL Bitiş</label><input type="date" value={form.sslExpiry} onChange={(e) => setForm((f) => ({ ...f, sslExpiry: e.target.value }))} className={inputCls} /></div>
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

      {/* Log Modal */}
      {logModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setLogModal(null)}>
          <div className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-2xl border border-admin-border bg-admin-bg2 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-admin-text">{logModal.clientName} — Aktivite Logu</h3>
              <button onClick={() => setLogModal(null)} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
            </div>
            <div className="divide-y divide-admin-border">
              {logModal.activities.length === 0 && <div className="py-6 text-center text-[12px] text-admin-muted">Henüz aktivite yok</div>}
              {logModal.activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 py-2.5">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-admin-accent" />
                  <div>
                    <div className="text-[12px]">{a.description}</div>
                    <div className="text-[10px] text-admin-muted">{new Date(a.createdAt).toLocaleDateString("tr-TR")} · {new Date(a.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
