"use client";

import { useState } from "react";
import { updateLeadNotes, convertLeadToClient } from "@/actions/leads";

type Lead = {
  id: string; name: string; company: string; source: string;
  status: string; budget: string; sector: string; phone: string | null;
  email: string | null; website: string | null; address: string | null;
  notes: string | null; googleMapsUrl: string | null; updatedAt: string;
};

const sourceLabels: Record<string, { label: string; color: string }> = {
  MAPS_SCRAPER: { label: "Maps Scraper", color: "bg-admin-accent-dim text-admin-accent" },
  SITE_FORM: { label: "Site Formu", color: "bg-admin-blue-dim text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple-dim text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green-dim text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber-dim text-admin-amber" },
};

const statusLabels: Record<string, string> = {
  COLD: "Soğuk Lead", CONTACTED: "İletişim Kuruldu", MEETING: "Görüşme",
  QUOTED: "Teklif Gönderildi", WON: "Onaylandı", LOST: "Kapandı",
};

export default function LeadDetailModal({
  lead, onClose, onStatusChange, onConvert,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onConvert: (lead: Lead) => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);
  const src = sourceLabels[lead.source] || sourceLabels.MANUAL;
  const canConvert = lead.status === "QUOTED" || lead.status === "WON";

  async function saveNotes() {
    setSaving(true);
    await updateLeadNotes(lead.id, notes);
    setSaving(false);
  }

  function openWhatsApp() {
    if (!lead.phone) return;
    const cleaned = lead.phone.replace(/\D/g, "").slice(-10);
    window.open(`https://wa.me/90${cleaned}`, "_blank");
  }

  function openMail() {
    if (!lead.email) return;
    window.open(`mailto:${lead.email}`, "_blank");
  }

  function openMaps() {
    if (lead.googleMapsUrl) {
      window.open(lead.googleMapsUrl, "_blank");
    } else if (lead.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + " " + lead.address)}`, "_blank");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-admin-border bg-admin-bg2 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-admin-text">{lead.name}</h3>
            {lead.company && lead.company !== lead.name && (
              <div className="mt-0.5 text-[12px] text-admin-muted">{lead.company}</div>
            )}
          </div>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${src.color}`}>{src.label}</span>
          {lead.sector && <span className="rounded-full bg-admin-bg4 px-2 py-0.5 text-[10px] text-admin-muted">{lead.sector}</span>}
          {lead.budget && <span className="rounded-full bg-admin-accent-dim px-2 py-0.5 text-[10px] font-medium text-admin-accent">{lead.budget}</span>}
        </div>

        <div className="mb-4 space-y-2 text-[12px]">
          {lead.phone && (
            <div className="flex items-center gap-2 text-admin-muted">
              <span>📞</span> <span>{lead.phone}</span>
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-2 text-admin-muted">
              <span>✉</span> <span>{lead.email}</span>
            </div>
          )}
          {lead.address && (
            <div className="flex items-center gap-2 text-admin-muted">
              <span>📍</span> <span>{lead.address}</span>
            </div>
          )}
        </div>

        {/* Aksiyonlar */}
        <div className="mb-4 flex flex-wrap gap-2">
          {lead.phone && (
            <button onClick={openWhatsApp} className="rounded-lg bg-admin-green px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110">WhatsApp</button>
          )}
          {lead.email && (
            <button onClick={openMail} className="rounded-lg bg-admin-blue px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110">Mail Gönder</button>
          )}
          {(lead.address || lead.googleMapsUrl) && (
            <button onClick={openMaps} className="rounded-lg border border-admin-border px-3 py-1.5 text-[11px] font-medium text-admin-muted hover:bg-admin-bg3">Haritada Gör</button>
          )}
          {canConvert && (
            <button onClick={() => { onConvert(lead); onClose(); }} className="rounded-lg bg-admin-accent px-3 py-1.5 text-[11px] font-medium text-white hover:brightness-110">CRM&apos;e Taşı</button>
          )}
        </div>

        {/* Durum */}
        <div className="mb-4">
          <label className="mb-1 block text-[11px] font-medium text-admin-muted">Durum</label>
          <select
            value={lead.status}
            onChange={(e) => { onStatusChange(lead.id, e.target.value); }}
            className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
          >
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Notlar */}
        <div>
          <label className="mb-1 block text-[11px] font-medium text-admin-muted">Notlar</label>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            rows={3} placeholder="Lead hakkında notlar..."
            className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button onClick={saveNotes} disabled={saving || notes === (lead.notes || "")}
              className="rounded-lg bg-admin-accent px-4 py-1.5 text-[11px] font-medium text-white hover:brightness-110 disabled:opacity-40">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>

        <div className="mt-3 text-[10px] text-admin-muted">
          Son güncelleme: {new Date(lead.updatedAt).toLocaleDateString("tr-TR")}
        </div>
      </div>
    </div>
  );
}
