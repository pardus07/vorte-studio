"use client";

import { useState } from "react";

type Client = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  sector: string | null;
  status: string;
  totalRevenue: number;
  updatedAt: string;
  maintenanceFee: number;
};

const filters = [
  { key: "ALL", label: "Tümü" },
  { key: "ACTIVE", label: "Aktif" },
  { key: "POTENTIAL", label: "Potansiyel" },
  { key: "MAINTENANCE", label: "Bakım" },
  { key: "INACTIVE", label: "Eski" },
];

const statusBadge: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Aktif", color: "bg-admin-green-dim text-admin-green" },
  POTENTIAL: { label: "Potansiyel", color: "bg-admin-amber-dim text-admin-amber" },
  MAINTENANCE: { label: "Bakım", color: "bg-admin-blue-dim text-admin-blue" },
  INACTIVE: { label: "Eski", color: "bg-admin-red-dim text-admin-red" },
};

export default function CrmClientList({ clients }: { clients: Client[] }) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? clients
      : clients.filter((c) => c.status === filter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                filter === f.key
                  ? "bg-admin-accent-dim text-admin-accent"
                  : "text-admin-muted hover:bg-admin-bg3 hover:text-admin-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white">
          + Yeni Müşteri
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">Müşteri</th>
                <th className="px-4 py-2.5">Sektör</th>
                <th className="px-4 py-2.5">Durum</th>
                <th className="px-4 py-2.5">Toplam Gelir</th>
                <th className="px-4 py-2.5">Son İletişim</th>
                <th className="px-4 py-2.5">Bakım</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {filtered.map((client) => {
                const badge = statusBadge[client.status] || statusBadge.POTENTIAL;
                const lastContact = new Date(client.updatedAt);
                const daysAgo = Math.floor(
                  (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={client.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-3">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-[11px] text-admin-muted">
                        {client.company || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-admin-muted">
                      {client.sector || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₺{client.totalRevenue.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-admin-muted">
                      {daysAgo === 0
                        ? "Bugün"
                        : daysAgo === 1
                          ? "Dün"
                          : `${daysAgo} gün önce`}
                    </td>
                    <td className="px-4 py-3">
                      {client.maintenanceFee > 0 ? (
                        <span className="text-admin-accent">
                          ₺{client.maintenanceFee.toLocaleString("tr-TR")}/ay
                        </span>
                      ) : (
                        <span className="text-admin-muted2">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">
                          Detay
                        </button>
                        <button className="rounded bg-admin-green px-2 py-1 text-[10px] font-medium text-white">
                          WA
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
