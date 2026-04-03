import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import AiPanel from "@/components/admin/ai/AiPanel";
import { SidebarProvider } from "@/components/admin/SidebarContext";
import { seedAlerts } from "@/lib/seed-data";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-admin-bg text-admin-text font-[family-name:var(--font-geist)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar alerts={seedAlerts} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <AiPanel />
      </div>
    </SidebarProvider>
  );
}
