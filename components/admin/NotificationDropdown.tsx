"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Alert = {
  type: string;
  dot: string;
  title: string;
  meta: string;
  action: string;
  actionType: string;
  phone?: string;
};

const dotColors: Record<string, string> = {
  red: "bg-admin-red",
  amber: "bg-admin-amber",
  green: "bg-admin-green",
  blue: "bg-admin-blue",
};

const actionRoutes: Record<string, string> = {
  payment: "/admin/finance",
  ssl: "/admin/maintenance",
  quote: "/admin/leads",
  maintenance: "/admin/quotes",
};

export default function NotificationDropdown({ alerts }: { alerts: Alert[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleAlertClick(alert: Alert) {
    const route = actionRoutes[alert.type];
    if (route) {
      router.push(route);
    }
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border bg-admin-bg3/50 text-admin-muted transition-all hover:border-admin-border2 hover:text-admin-text",
          open && "border-admin-border2 bg-admin-bg3 text-admin-text"
        )}
      >
        <BellIcon className="h-4 w-4" />
        {alerts.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-admin-red px-1 text-[9px] font-bold text-white">
            {alerts.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <span className="text-[13px] font-semibold text-admin-text">
              Bildirimler
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-red/15 px-2 text-[10px] font-bold text-admin-red">
              {alerts.length}
            </span>
          </div>

          {/* Alert list */}
          <div className="max-h-[320px] overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-admin-muted">
                Bildirim yok
              </div>
            ) : (
              alerts.map((alert, i) => (
                <button
                  key={i}
                  onClick={() => handleAlertClick(alert)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-admin-bg3/50"
                >
                  <div
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      dotColors[alert.dot]
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-admin-text leading-snug">
                      {alert.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-admin-muted">
                      {alert.meta}
                    </div>
                  </div>
                  <svg className="mt-1 h-3 w-3 shrink-0 text-admin-muted2" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4.5 2.5l3 3.5-3 3.5" />
                  </svg>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-admin-border px-4 py-2.5">
            <button
              onClick={() => {
                router.push("/admin/dashboard");
                setOpen(false);
              }}
              className="w-full text-center text-[11px] font-medium text-admin-accent transition-colors hover:text-admin-accent/80"
            >
              Tümünü gör
            </button>
          </div>
        </div>
      )}
    </div>
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
