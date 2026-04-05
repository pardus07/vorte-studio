import { getWhatsAppLogs, getWhatsAppStats } from "@/actions/whatsapp";
import WhatsAppView from "@/components/admin/WhatsAppView";

export const dynamic = "force-dynamic";

export default async function WhatsAppPage() {
  let logs: Awaited<ReturnType<typeof getWhatsAppLogs>> = [];
  let stats: Awaited<ReturnType<typeof getWhatsAppStats>> = {
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    templateCounts: {},
  };

  try {
    [logs, stats] = await Promise.all([
      getWhatsAppLogs(),
      getWhatsAppStats(),
    ]);
  } catch {
    // fallback
  }

  return <WhatsAppView logs={logs} stats={stats} />;
}
