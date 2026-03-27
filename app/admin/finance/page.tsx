import StatCard from "@/components/admin/StatCard";
import { seedPayments } from "@/lib/seed-data";
import RevenueChart from "./revenue-chart";

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  OVERDUE: { label: "Gecikmiş", color: "bg-admin-red-dim text-admin-red" },
  PENDING: { label: "Bekliyor", color: "bg-admin-amber-dim text-admin-amber" },
  PAID: { label: "Ödendi", color: "bg-admin-green-dim text-admin-green" },
  CANCELLED: { label: "İptal", color: "bg-admin-red-dim text-admin-red" },
};

const typeLabels: Record<string, string> = {
  DEPOSIT: "Peşinat",
  MILESTONE: "Aşama",
  FINAL: "Final",
  MAINTENANCE: "Bakım",
};

// Seed monthly revenue data
const monthlyRevenue = [
  { month: "Eki", value: 18000 },
  { month: "Kas", value: 24500 },
  { month: "Ara", value: 31000 },
  { month: "Oca", value: 22000 },
  { month: "Şub", value: 28000 },
  { month: "Mar", value: 34500 },
];

const maintenanceClients = [
  { name: "Anatolian Spa Hotel", fee: 2000, renewal: "2026-04-15" },
  { name: "restocafe.com", fee: 1800, renewal: "2026-04-01" },
  { name: "DisSağlık Dental", fee: 1500, renewal: "2026-05-10" },
  { name: "Sarıgül Otomotiv", fee: 1900, renewal: "2026-06-01" },
];

export default function FinancePage() {
  const payments = seedPayments;
  const totalPending = payments
    .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((s, p) => s + p.amount, 0);
  const totalMaintenance = maintenanceClients.reduce((s, c) => s + c.fee, 0);

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Bu ay gelir"
          value="₺34.500"
          sub="+12% geçen aya göre"
          color="green"
          trend="up"
        />
        <StatCard
          label="Bekleyen ödeme"
          value={`₺${totalPending.toLocaleString("tr-TR")}`}
          sub={`${payments.filter((p) => p.status === "OVERDUE").length} gecikmiş`}
          color="red"
          trend="warn"
        />
        <StatCard
          label="Yıllık projeksiyon"
          value="₺380K"
          sub="Mevcut trend ile"
          color="blue"
        />
        <StatCard
          label="Aylık sabit gelir"
          value={`₺${totalMaintenance.toLocaleString("tr-TR")}`}
          sub={`${maintenanceClients.length} bakım müşterisi`}
          color="accent"
        />
      </div>

      {/* Chart + Maintenance */}
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2 p-5">
          <div className="mb-4 text-[13px] font-medium">
            📊 Son 6 Ay Gelir Trendi
          </div>
          <RevenueChart data={monthlyRevenue} />
        </div>

        {/* Maintenance Revenue */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">
            🔄 Aylık Bakım Gelirleri
          </div>
          <div className="divide-y divide-admin-border">
            {maintenanceClients.map((client) => {
              const daysToRenewal = Math.ceil(
                (new Date(client.renewal).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={client.name}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <div className="text-[12.5px] font-medium">
                      {client.name}
                    </div>
                    <div className="text-[11px] text-admin-muted">
                      Yenileme:{" "}
                      {new Date(client.renewal).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                      {daysToRenewal <= 14 && (
                        <span className="ml-1 text-admin-amber">
                          ({daysToRenewal} gün)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-admin-accent">
                    ₺{client.fee.toLocaleString("tr-TR")}/ay
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="border-b border-admin-border px-4 py-3 text-[13px] font-medium">
          💰 Ödeme Takibi
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-admin-border text-left text-[11px] font-medium text-admin-muted">
                <th className="px-4 py-2.5">Proje</th>
                <th className="px-4 py-2.5">Tür</th>
                <th className="px-4 py-2.5">Tutar</th>
                <th className="px-4 py-2.5">Vade</th>
                <th className="px-4 py-2.5">Fatura</th>
                <th className="px-4 py-2.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {payments.map((payment) => {
                const st =
                  paymentStatusConfig[payment.status] ||
                  paymentStatusConfig.PENDING;
                const dueDate = new Date(payment.dueDate);
                const isOverdue =
                  payment.status !== "PAID" && dueDate < new Date();
                return (
                  <tr key={payment.id} className="hover:bg-admin-bg3">
                    <td className="px-4 py-2.5 font-medium">
                      {payment.projectTitle}
                    </td>
                    <td className="px-4 py-2.5 text-admin-muted">
                      {typeLabels[payment.type] || payment.type}
                    </td>
                    <td
                      className="px-4 py-2.5 font-medium"
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    >
                      ₺{payment.amount.toLocaleString("tr-TR")}
                    </td>
                    <td
                      className={`px-4 py-2.5 ${isOverdue ? "text-admin-red" : "text-admin-muted"}`}
                    >
                      {dueDate.toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td
                      className="px-4 py-2.5 text-admin-muted"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                    >
                      {payment.invoiceNo}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${st.color}`}
                      >
                        {st.label}
                      </span>
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
