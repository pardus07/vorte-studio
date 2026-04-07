import { getDesignPreview } from "@/actions/design-preview";
import { redirect } from "next/navigation";
import PortalDesignView from "@/components/portal/PortalDesignView";

export const dynamic = "force-dynamic";

export default async function PortalDesignPage() {
  let result = null;
  try {
    result = await getDesignPreview();
  } catch {
    result = null;
  }

  if (!result || !result.success) {
    redirect("/portal/giris");
  }

  return <PortalDesignView data={result.data} />;
}
