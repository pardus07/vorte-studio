"use client";

import { useState } from "react";
import { updateLeadStatus, convertLeadToClient } from "@/actions/leads";

type Lead = {
  id: string;
  name: string;
  company: string;
  source: string;
  status: string;
  budget: string;
  sector: string;
  phone: string | null;
  updatedAt: string;
};

const columns = [
  { key: "COLD", label: "Soğuk Lead", icon: "🔵" },
  { key: "CONTACTED", label: "İletişim Kuruldu", icon: "📞" },
  { key: "QUOTED", label: "Teklif Gönderildi", icon: "📄" },
  { key: "WON", label: "Onaylandı", icon: "✅" },
  { key: "LOST", label: "Kapandı", icon: "❌" },
];

const sourceLabels: Record<string, { label: string; color: string }> = {
  MAPS_SCRAPER: { label: "Maps", color: "bg-admin-accent-dim text-admin-accent" },
  SITE_FORM: { label: "Form", color: "bg-admin-blue-dim text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple-dim text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green-dim text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber-dim text-admin-amber" },
};

const statusOptions = columns.map((c) => ({ value: c.key, label: c.label }));

export default function KanbanBoard({ leads: initial }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [converting, setConverting] = useState<string | null>(null);

  function showNotification(msg: string, type: "success" | "error" | "info" = "info") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  async function changeStatus(id: string, newStatus: string) {
    const oldLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    try {
      await updateLeadStatus(id, newStatus as "COLD" | "CONTACTED" | "MEETING" | "QUOTED" | "WON" | "LOST");
    } catch {
      setLeads(oldLeads);
      showNotification("Durum güncellenemedi.", "error");
    }
  }

  async function handleConvertToCRM(lead: Lead) {
    setConverting(lead.id);
    const result = await convertLeadToClient(lead.id);
    setConverting(null);

    if (result.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: "WON" } : l))
      );
      showNotification(`${result.clientName} CRM'e eklendi!`, "success");
    } else {
      showNotification(result.error || "CRM'e taşınamadı.", "error");
    }
  }

  function openWhatsApp(phone: string | null) {
    if (!phone) return;
    const cleaned = phone.replace(/\D/g, "").slice(-10);
    window.open(`https://wa.me/90${cleaned}`, "_blank");
  }

  const notifColors = {
    info: "border-admin-blue bg-admin-blue-dim text-admin-blue",
    success: "border-admin-green bg-admin-green-dim text-admin-green",
    error: "border-admin-red bg-admin-red-dim text-admin-red",
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${notifColors[notification.type]}`}>
          {notification.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-admin-muted">{leads.length} lead</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.key);
          return (
            <div key={col.key} className="flex w-64 shrink-0 flex-col rounded-xl border border-admin-border bg-admin-bg2">
              <div className="flex items-center gap-2 border-b border-admin-border px-3 py-2.5">
                <span className="text-sm">{col.icon}</span>
                <span className="text-[12px] font-medium">{col.label}</span>
                <span className="ml-auto rounded-full bg-admin-bg4 px-1.5 py-0.5 text-[10px] font-medium text-admin-muted">
                  {colLeads.length}
                </span>
              </div>

              <div className="flex flex-col gap-2 p-2" style={{ minHeight: 120 }}>
                {colLeads.map((lead) => {
                  const daysAgo = Math.floor(
                    (Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const needsFollowup = daysAgo >= 3 && col.key !== "WON" && col.key !== "LOST";
                  const src = sourceLabels[lead.source] || sourceLabels.MANUAL;
                  const canConvert = col.key === "QUOTED" || col.key === "WON";

                  return (
                    <div
                      key={lead.id}
                      className="rounded-lg border bg-admin-bg3 p-3"
                      style={{ borderColor: needsFollowup ? "var(--color-admin-amber)" : "var(--color-admin-border)" }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-[12px] font-medium">{lead.name}</div>
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${src.color}`}>
                          {src.label}
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] text-admin-muted">{lead.company}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-admin-accent">{lead.budget}</span>
                        {needsFollowup && <span className="text-[9px] text-admin-amber">{daysAgo} gün</span>}
                      </div>

                      <select
                        value={lead.status}
                        onChange={(e) => changeStatus(lead.id, e.target.value)}
                        className="mt-2 w-full rounded border border-admin-border bg-admin-bg4 px-2 py-1 text-[10px] text-admin-muted focus:border-admin-accent focus:outline-none"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>

                      <div className="mt-2 flex gap-1.5">
                        {lead.phone && (
                          <button
                            onClick={() => openWhatsApp(lead.phone)}
                            className="rounded bg-admin-green px-2 py-1 text-[9px] font-medium text-white hover:brightness-110 transition-colors"
                          >
                            WA
                          </button>
                        )}
                        {canConvert && (
                          <button
                            onClick={() => handleConvertToCRM(lead)}
                            disabled={converting === lead.id}
                            className="rounded bg-admin-accent px-2 py-1 text-[9px] font-medium text-white hover:brightness-110 disabled:opacity-50 transition-colors"
                          >
                            {converting === lead.id ? "Taşınıyor..." : "CRM'e Taşı"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center py-8 text-[11px] text-admin-muted2">Boş</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
