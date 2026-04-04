import { getProposalByToken } from "@/actions/proposals";
import { notFound } from "next/navigation";
import ProposalView from "./proposal-view";

export const dynamic = "force-dynamic";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const proposal = await getProposalByToken(token);

  if (!proposal) notFound();

  return <ProposalView proposal={proposal} />;
}
