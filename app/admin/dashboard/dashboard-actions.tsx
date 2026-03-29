"use client";

import { useRouter } from "next/navigation";
import { isGSM, formatWANumber } from "@/lib/phone-utils";

type AlertItem = {
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
  ssl: "/admin/maintenance",
  quote: "/admin/leads",
  maintenance: "/admin/quotes",
};

function openWhatsApp(phone?: string) {
  if (!phone || !isGSM(phone)) return;
  window.open(`https://wa.me/${formatWANumber(phone)}`, "_blank");
}

export function AlertList({ alerts }: { alerts: AlertItem[] }) {
  const router = useRouter();

  function handleAction(alert: AlertItem) {
    if (alert.action === "WA") {
      openWhatsApp(alert.phone);
      return;
    }
    const route = actionRoutes[alert.type];
    if (route) {
      router.push(route);
    }
  }

  return (
    <div className="divide-y divide-admin-border">
      {alerts.map((alert, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <div
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColors[alert.dot]}`}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-medium">{alert.title}</div>
            <div className="text-[11px] text-admin-muted">{alert.meta}</div>
          </div>
          <button
            onClick={() => handleAction(alert)}
            className={`shrink-0 rounded px-2.5 py-1 text-[10px] font-medium transition-colors ${
              alert.actionType === "primary"
                ? "bg-admin-accent text-white hover:brightness-110"
                : "border border-admin-border text-admin-muted hover:text-admin-text hover:bg-admin-bg3"
            }`}
          >
            {alert.action}
          </button>
        </div>
      ))}
    </div>
  );
}

type LeadRow = {
  id: string;
  name: string;
  source: string;
  status: string;
  address?: string;
  sector?: string | null;
  budget?: string | null;
  type?: string;
  phone?: string;
};

const sourceLabels: Record<string, { label: string; color: string }> = {
  MAPS_SCRAPER: { label: "Maps Scraper", color: "bg-admin-accent-dim text-admin-accent" },
  SITE_FORM: { label: "Site formu", color: "bg-admin-blue-dim text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple-dim text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green-dim text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber-dim text-admin-amber" },
};

const statusLabels: Record<string, string> = {
  COLD: "Yeni",
  CONTACTED: "İletişim",
  MEETING: "Görüşme",
  QUOTED: "Teklif gönderildi",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
};

const statusColors: Record<string, string> = {
  COLD: "bg-admin-green-dim text-admin-green",
  CONTACTED: "bg-admin-blue-dim text-admin-blue",
  MEETING: "bg-admin-amber-dim text-admin-amber",
  QUOTED: "bg-admin-blue-dim text-admin-blue",
  WON: "bg-admin-green-dim text-admin-green",
  LOST: "bg-admin-red-dim text-admin-red",
};

export function LeadTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
            <th className="px-4 py-2.5">İşletme</th>
            <th className="px-4 py-2.5">Kaynak</th>
            <th className="px-4 py-2.5">Tür</th>
            <th className="px-4 py-2.5">Bütçe</th>
            <th className="px-4 py-2.5">Durum</th>
            <th className="px-4 py-2.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border">
          {leads.map((lead) => {
            const src = sourceLabels[lead.source] || sourceLabels.MANUAL;
            const st = statusLabels[lead.status] || lead.status;
            const stColor = statusColors[lead.status] || statusColors.COLD;
            return (
              <tr key={lead.id} className="hover:bg-admin-bg3">
                <td className="px-4 py-2.5">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-[11px] text-admin-muted">
                    {lead.address || lead.sector || ""}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${src.color}`}>
                    {src.label}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-admin-muted">
                  {lead.type || "Web sitesi"}
                </td>
                <td className="px-4 py-2.5">
                  {lead.budget || "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${stColor}`}>
                    {st}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  {isGSM(lead.phone) && (
                    <button
                      onClick={() => openWhatsApp(lead.phone)}
                      className="rounded bg-admin-accent px-2.5 py-1 text-[10px] font-medium text-white hover:brightness-110 transition-colors"
                    >
                      WA Gönder
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
