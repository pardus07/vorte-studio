import { getPortalDashboard } from "@/actions/portal";
import { redirect } from "next/navigation";
import PortalContractView from "@/components/portal/PortalContractView";

export const dynamic = "force-dynamic";

export default async function PortalContractPage() {
  let data = null;
  try {
    data = await getPortalDashboard();
  } catch {
    data = null;
  }

  if (!data) redirect("/portal/giris");

  return (
    <PortalContractView
      proposal={data.proposal}
      contract={data.contract}
      payments={data.payments}
    />
  );
}
