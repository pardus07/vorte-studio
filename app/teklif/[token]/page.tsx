import { getProposalByToken, getSimilarPortfolioItems } from "@/actions/proposals";
import { notFound } from "next/navigation";
import ProposalView from "./proposal-view";

export const dynamic = "force-dynamic";

// Özel teklif sayfaları — arama motorlarında asla görünmemeli
export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const proposal = await getProposalByToken(token);

  if (!proposal) notFound();

  // Benzer sektör projeleri (varsa göster, yoksa boş)
  const portfolioItems = await getSimilarPortfolioItems(proposal.sector);

  return <ProposalView proposal={proposal} portfolioItems={portfolioItems} />;
}
