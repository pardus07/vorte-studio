"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClient } from "@/actions/crm";
import ClientFormModal from "../client-form-modal";

type Project = {
  id: string; title: string; type: string; status: string;
  budget: number; progress: number; deadline: string | null;
  milestones: { id: string; title: string; completed: boolean }[];
};

type Payment = {
  id: string; projectTitle: string; amount: number;
  type: string; status: string; dueDate: string; paidAt: string | null;
};

type Activity = {
  id: string; type: string; description: string; createdAt: string;
};

type ClientData = {
  id: string; name: string; company: string | null; email: string | null;
  phone: string | null; sector: string | null; status: string;
  notes: string | null; totalRevenue: number; createdAt: string;
  projects: Project[]; payments: Payment[]; activities: Activity[];
};

const statusBadge: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Aktif", color: "bg-admin-green-dim text-admin-green" },
  POTENTIAL: { label: "Potansiyel", color: "bg-admin-amber-dim text-admin-amber" },
  MAINTENANCE: { label: "Bakım", color: "bg-admin-blue-dim text-admin-blue" },
  INACTIVE: { label: "Eski", color: "bg-admin-red-dim text-admin-red" },
};

const projectStatusLabel: Record<string, string> = {
  DISCOVERY: "Keşif", DESIGN: "Tasarım", DEVELOPMENT: "Geliştirme",
  TESTING: "Test", DELIVERED: "Teslim", ARCHIVED: "Arşiv",
};

const paymentStatusBadge: Record<string, { label: string; color: string }> = {
  PAID: { label: "Ödendi", color: "bg-admin-green-dim text-admin-green" },
  PENDING: { label: "Bekliyor", color: "bg-admin-amber-dim text-admin-amber" },
  OVERDUE: { label: "Gecikmiş", color: "bg-admin-red-dim text-admin-red" },
  CANCELLED: { label: "İptal", color: "bg-admin-red-dim text-admin-red" },
};

const paymentTypeLabel: Record<string, string> = {
  DEPOSIT: "Peşinat", MILESTONE: "Aşama", FINAL: "Final", MAINTENANCE: "Bakım",
};

