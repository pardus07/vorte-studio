"use client";

import { useState } from "react";
import { createClient, updateClient } from "@/actions/crm";

const sectorOptions = [
  "Sağlık", "Hukuk", "Turizm", "Gıda", "Spor",
  "Güzellik", "İnşaat", "Otomotiv", "Teknoloji",
  "Eğitim", "Finans", "Yeme-İçme", "Diğer",
];

const statusOptions = [
  { value: "POTENTIAL", label: "Potansiyel" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "MAINTENANCE", label: "Bakım" },
  { value: "INACTIVE", label: "Eski" },
];

type ClientStatus = "POTENTIAL" | "ACTIVE" | "MAINTENANCE" | "INACTIVE";

type ClientData = {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  status: ClientStatus;
  notes: string;
};

const empty: ClientData = {
  name: "", company: "", email: "", phone: "",
  sector: "", status: "POTENTIAL", notes: "",
};

export default function ClientFormModal({
  onClose,
  editData,
}: {
  onClose: () => void;
  editData?: ClientData;
}) {
  const isEdit = !!editData?.id;
  const [form, setForm] = useState<ClientData>(editData || { ...empty });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const result = isEdit
      ? await updateClient(editData!.id!, form)
      : await createClient(form);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Bir hata oluştu.");
      setStatus("error");
    }
  }

  function set(key: keyof ClientData, val: string) {
    if (key === "status") {
      setForm((p) => ({ ...p, status: val as ClientStatus }));
    } else {
      setForm((p) => ({ ...p, [key]: val }));
    }
  }

  const inputCls = "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none";
  const labelCls = "mb-1 block text-[11px] font-medium text-admin-muted";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-admin-border bg-admin-bg2 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-admin-text">
            {isEdit ? "Müşteri Düzenle" : "Yeni Müşteri"}
          </h3>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Ad Soyad *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Müşteri adı" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Firma Adı</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)}
                placeholder="Firma" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>E-posta</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="email@firma.com" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                placeholder="0532 XXX XX XX" className={inputCls} />
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
              <label className={labelCls}>Durum</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                {statusOptions.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Notlar</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
              placeholder="Müşteriyle ilgili notlar..." rows={3} className={inputCls} />
          </div>

          {error && <p className="text-[12px] text-admin-red">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3">
              İptal
            </button>
            <button type="submit" disabled={status === "saving"}
              className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50">
              {status === "saving" ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
