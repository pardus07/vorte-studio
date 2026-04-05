import { getPortalUsers } from "@/actions/portal";
import AdminPortalView from "@/components/admin/AdminPortalView";

export const dynamic = "force-dynamic";

export default async function AdminPortalPage() {
  let users: Awaited<ReturnType<typeof getPortalUsers>> = [];
  try {
    users = await getPortalUsers();
  } catch {
    users = [];
  }

  return <AdminPortalView users={users} />;
}
