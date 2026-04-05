"use client";

import { useState } from "react";
import Link from "next/link";

interface PortalUserItem {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  firmName: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  unreadMessages: number;
  proposalStatus: string;
  contractStatus: string | null;
  totalPrice: number;
  paidAmount: number;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0 }).format(n);
}

function timeAgo(iso: string | null) {
  if (!iso) return "Hiç giriş yapmadı";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function AdminPortalView({ users }: { users: PortalUserItem[] }) {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.firmName.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = users.reduce((s, u) => s + u.unreadMessages, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Müşteri Portalı</h1>
          <p className="mt-1 text-sm text-[var(--color-admin-muted)]">
            {users.length} müşteri · {totalUnread} okunmamış mesaj
          </p>
        </div>
        <input
          type="text"
          placeholder="Müşteri ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] px-4 py-2.5 text-sm text-white placeholder-[var(--color-admin-muted)] outline-none transition-colors focus:border-[var(--color-admin-accent)]/40 sm:w-64"
        />
      </div>

      {/* Kartlar */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] py-20">
          <p className="text-sm text-[var(--color-admin-muted)]">
            {users.length === 0 ? "Henüz portal kullanıcısı yok" : "Sonuç bulunamadı"}
          </p>
          <p className="mt-1 text-xs text-white/20">
            Sözleşme imzalandığında otomatik hesap oluşturulur
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((u) => {
            const progressPercent = u.totalPrice > 0 ? Math.round((u.paidAmount / u.totalPrice) * 100) : 0;

            return (
              <Link
                key={u.id}
                href={`/admin/portal/${u.id}`}
                className="group rounded-2xl border border-[var(--color-admin-border)] bg-[var(--color-admin-bg2)] p-5 transition-all duration-200 hover:border-[var(--color-admin-accent)]/30 hover:bg-[var(--color-admin-bg2)]/80"
              >
                {/* Üst satır */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold">{u.firmName}</h3>
                    <p className="mt-0.5 text-xs text-[var(--color-admin-muted)]">{u.name}</p>
                  </div>
                  {u.unreadMessages > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-admin-accent)] px-1.5 text-[10px] font-bold text-white animate-pulse">
                      {u.unreadMessages}
                    </span>
                  )}
                </div>

                {/* İletişim */}
                <div className="mt-3 space-y-1">
                  <p className="flex items-center gap-1.5 text-xs text-white/40">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="22" height="18" rx="2" /><path d="M1 5l11 7 11-7" />
                    </svg>
                    {u.email}
                  </p>
                  {u.phone && (
                    <p className="flex items-center gap-1.5 text-xs text-white/40">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.08 5.18 2 2 0 015.08 3h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L8.09 12a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0122 16.92z" />
                      </svg>
                      {u.phone}
                    </p>
                  )}
                </div>

                {/* Ödeme progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/30">Ödeme</span>
                    <span className="font-medium">
                      {formatPrice(u.paidAmount)} / {formatPrice(u.totalPrice)} ₺
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[var(--color-admin-accent)] transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Alt satır */}
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-admin-border)] pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-white/20"}`} />
                    <span className="text-[10px] text-white/30">
                      {timeAgo(u.lastLoginAt)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--color-admin-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                    Detaylar →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
