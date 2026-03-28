"use client";

import { useState } from "react";
import { createProject, updateProject } from "@/actions/projects";

const typeOptions = [
  { value: "WEBSITE", label: "Web Sitesi" },
  { value: "ECOMMERCE", label: "E-Ticaret" },
  { value: "MOBILE_APP", label: "Mobil Uygulama" },
  { value: "REDESIGN", label: "Yeniden Tasarım" },
  { value: "CUSTOM", label: "Özel Proje" },
];

const statusOptions = [
  { value: "DISCOVERY", label: "Keşif" },
  { value: "DESIGN", label: "Tasarım" },
  { value: "DEVELOPMENT", label: "Geliştirme" },
  { value: "TESTING", label: "Test" },
  { value: "DELIVERED", label: "Teslim" },
  { value: "ARCHIVED", label: "Arşiv" },
];

type Client = { id: string; name: string };

type ProjectEditData = {
  id: string;
  title: string;
  clientId: string;
  type: string;
  status: string;
  budget: number;
  deadline: string;
  techStack: string;
  notes: string;
};

export default function ProjectFormModal({
  onClose, clients, editData,
}: {
  onClose: () => void;
  clients: Client[];
  editData?: ProjectEditData;
}) {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    title: editData?.title || "",
    clientId: editData?.clientId || clients[0]?.id || "",
    type: editData?.type || "WEBSITE",
    status: editData?.status || "DISCOVERY",
    budget: editData?.budget?.toString() || "",
    startDate: new Date().toISOString().split("T")[0],
    deadline: editData?.deadline || "",
    techStack: editData?.techStack || "",
    notes: editData?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      type: form.type as "WEBSITE" | "ECOMMERCE" | "MOBILE_APP" | "REDESIGN" | "CUSTOM",
      status: form.status as "DISCOVERY" | "DESIGN" | "DEVELOPMENT" | "TESTING" | "DELIVERED" | "ARCHIVED",
      budget: Number(form.budget) || 0,
    };

    const result = isEdit
      ? await updateProject(editData!.id, payload)
      : await createProject(payload);

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
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-admin-border bg-admin-bg2 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-admin-text">{isEdit ? "Proje Düzenle" : "Yeni Proje"}</h3>
          <button onClick={onClose} className="text-admin-muted hover:text-admin-text text-lg">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={labelCls}>Proje Başlığı *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Proje adı" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Müşteri *</label>
              <select value={form.clientId} onChange={(e) => set("clientId", e.target.value)} className={inputCls}>
                {clients.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Proje Türü</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls}>
                {typeOptions.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Durum</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                {statusOptions.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Bütçe (₺)</label>
              <input type="number" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="22000" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Başlangıç Tarihi</label>
              <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Teslim Tarihi</label>
              <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Teknoloji Stack</label>
            <input value={form.techStack} onChange={(e) => set("techStack", e.target.value)} placeholder="Next.js, Tailwind, Prisma" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Notlar</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Proje hakkında notlar..." rows={2} className={inputCls} />
          </div>
          {error && <p className="text-[12px] text-admin-red">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-admin-border px-4 py-2 text-[12px] font-medium text-admin-muted hover:bg-admin-bg3">İptal</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-admin-accent px-5 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50">
              {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
