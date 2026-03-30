"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Genel",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
    ],
  },
  {
    label: "Müşteri & Satış",
    items: [
      {
        name: "Müşteri Bul",
        href: "/admin/prospect",
        icon: ProspectIcon,
        badge: "2",
        badgeColor: "amber" as const,
      },
      { name: "CRM", href: "/admin/crm", icon: CrmIcon },
      {
        name: "Lead Pipeline",
        href: "/admin/leads",
        icon: LeadIcon,
        badge: "3",
        badgeColor: "red" as const,
      },
      { name: "Teklif Üretici", href: "/admin/quotes", icon: QuoteIcon },
    ],
  },
  {
    label: "Projeler",
    items: [
      { name: "Projeler", href: "/admin/projects", icon: ProjectIcon },
      { name: "Finans", href: "/admin/finance", icon: FinanceIcon },
      {
        name: "Bakım Paketleri",
        href: "/admin/maintenance",
        icon: MaintenanceIcon,
      },
    ],
  },
  {
    label: "İçerik",
    items: [
      { name: "Portfolyo", href: "/admin/portfolio", icon: PortfolioIcon },
      { name: "Blog", href: "/admin/blog", icon: BlogIcon },
    ],
  },
  {
    label: "Yönetim",
    items: [
      { name: "Ayarlar", href: "/admin/settings", icon: SettingsIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-admin-border bg-admin-bg2">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-admin-border px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-accent text-sm font-bold text-white">
          V
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-admin-text">
          VORTE<span className="text-admin-accent">.</span>STUDIO
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="mb-1.5 px-2.5 text-[10px] font-medium uppercase tracking-[0.08em] text-admin-muted">
              {section.label}
            </div>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors",
                    active
                      ? "bg-admin-accent-dim font-medium text-admin-accent"
                      : "text-admin-muted hover:bg-admin-bg3 hover:text-admin-text"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active
                        ? "text-admin-accent"
                        : "text-admin-muted group-hover:text-admin-text"
                    )}
                  />
                  {item.name}
                  {"badge" in item && item.badge && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
                        item.badgeColor === "amber"
                          ? "bg-admin-amber-dim text-admin-amber"
                          : "bg-admin-red-dim text-admin-red"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User row */}
      <div className="border-t border-admin-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-bg4 text-xs font-medium text-admin-muted">
            IA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-admin-text">
              Ibrahim Abi
            </div>
            <div className="text-[11px] text-admin-muted">
              studio.vorte.com.tr
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Çıkış Yap"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-bg4 hover:text-admin-red"
          >
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ── SVG Icons (16x16, stroke-based, currentColor) ── */

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function ProspectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4v4l3 2" />
    </svg>
  );
}

function CrmIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M10 2H6C4.9 2 4 2.9 4 4v8c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      <path d="M6 6h4M6 9h4M6 12h2" />
    </svg>
  );
}

function LeadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 1L9.8 5.4L14.5 5.9L11 9.1L12 13.8L8 11.4L4 13.8L5 9.1L1.5 5.9L6.2 5.4L8 1z" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z" />
      <path d="M5 6h6M5 9h4" />
    </svg>
  );
}

function ProjectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M5 7h6M5 10h4" />
    </svg>
  );
}

function FinanceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 12V6l6-3.5L14 6v6l-6 3.5L2 12z" />
    </svg>
  );
}

function MaintenanceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14H6" />
      <path d="M10.5 11.5L14 8l-3.5-3.5" />
      <path d="M14 8H6" />
    </svg>
  );
}

function PortfolioIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="4" width="14" height="9" rx="1.5" />
      <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
    </svg>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 3h12M2 7h8M2 11h10M2 15h6" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="2" />
      <path d="M13.5 8a5.5 5.5 0 01-.4 2l1.2 1.2-1.4 1.4-1.2-1.2a5.5 5.5 0 01-2 .4v1.7h-2v-1.7a5.5 5.5 0 01-2-.4L4.5 12.6l-1.4-1.4 1.2-1.2a5.5 5.5 0 01-.4-2H2.2v-2h1.7a5.5 5.5 0 01.4-2L3.1 2.8l1.4-1.4 1.2 1.2a5.5 5.5 0 012-.4V.5h2v1.7a5.5 5.5 0 012 .4l1.2-1.2 1.4 1.4-1.2 1.2a5.5 5.5 0 01.4 2h1.7v2h-1.7z" />
    </svg>
  );
}
