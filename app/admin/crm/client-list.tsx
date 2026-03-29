"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateClientStatus } from "@/actions/crm";
import { isGSM, formatWANumber } from "@/lib/phone-utils";
import ClientFormModal from "./client-form-modal";

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

const filterButtons = [
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

const statusList = [
  { value: "POTENTIAL", label: "Potansiyel" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "MAINTENANCE", label: "Bakım" },
  { value: "INACTIVE", label: "Eski" },
];

function StatusDropdown({ clientId, currentStatus, onStatusChange }: {
  clientId: string;
  currentStatus: string;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const badge = statusBadge[currentStatus] || statusBadge.POTENTIAL;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium cursor-pointer hover:brightness-110 ${badge.color}`}
      >
        {badge.label} ▾
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-32 rounded-lg border border-admin-border bg-admin-bg2 py-1 shadow-xl">
          {statusList.map((s) => (
            <button
              key={s.value}
              onClick={() => { onStatusChange(clientId, s.value); setOpen(false); }}
              className={`block w-full px-3 py-1.5 text-left text-[11px] hover:bg-admin-bg3 ${
                s.value === currentStatus ? "text-admin-accent font-medium" : "text-admin-text"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CrmClientList({ clients: initialClients }: { clients: Client[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState(initialClients);

  async function handleStatusChange(id: string, newStatus: string) {
    // Optimistic update
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    const result = await updateClientStatus(id, newStatus);
    if (!result.success) {
      // Rollback
      setClients(initialClients);
    }
  }

  function openWhatsApp(phone: string | null) {
    if (!phone || !isGSM(phone)) return;
    window.open(`https://wa.me/${formatWANumber(phone)}`, "_blank");
  }

  const filtered = clients.filter((c) => {
    if (filter !== "ALL" && c.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (c.name || "").toLowerCase();
      const company = (c.company || "").toLowerCase();
      return name.includes(q) || company.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {filterButtons.map((f) => (
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
        <div className="flex-1" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Müşteri veya firma ara..."
          className="rounded-lg border border-admin-border bg-admin-bg3 px-3 py-1.5 text-[12px] text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:outline-none"
          style={{ minWidth: 180 }}
        />
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 transition-colors"
        >
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[12px] text-admin-muted">
                    {search ? "Arama sonucu bulunamadı." : "Henüz müşteri yok."}
                  </td>
                </tr>
              )}
              {filtered.map((client) => {
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
                      <StatusDropdown
                        clientId={client.id}
                        currentStatus={client.status}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₺{client.totalRevenue.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-admin-muted">
                      {daysAgo === 0 ? "Bugün" : daysAgo === 1 ? "Dün" : `${daysAgo} gün önce`}
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
                        <button
                          onClick={() => router.push(`/admin/crm/${client.id}`)}
                          className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text hover:bg-admin-bg3 transition-colors"
                        >
                          Detay
                        </button>
                        {isGSM(client.phone) && (
                          <button
                            onClick={() => openWhatsApp(client.phone)}
                            className="rounded bg-admin-green px-2 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors"
                          >
                            WA
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && <ClientFormModal onClose={() => { setShowModal(false); router.refresh(); }} />}
    </div>
  );
}
