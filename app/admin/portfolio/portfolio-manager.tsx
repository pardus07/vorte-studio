"use client";

import { useState } from "react";

type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  techStack: string[];
  liveUrl: string | null;
  featured: boolean;
  isPublished: boolean;
  thumbnail: string | null;
  order: number;
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

export default function PortfolioManager({
  initialItems,
}: {
  initialItems: PortfolioItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    slug: "",
    description: "",
    liveUrl: "",
    category: "",
    techStack: "",
    featured: false,
    isPublished: true,
  });

  function handleTitleChange(value: string) {
    setNewItem((p) => ({
      ...p,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
    }));
  }

  function handleAdd() {
    if (!newItem.title) return;
    const item: PortfolioItem = {
      id: `new-${Date.now()}`,
      title: newItem.title,
      slug: newItem.slug,
      description: newItem.description || null,
      category: newItem.category || null,
      techStack: newItem.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      liveUrl: newItem.liveUrl || null,
      featured: newItem.featured,
      isPublished: newItem.isPublished,
      thumbnail: null,
      order: items.length + 1,
    };
    setItems((prev) => [...prev, item]);
    setShowForm(false);
    setNewItem({
      title: "", slug: "", description: "", liveUrl: "",
      category: "", techStack: "", featured: false, isPublished: true,
    });
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function togglePublish(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, isPublished: !i.isPublished } : i
      )
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-admin-muted">
          {items.length} proje · {items.filter((i) => i.isPublished).length}{" "}
          yayında
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white"
        >
          + Yeni Proje Ekle
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-xl border border-admin-accent/30 bg-admin-bg2 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                Başlık
              </label>
              <input
                value={newItem.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="Proje başlığı"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                Slug (otomatik)
              </label>
              <input
                value={newItem.slug}
                readOnly
                className="w-full rounded-lg border border-admin-border bg-admin-bg4 px-3 py-2 text-[12px] text-admin-muted"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                Kategori
              </label>
              <input
                value={newItem.category}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="E-Ticaret, Mobil, Web Sitesi..."
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                Live URL
              </label>
              <input
                value={newItem.liveUrl}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, liveUrl: e.target.value }))
                }
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                Açıklama
              </label>
              <input
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="Kısa açıklama"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-admin-muted">
                Teknoloji Stack (virgülle ayır)
              </label>
              <input
                value={newItem.techStack}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, techStack: e.target.value }))
                }
                className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="Next.js, Tailwind, Prisma"
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={newItem.featured}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, featured: e.target.checked }))
                  }
                  className="accent-admin-accent"
                />
                Öne Çıkan
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  checked={newItem.isPublished}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      isPublished: e.target.checked,
                    }))
                  }
                  className="accent-admin-accent"
                />
                Yayınla
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white"
            >
              Kaydet
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-admin-border px-4 py-2 text-[12px] text-admin-muted"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const catColor =
            categoryColors[item.category || ""] || "bg-admin-bg4 text-admin-muted";
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2 transition-colors hover:border-admin-border2"
            >
              {/* Thumbnail */}
              <div
                className="flex h-32 items-center justify-center font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight"
                style={{
                  background: bgColors[i % bgColors.length],
                  color: "rgba(255,255,255,0.06)",
                }}
              >
                {item.title.split(" ")[0]?.toUpperCase()}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold">
                        {item.title}
                      </h3>
                      {item.featured && (
                        <span className="text-admin-amber" title="Öne Çıkan">
                          ★
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-0.5 text-[11px] text-admin-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      item.isPublished
                        ? "bg-admin-green-dim text-admin-green"
                        : "bg-admin-bg4 text-admin-muted"
                    }`}
                  >
                    {item.isPublished ? "Yayında" : "Taslak"}
                  </span>
                </div>

                {/* Category */}
                {item.category && (
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${catColor}`}
                  >
                    {item.category}
                  </span>
                )}

                {/* Tech tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-admin-border px-1.5 py-0.5 text-[9px] text-admin-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between border-t border-admin-border pt-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => togglePublish(item.id)}
                      className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text"
                    >
                      {item.isPublished ? "Gizle" : "Yayınla"}
                    </button>
                    <button className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">
                      Düzenle
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded px-2 py-1 text-[10px] text-admin-red hover:bg-admin-red-dim"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
