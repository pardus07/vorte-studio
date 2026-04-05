import { getPortalLogoProject } from "@/actions/logo";
import PortalLogoView from "@/components/portal/PortalLogoView";

export const dynamic = "force-dynamic";

export default async function PortalLogoPage() {
  let project = null;
  try {
    project = await getPortalLogoProject();
  } catch {
    project = null;
  }

  const serialized = project ? JSON.parse(JSON.stringify(project)) : null;
  return <PortalLogoView project={serialized} />;
}
