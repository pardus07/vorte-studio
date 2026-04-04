import { getProposalsWithPayments } from "@/actions/payments";
import ProposalsList from "./proposals-list";

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const proposals = await getProposalsWithPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Teklifler & Odemeler</h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          Tekliflerin durumunu ve sozlesme odemelerini takip edin.
        </p>
      </div>
      <ProposalsList initialData={proposals} />
    </div>
  );
}
