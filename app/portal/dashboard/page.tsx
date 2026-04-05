import { getPortalDashboard } from "@/actions/portal";
import { redirect } from "next/navigation";
import PortalDashboardView from "@/components/portal/PortalDashboardView";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  let data = null;
  try {
    data = await getPortalDashboard();
  } catch {
    data = null;
  }

  if (!data) redirect("/portal/giris");

  return <PortalDashboardView data={data} />;
}
