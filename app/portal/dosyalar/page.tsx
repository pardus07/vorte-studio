import { getPortalFiles } from "@/actions/portal";
import PortalFilesView from "@/components/portal/PortalFilesView";

export const dynamic = "force-dynamic";

export default async function PortalFilesPage() {
  let files: Awaited<ReturnType<typeof getPortalFiles>> = [];
  try {
    files = await getPortalFiles();
  } catch {
    files = [];
  }

  return <PortalFilesView initialFiles={files} />;
}
