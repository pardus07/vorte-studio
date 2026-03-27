"use client";

import { useState } from "react";

type Lead = {
  id: string;
  name: string;
  company: string;
  source: string;
  status: string;
  budget: string;
  sector: string;
  updatedAt: string;
};

const columns = [
  { key: "COLD", label: "Soğuk Lead", icon: "🔵" },
  { key: "CONTACTED", label: "İletişim Kuruldu", icon: "📞" },
  { key: "QUOTED", label: "Teklif Gönderildi", icon: "📄" },
  { key: "WON", label: "Onaylandı", icon: "✅" },
  { key: "LOST", label: "Kapandı", icon: "❌" },
];

const sourceLabels: Record<string, { label: string; color: string }> = {
  MAPS_SCRAPER: { label: "Maps", color: "bg-admin-accent-dim text-admin-accent" },
  SITE_FORM: { label: "Form", color: "bg-admin-blue-dim text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple-dim text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green-dim text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber-dim text-admin-amber" },
};

const statusOptions = columns.map((c) => ({ value: c.key, label: c.label }));

export default function KanbanBoard({ leads: initial }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initial);

  function changeStatus(id: string, newStatus: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-admin-muted">
          {leads.length} lead
        </span>
        <button className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white">
          + Yeni Lead
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.key);
          return (
            <div
              key={col.key}
              className="flex w-64 shrink-0 flex-col rounded-xl border border-admin-border bg-admin-bg2"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 border-b border-admin-border px-3 py-2.5">
                <span className="text-sm">{col.icon}</span>
                <span className="text-[12px] font-medium">{col.label}</span>
                <span className="ml-auto rounded-full bg-admin-bg4 px-1.5 py-0.5 text-[10px] font-medium text-admin-muted">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 p-2" style={{ minHeight: 120 }}>
                {colLeads.map((lead) => {
                  const daysAgo = Math.floor(
                    (Date.now() - new Date(lead.updatedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  const needsFollowup = daysAgo >= 3 && col.key !== "WON" && col.key !== "LOST";
                  const src = sourceLabels[lead.source] || sourceLabels.MANUAL;

                  return (
                    <div
                      key={lead.id}
                      className="rounded-lg border bg-admin-bg3 p-3"
                      style={{
                        borderColor: needsFollowup
                          ? "var(--color-admin-amber)"
                          : "var(--color-admin-border)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-[12px] font-medium">
                          {lead.name}
                        </div>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${src.color}`}
                        >
                          {src.label}
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] text-admin-muted">
                        {lead.company}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-admin-accent">
                          {lead.budget}
                        </span>
                        {needsFollowup && (
                          <span className="text-[9px] text-admin-amber">
                            {daysAgo} gün
                          </span>
                        )}
                      </div>

                      {/* Status changer */}
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          changeStatus(lead.id, e.target.value)
                        }
                        className="mt-2 w-full rounded border border-admin-border bg-admin-bg4 px-2 py-1 text-[10px] text-admin-muted focus:border-admin-accent focus:outline-none"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center py-8 text-[11px] text-admin-muted2">
                    Boş
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
