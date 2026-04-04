import { getProposals } from "@/actions/proposals";
import ProposalsList from "./proposals-list";

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Teklifler</h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          Chatbot başvurularından oluşturulan tekliflerin durumunu takip edin.
        </p>
      </div>
      <ProposalsList initialData={proposals} />
    </div>
  );
}
