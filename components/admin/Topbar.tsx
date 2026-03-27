"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/prospect": "Musteri Bul",
  "/admin/crm": "CRM",
  "/admin/leads": "Lead Pipeline",
  "/admin/quotes": "Teklif Uretici",
  "/admin/projects": "Projeler",
  "/admin/finance": "Finans",
  "/admin/maintenance": "Bakim Paketleri",
  "/admin/portfolio": "Portfolyo",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="flex h-[52px] shrink-0 items-center border-b border-admin-border bg-admin-bg2 px-6">
      <h1 className="text-sm font-semibold tracking-[-0.02em] text-admin-text">
        {title}
      </h1>
      <div className="flex-1" />
      {/* Sprint 3+ için action butonları buraya gelecek */}
    </header>
  );
}
