"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import SearchModal from "./SearchModal";
import NotificationDropdown from "./NotificationDropdown";

type Alert = {
  type: string;
  dot: string;
  title: string;
  meta: string;
  action: string;
  actionType: string;
  phone?: string;
};

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
  "/admin/chat-submissions": { title: "Chatbot Başvuruları", emoji: "💬" },
  "/admin/proposals": { title: "Teklifler", emoji: "📄" },
  "/admin/pricing": { title: "Fiyatlandırma", emoji: "💲" },
};

export default function Topbar({ alerts = [] }: { alerts?: Alert[] }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

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
    <>
      <header className="relative z-40 flex h-[56px] shrink-0 items-center border-b border-admin-border bg-admin-bg2/80 backdrop-blur-sm px-5">
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
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 items-center gap-2 rounded-xl border border-admin-border bg-admin-bg3/50 px-3 text-[12px] text-admin-muted transition-all hover:border-admin-border2 hover:bg-admin-bg3"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ara...</span>
            <kbd className="hidden rounded border border-admin-border bg-admin-bg4 px-1.5 py-0.5 text-[10px] font-medium text-admin-muted2 sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Yeni Lead — leads sayfasına ?new=1 ile git, modal otomatik açılır */}
          <Link
            href="/admin/leads?new=1"
            className="flex h-9 items-center gap-1.5 rounded-xl bg-admin-accent/10 px-3 text-[12px] font-medium text-admin-accent transition-all hover:bg-admin-accent/20"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Yeni Lead</span>
          </Link>

          {/* Notifications */}
          <NotificationDropdown alerts={alerts} />
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
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
