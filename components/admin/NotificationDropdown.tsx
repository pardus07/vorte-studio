"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

const STORAGE_KEY_READ = "vorte_notif_read";
const STORAGE_KEY_DISMISSED = "vorte_notif_dismissed";

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* localStorage dolu olabilir */
  }
}

export default function NotificationDropdown({ alerts }: { alerts: Alert[] }) {
  const [open, setOpen] = useState(false);
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const [dismissedSet, setDismissedSet] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // localStorage'dan oku — client mount sonrası
  useEffect(() => {
    setReadSet(loadSet(STORAGE_KEY_READ));
    setDismissedSet(loadSet(STORAGE_KEY_DISMISSED));
  }, []);

  // Görünen bildirimler (silinmemiş olanlar)
  const visibleAlerts = alerts.filter((_, i) => !dismissedSet.has(String(i)));
  const unreadCount = visibleAlerts.filter(
    (_, i) => !readSet.has(String(alerts.indexOf(visibleAlerts[i] ?? alerts[0])))
  ).length;

  // Her alert için benzersiz key — index tabanlı (seed data statik)
  const alertKey = (alert: Alert) =>
    String(alerts.indexOf(alert));

  const unreadAlertCount = visibleAlerts.filter(
    (a) => !readSet.has(alertKey(a))
  ).length;

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

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const markAsRead = useCallback(
    (alert: Alert) => {
      const key = alertKey(alert);
      setReadSet((prev) => {
        const next = new Set(prev);
        next.add(key);
        saveSet(STORAGE_KEY_READ, next);
        return next;
      });
    },
    [alerts]
  );

  const dismissAlert = useCallback(
    (alert: Alert) => {
      const key = alertKey(alert);
      setDismissedSet((prev) => {
        const next = new Set(prev);
        next.add(key);
        saveSet(STORAGE_KEY_DISMISSED, next);
        return next;
      });
    },
    [alerts]
  );

  const markAllRead = useCallback(() => {
    const next = new Set(readSet);
    visibleAlerts.forEach((a) => next.add(alertKey(a)));
    saveSet(STORAGE_KEY_READ, next);
    setReadSet(next);
  }, [alerts, readSet, visibleAlerts]);

  function handleAlertClick(alert: Alert) {
    markAsRead(alert);
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
        {unreadAlertCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-admin-red px-1 text-[9px] font-bold text-white">
            {unreadAlertCount}
          </span>
        )}
      </button>

      {/* Dropdown — z-[9999] ile en üste çık */}
      {open && (
        <div className="absolute right-0 top-full z-[9999] mt-2 w-80 overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <span className="text-[13px] font-semibold text-admin-text">
              Bildirimler
            </span>
            <div className="flex items-center gap-2">
              {unreadAlertCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-medium text-admin-accent transition-colors hover:text-admin-accent/70"
                >
                  Tümünü oku
                </button>
              )}
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-red/15 px-2 text-[10px] font-bold text-admin-red">
                {visibleAlerts.length}
              </span>
            </div>
          </div>

          {/* Alert list */}
          <div className="max-h-[360px] overflow-y-auto">
            {visibleAlerts.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-admin-bg3">
                  <BellIcon className="h-5 w-5 text-admin-muted2" />
                </div>
                <p className="text-[13px] text-admin-muted">Bildirim yok</p>
                <p className="mt-0.5 text-[11px] text-admin-muted2">
                  Tüm bildirimler temizlendi
                </p>
              </div>
            ) : (
              visibleAlerts.map((alert) => {
                const key = alertKey(alert);
                const isRead = readSet.has(key);

                return (
                  <div
                    key={key}
                    className={cn(
                      "group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-admin-bg3/50",
                      isRead && "opacity-60"
                    )}
                  >
                    {/* Unread indicator */}
                    {!isRead && (
                      <div className="absolute left-1.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-admin-accent" />
                    )}

                    {/* Dot */}
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        dotColors[alert.dot]
                      )}
                    />

                    {/* Content — tıklanabilir */}
                    <button
                      onClick={() => handleAlertClick(alert)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="text-[12px] font-medium leading-snug text-admin-text">
                        {alert.title}
                      </div>
                      <div className="mt-0.5 text-[11px] text-admin-muted">
                        {alert.meta}
                      </div>
                    </button>

                    {/* Action buttons — hover'da görünür */}
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Okundu butonu */}
                      {!isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(alert);
                          }}
                          title="Okundu olarak işaretle"
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-accent/10 hover:text-admin-accent"
                        >
                          <CheckIcon className="h-3 w-3" />
                        </button>
                      )}

                      {/* Sil butonu */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissAlert(alert);
                        }}
                        title="Bildirimi sil"
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-red/10 hover:text-admin-red"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {visibleAlerts.length > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
}

/* ── Icons ── */

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a2 2 0 01-4 0" />
      <path d="M8 1a5 5 0 015 5c0 3.5 1 5 1 5H2s1-1.5 1-5a5 5 0 015-5z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 3h9M4 3V1.5h4V3M3 3l.5 7.5h5L9 3" />
    </svg>
  );
}
