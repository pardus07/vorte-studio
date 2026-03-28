"use client";

import { useState } from "react";
import { createLeadAction } from "@/actions/leads";

const sourceOptions = [
  { value: "MANUAL", label: "Manuel" },
  { value: "MAPS_SCRAPER", label: "Maps Scraper" },
  { value: "SITE_FORM", label: "Site Formu" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "REFERRAL", label: "Referans" },
];

const sectorOptions = [
  "Sağlık", "Hukuk", "Turizm", "Gıda", "Spor",
  "Güzellik", "İnşaat", "Otomotiv", "Teknoloji",
  "Eğitim", "Finans", "Yeme-İçme", "Diğer",
];

export default function LeadFormModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "",
    sector: "", source: "MANUAL" as const, budget: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const result = await createLeadAction(form);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Bir hata oluştu.");
      setSaving(false);
    }
  }

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));
  const inputCls = "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none";
  const labelCls = "mb-1 block text-[11px] font-medium text-admin-muted";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-admin-border bg-admin-bg2 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-admin-text">Yeni Lead</h3>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>İşletme Adı *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="İşletme adı" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Firma / Şirket</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Firma adı" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Telefon</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0532 XXX XX XX" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>E-posta</label>
              <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@firma.com" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Sektör</label>
              <select value={form.sector} onChange={(e) => set("sector", e.target.value)} className={inputCls}>
                <option value="">Seçin</option>
                {sectorOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Kaynak</label>
              <select value={form.source} onChange={(e) => set("source", e.target.value)} className={inputCls}>
                {sourceOptions.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Tahmini Bütçe</label>
            <input value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="₺15-20K" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Notlar</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Ek bilgiler..." rows={2} className={inputCls} />
          </div>
          {error && <p className="text-[12px] text-admin-red">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3">İptal</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50">
              {saving ? "Kaydediliyor..." : "Lead Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
