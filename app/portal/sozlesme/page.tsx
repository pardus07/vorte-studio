import { getPortalDashboard } from "@/actions/portal";
import PortalContractView from "@/components/portal/PortalContractView";
import PortalDataError from "@/components/portal/PortalDataError";

export const dynamic = "force-dynamic";

export default async function PortalContractPage() {
  let data = null;
  try {
    data = await getPortalDashboard();
  } catch {
    data = null;
  }

  // Redirect yerine hata ekranı — middleware ile loop'a girmesin
  if (!data) return <PortalDataError title="Sözleşme bilgisi yüklenemedi" />;

  return (
    <PortalContractView
      proposal={data.proposal}
      contract={data.contract}
      payments={data.payments}
    />
  );
}
