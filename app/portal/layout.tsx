import { auth } from "@/lib/auth";
import PortalShell from "@/components/portal/PortalShell";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;

  // Giriş sayfasında shell gösterme
  if (!user || user.role !== "portal") {
    return <>{children}</>;
  }

  return (
    <PortalShell
      user={{
        name: (user.name as string) || "",
        email: (user.email as string) || "",
        firmName: (user.firmName as string) || "",
      }}
    >
      {children}
    </PortalShell>
  );
}
