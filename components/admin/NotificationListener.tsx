"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  initAudioContext,
  playSubmissionSound,
  playContractSound,
  playPaymentSound,
  playLeadSound,
} from "@/lib/notification-sounds";

type NotifCounts = {
  unreadSubmissions: number;
  signedContracts: number;
  paidPayments: number;
  recentLeads: number;
};

const STORAGE_KEY = "vorte_notif_counts";
const POLL_INTERVAL = 20_000; // 20 saniye

function loadCounts(): NotifCounts | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCounts(counts: NotifCounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {
    /* localStorage dolu olabilir */
  }
}

export default function NotificationListener() {
  const prevCounts = useRef<NotifCounts | null>(null);
  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; icon: string }>
  >([]);
  const toastId = useRef(0);
  const audioInitialized = useRef(false);
  const isFirstFetch = useRef(true);

  // Kullanıcı etkileşiminde AudioContext'i başlat (autoplay policy)
  useEffect(() => {
    function handleInteraction() {
      if (!audioInitialized.current) {
        initAudioContext();
        audioInitialized.current = true;
      }
    }
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // localStorage'dan ilk değerleri yükle
  useEffect(() => {
    const saved = loadCounts();
    if (saved) {
      prevCounts.current = saved;
      isFirstFetch.current = false;
    }
  }, []);

  const addToast = useCallback((message: string, icon: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, icon }]);
    // 5 saniye sonra kaldır
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const checkNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;

      const data: NotifCounts = await res.json();
      const prev = prevCounts.current;

      // İlk yüklemede ses çalma — sadece sayıları kaydet
      if (isFirstFetch.current || !prev) {
        prevCounts.current = data;
        saveCounts(data);
        isFirstFetch.current = false;
        return;
      }

      // Karşılaştır ve bildirim ver
      if (data.unreadSubmissions > prev.unreadSubmissions) {
        const diff = data.unreadSubmissions - prev.unreadSubmissions;
        playSubmissionSound();
        addToast(
          `${diff} yeni chatbot başvurusu geldi!`,
          "💬"
        );
      }

      if (data.signedContracts > prev.signedContracts) {
        const diff = data.signedContracts - prev.signedContracts;
        // Sözleşme sesi biraz gecikmeli çal (üst üste binmesin)
        setTimeout(() => playContractSound(), 600);
        addToast(
          `${diff} yeni sözleşme imzalandı!`,
          "📝"
        );
      }

      if (data.paidPayments > prev.paidPayments) {
        const diff = data.paidPayments - prev.paidPayments;
        setTimeout(() => playPaymentSound(), 1200);
        addToast(
          `${diff} yeni ödeme kaydedildi!`,
          "💰"
        );
      }

      if (data.recentLeads > prev.recentLeads) {
        const diff = data.recentLeads - prev.recentLeads;
        setTimeout(() => playLeadSound(), 1800);
        addToast(
          `${diff} yeni lead eklendi!`,
          "🎯"
        );
      }

      // Güncel sayıları kaydet
      prevCounts.current = data;
      saveCounts(data);
    } catch {
      // Ağ hatası — sessizce geç
    }
  }, [addToast]);

  // Polling
  useEffect(() => {
    // İlk kontrol — 2sn gecikme ile (sayfa yüklenmesini beklemesin)
    const initialTimeout = setTimeout(checkNotifications, 2000);

    const interval = setInterval(checkNotifications, POLL_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [checkNotifications]);

  // Sekme aktif olduğunda hemen kontrol et
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        checkNotifications();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [checkNotifications]);

  return (
    <>
      {/* Toast bildirimleri — sağ üst köşe */}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-[99999] flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="animate-in slide-in-from-right flex items-center gap-3 rounded-xl border border-admin-border bg-admin-bg2 px-4 py-3 shadow-2xl shadow-black/40"
              style={{
                animation: "slideInRight 0.3s ease-out",
              }}
            >
              <span className="text-xl">{toast.icon}</span>
              <span className="text-[13px] font-medium text-admin-text">
                {toast.message}
              </span>
              <button
                onClick={() =>
                  setToasts((prev) =>
                    prev.filter((t) => t.id !== toast.id)
                  )
                }
                className="ml-2 text-admin-muted transition-colors hover:text-admin-text"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CSS animasyonu */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
