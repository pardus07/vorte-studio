import { getDesignPreview } from "@/actions/design-preview";
import PortalDesignView from "@/components/portal/PortalDesignView";
import PortalDataError from "@/components/portal/PortalDataError";

export const dynamic = "force-dynamic";

export default async function PortalDesignPage() {
  let result = null;
  try {
    result = await getDesignPreview();
  } catch {
    result = null;
  }

  // Redirect yerine hata ekranı — middleware ile loop'a girmesin
  if (!result || !result.success) {
    return <PortalDataError title="Tasarım önizlemesi yüklenemedi" />;
  }

  return <PortalDesignView data={result.data} />;
}
