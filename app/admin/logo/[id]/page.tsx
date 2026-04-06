import { getLogoProjectDetail } from "@/actions/logo";
import { getBrandAssetsBySlug } from "@/lib/brand-assets";
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

  // Brand manifest'i diskten oku — versionlu URL'ler component'te gosterilecek
  let brandManifest = null;
  if (project.firmSlug) {
    try {
      brandManifest = await getBrandAssetsBySlug(project.firmSlug);
    } catch {
      brandManifest = null;
    }
  }

  return <AdminLogoDetail project={serialized} brandManifest={brandManifest} />;
}
