"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";

const titles: Record<string, { title: string; emoji: string }> = {
  "/admin/dashboard": { title: "Dashboard", emoji: "📊" },
  "/admin/prospect": { title: "Müşteri Bul", emoji: "🔍" },
  "/admin/crm": { title: "CRM", emoji: "👥" },
  "/admin/leads": { title: "Lead Pipeline", emoji: "🎯" },
  "/admin/quotes": { title: "Teklif Üretici", emoji: "📋" },
  "/admin/projects": { title: "Projeler", emoji: "🚀" },
  "/admin/finance": { title: "Finans", emoji: "💰" },
  "/admin/maintenance": { title: "Bakım Paketleri", emoji: "🔧" },
  "/admin/portfolio": { title: "Portfolyo", emoji: "💼" },
  "/admin/blog": { title: "Blog", emoji: "📝" },
  "/admin/templates": { title: "Şablonlar", emoji: "🎨" },
  "/admin/settings": { title: "Ayarlar", emoji: "⚙️" },
};

export default function Topbar() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  // Find matching route (exact or prefix)
  const matchedKey = Object.keys(titles).find(
    (key) => pathname === key || (key !== "/admin/dashboard" && pathname.startsWith(key + "/"))
  );
  const page = matchedKey ? titles[matchedKey] : { title: "Admin", emoji: "⚡" };

  // Breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.slice(1).map((seg, i) => ({
    label: titles[`/admin/${seg}`]?.title ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 2).join("/"),
    isLast: i === segments.length - 2,
  }));

  return (
    <header className="flex h-[56px] shrink-0 items-center border-b border-admin-border bg-admin-bg2/80 backdrop-blur-sm px-5">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-base">{page.emoji}</span>
        <nav className="flex items-center gap-1 text-[13px]">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <ChevronIcon className="h-3 w-3 text-admin-muted2" />}
              {crumb.isLast ? (
                <span className="font-semibold text-admin-text">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-admin-muted hover:text-admin-text transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="flex-1" />

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search (visual) */}
        <button className="flex h-9 items-center gap-2 rounded-xl border border-admin-border bg-admin-bg3/50 px-3 text-[12px] text-admin-muted transition-all hover:border-admin-border2 hover:bg-admin-bg3">
          <SearchIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ara...</span>
          <kbd className="hidden rounded border border-admin-border bg-admin-bg4 px-1.5 py-0.5 text-[10px] font-medium text-admin-muted2 sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Quick actions */}
        <Link
          href="/admin/leads"
          className="flex h-9 items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 text-[12px] font-medium text-admin-accent transition-all hover:bg-admin-accent/20"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Yeni Lead</span>
        </Link>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border bg-admin-bg3/50 text-admin-muted transition-all hover:border-admin-border2 hover:text-admin-text">
          <BellIcon className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-admin-red px-1 text-[9px] font-bold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
}

/* ── Icons ── */

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 2.5l3 3.5-3 3.5" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5" />
      <path d="M14 14l-3.5-3.5" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a2 2 0 01-4 0" />
      <path d="M8 1a5 5 0 015 5c0 3.5 1 5 1 5H2s1-1.5 1-5a5 5 0 015-5z" />
    </svg>
  );
}
