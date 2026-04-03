"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SearchItem = {
  label: string;
  href: string;
  category: string;
  icon: string;
};

const searchItems: SearchItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", category: "Sayfa", icon: "📊" },
  { label: "Müşteri Bul", href: "/admin/prospect", category: "Sayfa", icon: "🔍" },
  { label: "CRM", href: "/admin/crm", category: "Sayfa", icon: "👥" },
  { label: "Lead Pipeline", href: "/admin/leads", category: "Sayfa", icon: "🎯" },
  { label: "Teklif Üretici", href: "/admin/quotes", category: "Sayfa", icon: "📋" },
  { label: "Projeler", href: "/admin/projects", category: "Sayfa", icon: "🚀" },
  { label: "Finans", href: "/admin/finance", category: "Sayfa", icon: "💰" },
  { label: "Bakım Paketleri", href: "/admin/maintenance", category: "Sayfa", icon: "🔧" },
  { label: "Portfolyo", href: "/admin/portfolio", category: "Sayfa", icon: "💼" },
  { label: "Blog", href: "/admin/blog", category: "Sayfa", icon: "📝" },
  { label: "Şablonlar", href: "/admin/templates", category: "Sayfa", icon: "🎨" },
  { label: "Ayarlar", href: "/admin/settings", category: "Sayfa", icon: "⚙️" },
  { label: "Yeni Lead Ekle", href: "/admin/leads?new=1", category: "Eylem", icon: "➕" },
  { label: "Yeni Blog Yazısı", href: "/admin/blog/new", category: "Eylem", icon: "✏️" },
  { label: "Yeni Teklif Oluştur", href: "/admin/quotes", category: "Eylem", icon: "📄" },
];

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
      setQuery("");
    },
    [router, onClose]
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // ⌘K / Ctrl+K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        }
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % filtered.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + filtered.length) % filtered.length);
        return;
      }

      if (e.key === "Enter" && filtered[activeIdx]) {
        e.preventDefault();
        navigate(filtered[activeIdx].href);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, filtered, activeIdx, navigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl shadow-black/40">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-admin-border px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-admin-muted" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="5" />
            <path d="M14 14l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sayfa veya eylem ara..."
            className="flex-1 bg-transparent text-[14px] text-admin-text placeholder:text-admin-muted2 outline-none"
          />
          <kbd className="rounded border border-admin-border bg-admin-bg4 px-1.5 py-0.5 text-[10px] font-medium text-admin-muted2">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-admin-muted">
              Sonuç bulunamadı
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.href + item.label}
                onClick={() => navigate(item.href)}
                onMouseEnter={() => setActiveIdx(i)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  i === activeIdx
                    ? "bg-admin-accent/10 text-admin-accent"
                    : "text-admin-text hover:bg-admin-bg3"
                )}
              >
                <span className="text-base">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{item.label}</div>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-admin-muted2">
                  {item.category}
                </span>
                {i === activeIdx && (
                  <svg className="h-3 w-3 text-admin-accent" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 6h8M7 3l3 3-3 3" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-admin-border px-4 py-2.5 text-[10px] text-admin-muted2">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-admin-border bg-admin-bg4 px-1 py-0.5 font-medium">↑↓</kbd>
            Gezin
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-admin-border bg-admin-bg4 px-1 py-0.5 font-medium">↵</kbd>
            Aç
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-admin-border bg-admin-bg4 px-1 py-0.5 font-medium">ESC</kbd>
            Kapat
          </span>
        </div>
      </div>
    </div>
  );
}
