"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortfolioItem, updatePortfolioItem, togglePublishPortfolio, deletePortfolioItem } from "@/actions/portfolio";

type PortfolioItem = {
  id: string; title: string; slug: string; description: string | null;
  category: string | null; techStack: string[]; liveUrl: string | null;
  featured: boolean; isPublished: boolean; thumbnail: string | null; order: number;
};

const categoryColors: Record<string, string> = {
  "E-Ticaret": "bg-admin-green-dim text-admin-green",
  "Fintech": "bg-admin-amber-dim text-admin-amber",
  "Mobil": "bg-admin-blue-dim text-admin-blue",
  "Web Sitesi": "bg-admin-accent-dim text-admin-accent",
};

const bgColors = [
  "linear-gradient(135deg, #1a1020, #251530)",
  "linear-gradient(135deg, #101a20, #152530)",
  "linear-gradient(135deg, #201a10, #302515)",
  "linear-gradient(135deg, #10201a, #153025)",
];

const emptyForm = { title: "", slug: "", description: "", liveUrl: "", category: "", techStack: "", featured: false, isPublished: true, thumbnail: "" };

export default function PortfolioManager({ initialItems }: { initialItems: PortfolioItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function showNotif(msg: string, type: "success" | "error") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  function handleTitleChange(value: string) {
    setForm((p) => ({
      ...p, title: value,
      slug: value.toLowerCase().replace(/[^a-z0-9ğüşöçı\s-]/g, "").replace(/\s+/g, "-"),
    }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotif("Maksimum dosya boyutu 5MB.", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setForm((p) => ({ ...p, thumbnail: data.url }));
        showNotif("Resim yüklendi.", "success");
      } else {
        showNotif(data.error || "Yükleme başarısız.", "error");
      }
    } catch {
      showNotif("Yükleme hatası.", "error");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description || undefined,
      category: form.category || undefined,
      techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      liveUrl: form.liveUrl || undefined,
      thumbnail: form.thumbnail || undefined,
      featured: form.featured,
      isPublished: form.isPublished,
    };

    const result = editId
      ? await updatePortfolioItem(editId, payload)
      : await createPortfolioItem(payload);

    if (result.success) {
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      router.refresh();
      showNotif(editId ? "Proje güncellendi." : "Proje oluşturuldu.", "success");
    } else {
      showNotif(result.error || "Hata.", "error");
    }
    setSaving(false);
  }

  async function handleTogglePublish(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, isPublished: !i.isPublished } : i));
    await togglePublishPortfolio(id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deletePortfolioItem(id);
    showNotif("Proje silindi.", "success");
  }

  function openEdit(item: PortfolioItem) {
    setEditId(item.id);
    setForm({
      title: item.title, slug: item.slug,
      description: item.description || "", liveUrl: item.liveUrl || "",
      category: item.category || "", techStack: item.techStack.join(", "),
      featured: item.featured, isPublished: item.isPublished,
      thumbnail: item.thumbnail || "",
    });
    setShowForm(true);
  }

  const inputCls = "w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none";

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`rounded-lg border px-4 py-2.5 text-[12px] font-medium ${notification.type === "success" ? "border-admin-green bg-admin-green-dim text-admin-green" : "border-admin-red bg-admin-red-dim text-admin-red"}`}>{notification.msg}</div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-admin-muted">{items.length} proje · {items.filter((i) => i.isPublished).length} yayında</span>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowForm(!showForm); }}
          className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110">+ Yeni Proje Ekle</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-admin-accent/30 bg-admin-bg2 p-4">
          <div className="mb-3 text-[13px] font-medium">{editId ? "Proje Düzenle" : "Yeni Proje"}</div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Başlık *</label>
              <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Proje başlığı" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Slug</label>
              <input value={form.slug} readOnly className="w-full rounded-lg border border-admin-border bg-admin-bg4 px-3 py-2 text-[12px] text-admin-muted" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Kategori</label>
              <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="E-Ticaret, Mobil..." className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Live URL</label>
              <input value={form.liveUrl} onChange={(e) => setForm((p) => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..." className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Açıklama</label>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Kısa açıklama" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Tech Stack (virgülle ayır)</label>
              <input value={form.techStack} onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))} placeholder="Next.js, Tailwind, Prisma" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">Thumbnail</label>
              <div className="flex gap-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="rounded-lg border border-admin-border px-3 py-2 text-[12px] text-admin-muted hover:bg-admin-bg3 disabled:opacity-50">
                  {uploading ? "Yükleniyor..." : "📷 Resim Seç"}
                </button>
                {form.thumbnail && (
                  <div className="flex items-center gap-2">
                    <img src={form.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="text-[10px] text-admin-green">✓ Yüklendi</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[12px]">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="accent-admin-accent" />
                Öne Çıkan
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[12px]">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} className="accent-admin-accent" />
                Yayınla
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 disabled:opacity-50">
              {saving ? "Kaydediliyor..." : editId ? "Güncelle" : "Kaydet"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="rounded-lg border border-admin-border px-4 py-2 text-[12px] text-admin-muted">İptal</button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const catColor = categoryColors[item.category || ""] || "bg-admin-bg4 text-admin-muted";
          return (
            <div key={item.id} className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2 transition-colors hover:border-admin-border2">
              {/* Thumbnail */}
              {item.thumbnail ? (
                <div className="h-32 overflow-hidden">
                  <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight"
                  style={{ background: bgColors[i % bgColors.length], color: "rgba(255,255,255,0.06)" }}>
                  {item.title.split(" ")[0]?.toUpperCase()}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold">{item.title}</h3>
                      {item.featured && <span className="text-admin-amber" title="Öne Çıkan">★</span>}
                    </div>
                    {item.description && <p className="mt-0.5 text-[11px] text-admin-muted">{item.description}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.isPublished ? "bg-admin-green-dim text-admin-green" : "bg-admin-bg4 text-admin-muted"}`}>
                    {item.isPublished ? "Yayında" : "Taslak"}
                  </span>
                </div>

                {item.category && <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${catColor}`}>{item.category}</span>}

                <div className="mt-3 flex flex-wrap gap-1">
                  {item.techStack.map((tech) => (
                    <span key={tech} className="rounded border border-admin-border px-1.5 py-0.5 text-[9px] text-admin-muted">{tech}</span>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-admin-border pt-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleTogglePublish(item.id)} className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">
                      {item.isPublished ? "Gizle" : "Yayınla"}
                    </button>
                    <button onClick={() => openEdit(item)} className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">Düzenle</button>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="rounded px-2 py-1 text-[10px] text-admin-red hover:bg-admin-red-dim">Sil</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
