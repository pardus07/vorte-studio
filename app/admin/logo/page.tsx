import { getLogoProjects } from "@/actions/logo";
import { getPortalUsersLite } from "@/actions/portal";
import AdminLogoList from "@/components/admin/AdminLogoList";

export const dynamic = "force-dynamic";

export default async function AdminLogoPage() {
  let projects: Awaited<ReturnType<typeof getLogoProjects>> = [];
  let portalUsers: Awaited<ReturnType<typeof getPortalUsersLite>> = [];
  try {
    projects = await getLogoProjects();
  } catch {
    projects = [];
  }
  try {
    portalUsers = await getPortalUsersLite();
  } catch {
    portalUsers = [];
  }

  const serialized = JSON.parse(JSON.stringify(projects));
  return <AdminLogoList projects={serialized} portalUsers={portalUsers} />;
}