export default function ClientDetailView({ client }: { client: ClientData }) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [notes, setNotes] = useState(client.notes || "");
  const [saving, setSaving] = useState(false);

  const badge = statusBadge[client.status] || statusBadge.POTENTIAL;

  async function saveNotes() {
    setSaving(true);
    await updateClient(client.id, { notes });
    setSaving(false);
  }

  function openWhatsApp() {
    if (!client.phone) return;
    const cleaned = client.phone.replace(/\D/g, "").slice(-10);
    window.open(`https://wa.me/90${cleaned}`, "_blank");
  }

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/admin/crm")} className="text-[12px] text-admin-muted hover:text-admin-text">
          ← CRM
        </button>
      </div>

      {/* Müşteri Başlık Kartı */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] font-semibold text-admin-text">{client.name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${badge.color}`}>{badge.label}</span>
            </div>
            {client.company && <div className="mt-1 text-[13px] text-admin-muted">{client.company}</div>}
            {client.sector && (
              <span className="mt-2 inline-block rounded-full bg-admin-bg4 px-2.5 py-0.5 text-[10px] font-medium text-admin-muted">
                {client.sector}
              </span>
            )}
            <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-admin-muted">
              {client.phone && (
                <button onClick={openWhatsApp} className="flex items-center gap-1 hover:text-admin-green transition-colors">
                  📞 {client.phone}
                </button>
              )}
              {client.email && <span>✉ {client.email}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-admin-muted">Toplam Gelir</div>
              <div className="text-[20px] font-bold text-admin-green">₺{client.totalRevenue.toLocaleString("tr-TR")}</div>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3 hover:text-admin-text transition-colors"
            >
              Düzenle
            </button>
          </div>
        </div>
      </div>

      {/* İki sütun: Projeler + Ödemeler/Notlar */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Sol — Projeler */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <span className="text-[13px] font-medium">Projeler</span>
            <span className="text-[11px] text-admin-muted">{client.projects.length} proje</span>
          </div>
          <div className="divide-y divide-admin-border">
            {client.projects.length === 0 && (
              <div className="px-4 py-8 text-center text-[12px] text-admin-muted">Henüz proje yok</div>
            )}
            {client.projects.map((p) => {
              const progressColor = p.progress >= 80 ? "var(--color-admin-green)" : p.progress >= 50 ? "var(--color-admin-blue)" : "var(--color-admin-amber)";
              return (
                <div key={p.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[12.5px] font-medium">{p.title}</div>
                      <div className="text-[11px] text-admin-muted">
                        {projectStatusLabel[p.status] || p.status} · ₺{p.budget.toLocaleString("tr-TR")}
                        {p.deadline && ` · ${new Date(p.deadline).toLocaleDateString("tr-TR")}`}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: progressColor }}>%{p.progress}</span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-admin-bg4">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: progressColor }} />
                  </div>
                  {p.milestones.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.milestones.map((m) => (
                        <span key={m.id} className={`rounded px-1.5 py-0.5 text-[9px] ${m.completed ? "bg-admin-green-dim text-admin-green" : "bg-admin-bg4 text-admin-muted"}`}>
                          {m.completed ? "✓ " : ""}{m.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ — Ödemeler + Notlar */}
        <div className="space-y-5">
          {/* Ödemeler */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2">
            <div className="border-b border-admin-border px-4 py-3">
              <span className="text-[13px] font-medium">Son Ödemeler</span>
            </div>
            <div className="divide-y divide-admin-border">
              {client.payments.length === 0 && (
                <div className="px-4 py-6 text-center text-[12px] text-admin-muted">Ödeme kaydı yok</div>
              )}
              {client.payments.map((p) => {
                const pBadge = paymentStatusBadge[p.status] || paymentStatusBadge.PENDING;
                return (
                  <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <div className="text-[12px] font-medium">{p.projectTitle}</div>
                      <div className="text-[10px] text-admin-muted">
                        {paymentTypeLabel[p.type] || p.type} · {new Date(p.dueDate).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium">₺{p.amount.toLocaleString("tr-TR")}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${pBadge.color}`}>{pBadge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notlar */}
          <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4">
            <div className="mb-2 text-[13px] font-medium">Notlar</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
              placeholder="Müşteriyle ilgili notlar..."
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={saveNotes}
                disabled={saving || notes === (client.notes || "")}
                className="rounded-lg bg-admin-accent px-4 py-1.5 text-[11px] font-medium text-white hover:brightness-110 disabled:opacity-40 transition-colors"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aktivite Logu */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="border-b border-admin-border px-4 py-3">
          <span className="text-[13px] font-medium">Aktivite Geçmişi</span>
        </div>
        <div className="divide-y divide-admin-border">
          {client.activities.length === 0 && (
            <div className="px-4 py-6 text-center text-[12px] text-admin-muted">Henüz aktivite yok</div>
          )}
          {client.activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-2.5">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-admin-accent" />
              <div>
                <div className="text-[12px]">{a.description}</div>
                <div className="text-[10px] text-admin-muted">
                  {new Date(a.createdAt).toLocaleDateString("tr-TR")} · {new Date(a.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Düzenle Modal */}
      {showEdit && (
        <ClientFormModal
          onClose={() => { setShowEdit(false); router.refresh(); }}
          editData={{
            id: client.id,
            name: client.name,
            company: client.company || "",
            email: client.email || "",
            phone: client.phone || "",
            sector: client.sector || "",
            status: client.status as "POTENTIAL" | "ACTIVE" | "MAINTENANCE" | "INACTIVE",
            notes: client.notes || "",
          }}
        />
      )}
    </div>
  );
}
