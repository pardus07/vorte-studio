import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import AiPanel from "@/components/admin/ai/AiPanel";
import { SidebarProvider } from "@/components/admin/SidebarContext";
import { seedAlerts } from "@/lib/seed-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getUnreadSubmissionCount(): Promise<number> {
  try {
    return await prisma.chatSubmission.count({ where: { isRead: false } });
  } catch {
    return 0;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadCount = await getUnreadSubmissionCount();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-admin-bg text-admin-text font-[family-name:var(--font-geist)]">
        <Sidebar unreadSubmissions={unreadCount} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar alerts={seedAlerts} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <AiPanel />
      </div>
    </SidebarProvider>
  );
}
