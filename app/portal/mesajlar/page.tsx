import { getPortalMessages } from "@/actions/portal";
import PortalChat from "@/components/portal/PortalChat";

export const dynamic = "force-dynamic";

export default async function PortalMessagesPage() {
  let messages: Awaited<ReturnType<typeof getPortalMessages>> = [];
  try {
    messages = await getPortalMessages();
  } catch {
    messages = [];
  }

  return <PortalChat initialMessages={messages} />;
}
