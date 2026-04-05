import { getReportData } from "@/actions/reports";
import ReportsView from "@/components/admin/ReportsView";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let data = null;
  try {
    data = await getReportData();
  } catch {
    data = null;
  }

  return <ReportsView data={data} />;
}
