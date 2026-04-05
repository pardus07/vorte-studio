import { auth } from "@/lib/auth";
import PortalShell from "@/components/portal/PortalShell";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  // Giriş sayfasında veya oturum yoksa shell gösterme
  if (!user || user.role !== "portal") {
    return <>{children}</>;
  }

  return (
    <PortalShell
      user={{
        name: user.name || "",
        email: user.email || "",
        firmName: user.firmName || "",
      }}
    >
      {children}
    </PortalShell>
  );
}
