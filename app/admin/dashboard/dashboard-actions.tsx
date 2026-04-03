"use client";

import { useRouter } from "next/navigation";
import { isGSM, formatWANumber } from "@/lib/phone-utils";
import { cn } from "@/lib/utils";

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

const dotGlow: Record<string, string> = {
  red: "shadow-[0_0_6px_rgba(239,68,68,0.4)]",
  amber: "shadow-[0_0_6px_rgba(245,158,11,0.4)]",
  green: "shadow-[0_0_6px_rgba(34,197,94,0.4)]",
  blue: "shadow-[0_0_6px_rgba(59,130,246,0.4)]",
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
    if (route) router.push(route);
  }

  return (
    <div className="divide-y divide-admin-border">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-admin-bg3/50"
        >
          <div
            className={cn(
              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
              dotColors[alert.dot],
              dotGlow[alert.dot]
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-admin-text">
              {alert.title}
            </div>
            <div className="mt-0.5 text-[11px] text-admin-muted">
              {alert.meta}
            </div>
          </div>
          <button
            onClick={() => handleAction(alert)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all",
              alert.actionType === "primary"
                ? "bg-admin-accent text-white shadow-sm shadow-admin-accent/20 hover:brightness-110 hover:shadow-md hover:shadow-admin-accent/30"
                : "border border-admin-border text-admin-muted hover:border-admin-border2 hover:bg-admin-bg4 hover:text-admin-text"
            )}
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
  MAPS_SCRAPER: { label: "Maps Scraper", color: "bg-admin-accent/12 text-admin-accent" },
  SITE_FORM: { label: "Site formu", color: "bg-admin-blue/12 text-admin-blue" },
  LINKEDIN: { label: "LinkedIn", color: "bg-admin-purple/12 text-admin-purple" },
  REFERRAL: { label: "Referans", color: "bg-admin-green/12 text-admin-green" },
  MANUAL: { label: "Manuel", color: "bg-admin-amber/12 text-admin-amber" },
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
  COLD: "bg-admin-green/12 text-admin-green",
  CONTACTED: "bg-admin-blue/12 text-admin-blue",
  MEETING: "bg-admin-amber/12 text-admin-amber",
  QUOTED: "bg-admin-blue/12 text-admin-blue",
  WON: "bg-admin-green/12 text-admin-green",
  LOST: "bg-admin-red/12 text-admin-red",
};

export function LeadTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-admin-border text-left text-[11px] font-semibold uppercase tracking-wider text-admin-muted2">
            <th className="px-4 py-3">İşletme</th>
            <th className="px-4 py-3">Kaynak</th>
            <th className="px-4 py-3">Tür</th>
            <th className="px-4 py-3">Bütçe</th>
            <th className="px-4 py-3">Durum</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border">
          {leads.map((lead) => {
            const src = sourceLabels[lead.source] || sourceLabels.MANUAL;
            const st = statusLabels[lead.status] || lead.status;
            const stColor = statusColors[lead.status] || statusColors.COLD;
            return (
              <tr
                key={lead.id}
                className="group transition-colors hover:bg-admin-bg3/50"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-admin-text">{lead.name}</div>
                  <div className="mt-0.5 text-[11px] text-admin-muted">
                    {lead.address || lead.sector || ""}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-lg px-2.5 py-1 text-[10px] font-semibold",
                      src.color
                    )}
                  >
                    {src.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-admin-muted">
                  {lead.type || "Web sitesi"}
                </td>
                <td className="px-4 py-3 font-medium">
                  {lead.budget || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-lg px-2.5 py-1 text-[10px] font-semibold",
                      stColor
                    )}
                  >
                    {st}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {isGSM(lead.phone) && (
                    <button
                      onClick={() => openWhatsApp(lead.phone)}
                      className="rounded-lg bg-admin-accent px-3 py-1.5 text-[11px] font-medium text-white shadow-sm shadow-admin-accent/20 transition-all hover:brightness-110 hover:shadow-md hover:shadow-admin-accent/30"
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
