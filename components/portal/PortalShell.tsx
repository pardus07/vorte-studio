"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Mesajlar",
    href: "/portal/mesajlar",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: "Dosyalar",
    href: "/portal/dosyalar",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: "Sözleşme & Ödeme",
    href: "/portal/sozlesme",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z" />
      </svg>
    ),
  },
];

interface PortalShellProps {
  user: { name: string; email: string; firmName: string };
  children: React.ReactNode;
}

export default function PortalShell({ user, children }: PortalShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-white/90">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-white/[0.07] bg-bg2 lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/[0.07] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-extrabold text-white">
            V
          </div>
          <span className="text-sm font-bold tracking-tight">
            VORTE<span className="text-accent">.</span>PORTAL
          </span>
        </div>

        {/* Kullanıcı bilgisi */}
        <div className="border-b border-white/[0.07] px-6 py-4">
          <p className="text-sm font-semibold truncate">{user.firmName}</p>
          <p className="mt-0.5 text-xs text-white/40 truncate">{user.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Çıkış */}
        <div className="border-t border-white/[0.07] p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/portal/giris" })}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/70"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile Header + Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-white/[0.07] bg-bg2 px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-extrabold text-white">
              V
            </div>
            <span className="text-xs font-bold">VORTE<span className="text-accent">.</span>PORTAL</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/[0.06]"
            aria-label="Menü"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-64 bg-bg2 p-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6 border-b border-white/[0.07] pb-4">
                <p className="text-sm font-semibold">{user.firmName}</p>
                <p className="mt-0.5 text-xs text-white/40">{user.email}</p>
              </div>
              <nav>
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                        active
                          ? "bg-accent/10 text-accent font-semibold"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 border-t border-white/[0.07] pt-4">
                <button
                  onClick={() => signOut({ callbackUrl: "/portal/giris" })}
                  className="flex items-center gap-2 text-sm text-white/40"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
