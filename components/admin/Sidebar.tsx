"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const sections = [
  {
    label: "Genel",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
      { name: "Raporlar", href: "/admin/reports", icon: ReportsIcon },
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
      { name: "Şablonlar", href: "/admin/templates", icon: TemplatesIcon },
    ],
  },
  {
    label: "Chatbot",
    items: [
      { name: "Başvurular", href: "/admin/chat-submissions", icon: ChatSubmissionIcon },
      { name: "Teklifler", href: "/admin/proposals", icon: ProposalIcon },
      { name: "Fiyatlandırma", href: "/admin/pricing", icon: PricingIcon },
    ],
  },
  {
    label: "Portal",
    items: [
      { name: "Müşteri Portalı", href: "/admin/portal", icon: PortalIcon },
      { name: "Logo & Marka", href: "/admin/logo", icon: LogoIcon },
    ],
  },
  {
    label: "İletişim",
    items: [
      { name: "Sesli Aramalar", href: "/admin/voice-calls", icon: PhoneIcon },
      { name: "WhatsApp", href: "/admin/whatsapp", icon: WhatsAppIcon },
    ],
  },
  {
    label: "Yönetim",
    items: [
      { name: "Ayarlar", href: "/admin/settings", icon: SettingsIcon },
    ],
  },
];

export default function Sidebar({ unreadSubmissions = 0 }: { unreadSubmissions?: number }) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  // Dinamik badge'ler — okunmamış başvuru sayısı
  const dynamicBadges: Record<string, { badge: string; badgeColor: "amber" | "red" }> = {};
  if (unreadSubmissions > 0) {
    dynamicBadges["/admin/chat-submissions"] = {
      badge: String(unreadSubmissions),
      badgeColor: unreadSubmissions >= 5 ? "red" : "amber",
    };
  }

  return (
    <aside
      className={cn(
        "group/sidebar relative flex shrink-0 flex-col border-r border-admin-border bg-admin-bg2 transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-admin-border px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-admin-accent to-orange-600 text-sm font-bold text-white shadow-lg shadow-admin-accent/20">
          V
        </div>
        <span
          className={cn(
            "whitespace-nowrap text-[14px] font-semibold tracking-tight text-admin-text transition-all duration-300",
            collapsed && "w-0 overflow-hidden opacity-0"
          )}
        >
          VORTE<span className="text-admin-accent">.</span>STUDIO
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-5">
            <div
              className={cn(
                "mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-muted2 transition-all duration-300",
                collapsed && "text-center text-[8px] tracking-[0.05em]"
              )}
            >
              {collapsed ? section.label.charAt(0) : section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all duration-200",
                      active
                        ? "bg-admin-accent/12 font-medium text-admin-accent shadow-sm shadow-admin-accent/5"
                        : "text-admin-muted hover:bg-admin-bg3 hover:text-admin-text",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-admin-accent shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                    )}
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                        active
                          ? "text-admin-accent"
                          : "text-admin-muted group-hover:text-admin-text"
                      )}
                    />
                    <span
                      className={cn(
                        "transition-all duration-300",
                        collapsed && "hidden"
                      )}
                    >
                      {item.name}
                    </span>
                    {(() => {
                      const dynBadge = dynamicBadges[item.href];
                      const badge = dynBadge?.badge || ("badge" in item ? item.badge : undefined);
                      const badgeColor = dynBadge?.badgeColor || ("badgeColor" in item ? item.badgeColor : undefined);
                      if (!badge || collapsed) return null;
                      return (
                        <span
                          className={cn(
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-none",
                            badgeColor === "amber"
                              ? "bg-admin-amber/15 text-admin-amber"
                              : "bg-admin-red/15 text-admin-red animate-pulse"
                          )}
                        >
                          {badge}
                        </span>
                      );
                    })()}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center border-t border-admin-border px-4 py-3 text-admin-muted transition-colors hover:bg-admin-bg3 hover:text-admin-text"
      >
        <CollapseIcon
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            collapsed && "rotate-180"
          )}
        />
        <span
          className={cn(
            "ml-2 text-[12px] font-medium transition-all duration-300",
            collapsed && "hidden"
          )}
        >
          Daralt
        </span>
      </button>

      {/* User row */}
      <div className="border-t border-admin-border px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-admin-bg4 to-admin-bg3 text-xs font-semibold text-admin-muted ring-2 ring-admin-border">
            IA
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-admin-bg2 bg-admin-green" />
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-admin-text">
                  İbrahim Abi
                </div>
                <div className="text-[11px] text-admin-muted">Yönetici</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Çıkış Yap"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-admin-muted transition-all hover:bg-admin-red/10 hover:text-admin-red"
              >
                <LogoutIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ── SVG Icons (18x18, stroke-based, currentColor) ── */

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="6.5" height="6.5" rx="2" />
      <rect x="10.5" y="1" width="6.5" height="6.5" rx="2" />
      <rect x="1" y="10.5" width="6.5" height="6.5" rx="2" />
      <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="2" />
    </svg>
  );
}

function ProspectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7.5" r="5.5" />
      <path d="M16 16l-3.5-3.5" />
    </svg>
  );
}

function CrmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6a6 6 0 01-12 0" />
      <circle cx="9" cy="6" r="3" />
      <path d="M3 17v-1a6 6 0 0112 0v1" />
    </svg>
  );
}

function LeadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1.5l2.3 4.7 5.2.75-3.75 3.65.9 5.15L9 13.5l-4.65 2.25.9-5.15L1.5 6.95l5.2-.75L9 1.5z" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z" />
      <path d="M6 6h6M6 9.5h4M6 13h2" />
    </svg>
  );
}

function ProjectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="14" height="12" rx="2" />
      <path d="M6 7h6M6 10.5h4" />
    </svg>
  );
}

function FinanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1v16M13 4H7a3 3 0 000 6h4a3 3 0 010 6H5" />
    </svg>
  );
}

function MaintenanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-2 2L13 8.6l1.7-2.3z" />
      <path d="M9.7 5.3l-7.4 7.4a1.4 1.4 0 000 2l.4.4a1.4 1.4 0 002 0l7.4-7.4" />
    </svg>
  );
}

function PortfolioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="4.5" width="15" height="10" rx="2" />
      <path d="M6 4.5V3.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3.5v1" />
    </svg>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h12M3 7h9M3 11h11M3 15h7" />
    </svg>
  );
}

function TemplatesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="6" height="8" rx="1.5" />
      <rect x="10.5" y="1.5" width="6" height="5" rx="1.5" />
      <rect x="10.5" y="9" width="6" height="7.5" rx="1.5" />
      <rect x="1.5" y="12" width="6" height="4.5" rx="1.5" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4" />
    </svg>
  );
}

function ChatSubmissionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h14a1 1 0 011 1v8a1 1 0 01-1 1h-4l-3 3-3-3H2a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <circle cx="6" cy="8" r="0.75" fill="currentColor" />
      <circle cx="9" cy="8" r="0.75" fill="currentColor" />
      <circle cx="12" cy="8" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ProposalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2H5a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7l-5-5z" />
      <path d="M10 2v5h5" />
      <path d="M7 10h4M7 13h2" />
    </svg>
  );
}

function PricingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 10.5L9 2l8 8.5" />
      <path d="M5 14h8M7 11h4" />
    </svg>
  );
}

function PortalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="6" r="3" />
      <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="14" height="14" rx="3" />
      <circle cx="7" cy="7" r="2" />
      <path d="M16 12l-4-4-6 8" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 12.5c0 .4-.1.8-.3 1.1-.2.4-.5.7-.8 1-.5.5-1.1.8-1.7.9-.7.1-1.4 0-2-.3l-2.2-.9c-.6-.3-1.2-.6-1.7-1a16 16 0 01-4.6-4.6c-.4-.5-.8-1.1-1-1.7L1.8 4.8c-.3-.7-.4-1.4-.3-2 .1-.7.4-1.3.9-1.8.3-.3.6-.6 1-.8.3-.2.7-.3 1.1-.3h.4c.3 0 .6.2.8.5l1.5 2.6c.1.2.1.5 0 .8l-.8 1.3c0 .1 0 .2.1.3.5 1 1.2 1.9 2 2.7.8.8 1.7 1.5 2.7 2 .1.1.2.1.3 0l1.3-.8c.2-.1.5-.2.8 0l2.6 1.5c.3.2.5.5.5.8v.4z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="currentColor">
      <path d="M13.104 10.787c-.223-.112-1.319-.65-1.523-.725-.204-.074-.353-.111-.502.112-.149.223-.575.725-.706.874-.13.149-.26.167-.483.056-.223-.112-.941-.347-1.793-1.106-.662-.591-1.11-1.321-1.24-1.544-.13-.223-.014-.344.098-.455.1-.1.223-.26.335-.39.111-.131.148-.224.223-.373.074-.149.037-.279-.019-.39-.056-.112-.502-1.21-.688-1.657-.181-.434-.365-.375-.502-.383-.13-.006-.279-.007-.428-.007-.149 0-.39.056-.594.279-.204.223-.78.763-.78 1.861 0 1.097.799 2.157.91 2.306.112.149 1.572 2.4 3.81 3.366.533.23.949.367 1.272.47.535.17 1.021.146 1.405.089.429-.064 1.319-.54 1.505-1.061.186-.521.186-.968.13-1.061-.056-.093-.205-.149-.428-.26M9.036 15.375h-.003a7.404 7.404 0 01-3.772-1.034l-.27-.161-2.808.737.749-2.738-.177-.281a7.39 7.39 0 01-1.133-3.945C1.623 4.087 5.17.544 9.04.544a7.362 7.362 0 015.241 2.174 7.37 7.37 0 012.17 5.246c-.002 4.088-3.549 7.411-7.415 7.411" />
    </svg>
  );
}

function ReportsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 12V4a1 1 0 00-1-1H3a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1z" />
      <path d="M2 16h14" />
      <path d="M6 9V7" />
      <path d="M9 9V5" />
      <path d="M12 9V8" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2H4a2 2 0 00-2 2v10a2 2 0 002 2h3" />
      <path d="M12 13l3.5-4L12 5" />
      <path d="M15.5 9H7" />
    </svg>
  );
}

function CollapseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 13l-4-4 4-4" />
    </svg>
  );
}
