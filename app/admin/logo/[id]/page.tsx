import { getLogoProjectDetail } from "@/actions/logo";
import { redirect } from "next/navigation";
import AdminLogoDetail from "@/components/admin/AdminLogoDetail";

export const dynamic = "force-dynamic";

export default async function AdminLogoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let project = null;
  try {
    project = await getLogoProjectDetail(id);
  } catch {
    project = null;
  }

  if (!project) redirect("/admin/logo");

  // Date -> string serialization
  const serialized = JSON.parse(JSON.stringify(project));

  return <AdminLogoDetail project={serialized} />;
}
