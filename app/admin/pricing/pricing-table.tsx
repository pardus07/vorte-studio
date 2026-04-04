"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  updatePricingValue,
  togglePricingActive,
  createPricingConfig,
  deletePricingConfig,
} from "@/actions/pricing";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/pricing-constants";
import type { PricingItem } from "@/lib/pricing-constants";

// ── Birim etiketleri ──
const UNIT_LABELS: Record<string, string> = {
  saat: "saat",
  tl: "TL",
  carpan: "x",
  dolar: "$",
};

// ── Kategori ikonları ──
const CATEGORY_ICONS: Record<string, string> = {
  labor: "⚙️",
  base: "📦",
  feature: "🧩",
  content: "🎨",
  hosting: "☁️",
  urgency: "⚡",
  token: "🤖",
};

interface Props {
  initialData: PricingItem[];
  usdRate?: number;
}

export default function PricingTable({ initialData, usdRate = 38 }: Props) {
  const [items, setItems] = useState(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  // Yeni kayıt formu
  const [newItem, setNewItem] = useState({
    category: "feature",
    key: "",
    label: "",
    value: "",
    unit: "saat",
  });

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  // Toast
  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  // Grupla
  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const catItems = items.filter(
        (it) =>
          it.category === cat &&
          (filter === "" ||
            it.label.toLowerCase().includes(filter.toLowerCase()) ||
            it.key.toLowerCase().includes(filter.toLowerCase()))
      );
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    },
    {} as Record<string, PricingItem[]>
  );

  // Inline düzenleme başlat
  function startEdit(item: PricingItem) {
    setEditingId(item.id);
    setEditValue(String(item.value));
  }

  // Kaydet
  function saveEdit(id: string) {
    const numVal = parseFloat(editValue);
    if (isNaN(numVal) || numVal < 0) {
      showToast("Geçersiz değer", "err");
      return;
    }
    startTransition(async () => {
      const res = await updatePricingValue(id, numVal);
      if (res.success) {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, value: numVal } : it)));
        showToast("Güncellendi");
      } else {
        showToast(res.error || "Hata", "err");
      }
      setEditingId(null);
    });
  }

  // Toggle aktiflik
  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await togglePricingActive(id, !current);
      if (res.success) {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !current } : it)));
        showToast(!current ? "Aktifleştirildi" : "Devre dışı bırakıldı");
      }
    });
  }

  // Yeni ekle
  function handleAdd() {
    const { category, key, label, value, unit } = newItem;
    if (!key || !label || !value) {
      showToast("Tüm alanları doldurun", "err");
      return;
    }
    startTransition(async () => {
      const res = await createPricingConfig({
        category,
        key,
        label,
        value: parseFloat(value),
        unit,
        sortOrder: items.filter((it) => it.category === category).length,
      });
      if (res.success) {
        showToast("Eklendi");
        setShowAdd(false);
        setNewItem({ category: "feature", key: "", label: "", value: "", unit: "saat" });
        // Sayfayı yenile
        window.location.reload();
      } else {
        showToast(res.error || "Hata", "err");
      }
    });
  }

  // Sil
  function handleDelete(id: string, label: string) {
    if (!confirm(`"${label}" kaydını silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      const res = await deletePricingConfig(id);
      if (res.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        showToast("Silindi");
      } else {
        showToast(res.error || "Hata", "err");
      }
    });
  }

  // Değer formatla
  function formatValue(val: number, unit: string | null): string {
    if (unit === "tl") {
      const usd = (val / usdRate).toFixed(0);
      return `${val.toLocaleString("tr-TR")} TL (~$${usd})`;
    }
    if (unit === "saat") return `${val} saat`;
    if (unit === "carpan") return `${val}x`;
    if (unit === "dolar") {
      const tl = (val * usdRate).toFixed(0);
      return `$${val} (~${Number(tl).toLocaleString("tr-TR")} TL)`;
    }
    return String(val);
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Arama */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Ara... (ör: randevu, hosting)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-lg border border-admin-border bg-admin-bg2 py-2 pl-10 pr-4 text-sm text-admin-text placeholder-admin-muted outline-none transition-colors focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30"
          />
        </div>

        {/* Toplam */}
        <span className="text-xs text-admin-muted">
          {items.length} kayıt · {items.filter((i) => i.isActive).length} aktif
        </span>

        {/* Yeni ekle */}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-accent/90"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 5v14m-7-7h14" />
          </svg>
          Yeni Ekle
        </button>
      </div>

      {/* ── Yeni kayıt formu ── */}
      {showAdd && (
        <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4">
          <div className="mb-3 text-sm font-medium text-admin-text">Yeni Fiyat Parametresi</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
            >
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <input
              placeholder="key (ör: feature_yeni)"
              value={newItem.key}
              onChange={(e) => setNewItem((p) => ({ ...p, key: e.target.value }))}
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder-admin-muted"
            />
            <input
              placeholder="Etiket (ör: Yeni Özellik)"
              value={newItem.label}
              onChange={(e) => setNewItem((p) => ({ ...p, label: e.target.value }))}
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder-admin-muted"
            />
            <input
              type="number"
              placeholder="Değer"
              value={newItem.value}
              onChange={(e) => setNewItem((p) => ({ ...p, value: e.target.value }))}
              className="rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder-admin-muted"
            />
            <div className="flex gap-2">
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
                className="flex-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text"
              >
                {Object.entries(UNIT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={isPending}
                className="rounded-lg bg-admin-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-admin-accent/90 disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Kategori tabloları ── */}
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat} className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2">
          {/* Kategori başlığı */}
          <div className="flex items-center gap-2 border-b border-admin-border bg-admin-bg px-4 py-3">
            <span className="text-base">{CATEGORY_ICONS[cat] || "📋"}</span>
            <span className="text-sm font-semibold text-admin-text">
              {CATEGORY_LABELS[cat] || cat}
            </span>
            <span className="ml-auto rounded-full bg-admin-border px-2 py-0.5 text-[11px] text-admin-muted">
              {catItems.length} kayıt
            </span>
          </div>

          {/* Tablo */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] uppercase tracking-wider text-admin-muted">
                <th className="px-4 py-2.5 font-medium">Parametre</th>
                <th className="px-4 py-2.5 font-medium">Key</th>
                <th className="px-4 py-2.5 text-right font-medium">Değer</th>
                <th className="px-4 py-2.5 text-center font-medium">Birim</th>
                <th className="px-4 py-2.5 text-center font-medium">Aktif</th>
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {catItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-admin-border/50 transition-colors last:border-0 hover:bg-admin-bg/50 ${
                    !item.isActive ? "opacity-40" : ""
                  }`}
                >
                  {/* Label */}
                  <td className="px-4 py-3 text-sm text-admin-text">{item.label}</td>

                  {/* Key */}
                  <td className="px-4 py-3">
                    <code className="rounded bg-admin-bg px-1.5 py-0.5 text-[12px] text-admin-muted">
                      {item.key}
                    </code>
                  </td>

                  {/* Value — inline edit */}
                  <td className="px-4 py-3 text-right">
                    {editingId === item.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveEdit(item.id);
                        }}
                        className="flex items-center justify-end gap-1"
                      >
                        <input
                          ref={editRef}
                          type="number"
                          step="any"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 rounded-md border border-admin-accent bg-admin-bg px-2 py-1 text-right text-sm text-admin-text outline-none ring-1 ring-admin-accent/30"
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <button
                          type="submit"
                          disabled={isPending}
                          className="rounded-md bg-admin-accent/20 p-1 text-admin-accent hover:bg-admin-accent/30"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-md bg-red-500/10 p-1 text-red-400 hover:bg-red-500/20"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-admin-text transition-colors hover:bg-admin-accent/10"
                      >
                        {formatValue(item.value, item.unit)}
                        <svg
                          className="h-3 w-3 text-admin-muted opacity-0 transition-opacity group-hover:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </td>

                  {/* Unit */}
                  <td className="px-4 py-3 text-center text-xs text-admin-muted">
                    {item.unit ? UNIT_LABELS[item.unit] || item.unit : "—"}
                  </td>

                  {/* Toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(item.id, item.isActive)}
                      disabled={isPending}
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                        item.isActive ? "bg-admin-accent" : "bg-admin-border"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                          item.isActive ? "translate-x-[18px]" : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item.id, item.label)}
                      className="rounded-md p-1 text-admin-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 hover:opacity-100 [tr:hover_&]:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Boş durum */}
      {Object.keys(grouped).length === 0 && (
        <div className="rounded-xl border border-admin-border bg-admin-bg2 p-12 text-center">
          <p className="text-sm text-admin-muted">
            {filter ? `"${filter}" için sonuç bulunamadı.` : "Henüz fiyat parametresi eklenmemiş."}
          </p>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-2.5 text-sm font-medium shadow-xl transition-all ${
            toast.type === "ok"
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
