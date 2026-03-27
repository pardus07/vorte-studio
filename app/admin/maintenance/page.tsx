import StatCard from "@/components/admin/StatCard";

const seedMaintenance = [
  {
    id: "m1",
    clientName: "Anatolian Spa Hotel",
    websiteUrl: "anatolianspa.com",
    monthlyFee: 2000,
    renewalDate: "2026-04-15",
    domainExpiry: "2027-01-20",
    sslExpiry: "2026-07-15",
    plan: "premium",
    lastAction: "2026-03-01",
  },
  {
    id: "m2",
    clientName: "restocafe.com",
    websiteUrl: "restocafe.com",
    monthlyFee: 1800,
    renewalDate: "2026-04-01",
    domainExpiry: "2026-12-10",
    sslExpiry: "2026-04-03",
    plan: "standard",
    lastAction: "2026-03-20",
  },
  {
    id: "m3",
    clientName: "DisSağlık Dental",
    websiteUrl: "dissaglik.com",
    monthlyFee: 1500,
    renewalDate: "2026-05-10",
    domainExpiry: "2027-03-15",
    sslExpiry: "2026-09-20",
    plan: "standard",
    lastAction: "2026-03-15",
  },
  {
    id: "m4",
    clientName: "Sarıgül Otomotiv",
    websiteUrl: "sariguloto.com",
    monthlyFee: 1900,
    renewalDate: "2026-06-01",
    domainExpiry: "2026-04-10",
    sslExpiry: "2026-08-01",
    plan: "premium",
    lastAction: "2026-02-28",
  },
];

function daysUntil(dateStr: string) {
  return Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

function daysBadge(days: number) {
  if (days <= 7)
    return { text: `${days} gün`, color: "text-admin-red", bg: "bg-admin-red-dim" };
  if (days <= 30)
    return { text: `${days} gün`, color: "text-admin-amber", bg: "bg-admin-amber-dim" };
  return { text: `${days} gün`, color: "text-admin-green", bg: "bg-admin-green-dim" };
}

export default function MaintenancePage() {
  const totalRevenue = seedMaintenance.reduce((s, m) => s + m.monthlyFee, 0);
  const sslWarnings = seedMaintenance.filter(
    (m) => daysUntil(m.sslExpiry) <= 30
  ).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Aktif paket"
          value={String(seedMaintenance.length)}
          sub="Tümü aktif"
          color="green"
        />
        <StatCard
          label="Bu ay bakım geliri"
          value={`₺${totalRevenue.toLocaleString("tr-TR")}`}
          sub="Aylık sabit gelir"
          color="accent"
        />
        <StatCard
          label="SSL uyarısı"
          value={String(sslWarnings)}
          sub={sslWarnings > 0 ? "Acil yenileme gerekli" : "Sorun yok"}
          color={sslWarnings > 0 ? "red" : "green"}
          trend={sslWarnings > 0 ? "warn" : undefined}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-end">
        <button className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white">
          + Yeni Bakım Müşterisi
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-bg2">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">Müşteri</th>
                <th className="px-4 py-2.5">Website</th>
                <th className="px-4 py-2.5">Ücret</th>
                <th className="px-4 py-2.5">Yenileme</th>
                <th className="px-4 py-2.5">Domain</th>
                <th className="px-4 py-2.5">SSL</th>
                <th className="px-4 py-2.5">Son Aksiyon</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {seedMaintenance.map((m) => {
                const domainDays = daysUntil(m.domainExpiry);
                const sslDays = daysUntil(m.sslExpiry);
                const domainBadge = daysBadge(domainDays);
                const sslBadge = daysBadge(sslDays);
                const isCritical = sslDays <= 7;

                return (
                  <tr key={m.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.clientName}</div>
                      <div className="text-[10px] text-admin-muted">
                        {m.plan === "premium" ? "Premium" : "Standard"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://${m.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-admin-blue hover:underline"
                      >
                        {m.websiteUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-medium text-admin-green">
                      ₺{m.monthlyFee.toLocaleString("tr-TR")}/ay
                    </td>
                    <td className="px-4 py-3 text-admin-muted">
                      {new Date(m.renewalDate).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${domainBadge.bg} ${domainBadge.color}`}
                      >
                        {domainBadge.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sslBadge.bg} ${sslBadge.color}`}
                      >
                        {sslBadge.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-admin-muted">
                      {new Date(m.lastAction).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">
                          Log
                        </button>
                        {isCritical ? (
                          <button className="rounded bg-admin-accent px-2 py-1 text-[10px] font-medium text-white">
                            SSL Yenile
                          </button>
                        ) : (
                          <button className="rounded border border-admin-border px-2 py-1 text-[10px] text-admin-muted hover:text-admin-text">
                            SSL Yenile
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
    </div>
  );
}
