import { getLogoProjects } from "@/actions/logo";
import AdminLogoList from "@/components/admin/AdminLogoList";

export const dynamic = "force-dynamic";

export default async function AdminLogoPage() {
  let projects: Awaited<ReturnType<typeof getLogoProjects>> = [];
  try {
    projects = await getLogoProjects();
  } catch {
    projects = [];
  }

  const serialized = JSON.parse(JSON.stringify(projects));
  return <AdminLogoList projects={serialized} />;
}
