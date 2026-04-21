import {
  getProposalByToken,
  getSimilarPortfolioItems,
  markProposalViewed,
} from "@/actions/proposals";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProposalView from "./proposal-view";
import VerifyGate from "./verify-gate";
import {
  determineAccessKind,
  buildAccessCookieName,
  verifyAccessCookie,
} from "@/lib/proposal-access-rate-limit";
// FAZ C — Madde 3.3: KDV SSR'da çekilir, client'a prop olarak geçer
import { getPricingValue } from "@/lib/pricing-config";

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

/**
 * Teklif public sayfası (FAZ B — Madde 2.4 IDOR gate ile).
 *
 * Akış:
 *   1. Token → Proposal (yoksa 404)
 *   2. determineAccessKind → "phone" | "email" | "disabled"
 *   3. Dal seçimi:
 *      a) "disabled" → ProposalView + showAccessWarning banner (doğrulama yok)
 *      b) Cookie valid (phone/email) → ProposalView (normal render)
 *      c) Cookie yok/invalid → VerifyGate (client component)
 *   4. Erişim verildiğinde markProposalViewed ile viewedAt/VIEWED kaydı
 *      (Q1-a kararı: getProposalByToken'dan buraya taşındı).
 *
 * Cookie kontrolü: HMAC-SHA256 imzalı, AUTH_SECRET reuse, 24h TTL, per-
 * proposal ayrı cookie name. verify aşamaları lib/proposal-access-rate-limit
 * → verifyAccessCookie (format + HMAC + TTL + proposalId eşleşmesi).
 */
export default async function ProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const proposal = await getProposalByToken(token);

  if (!proposal) notFound();

  // Dinamik kind kararı (Q1-C): iletişim bilgisine göre doğrulama modu
  const kind = determineAccessKind({
    contactPhone: proposal.contactPhone,
    contactEmail: proposal.contactEmail,
  });

  // FAZ C 3.3: KDV oranını teklifin yaratılma tarihine göre çek.
  // Sözleşme geçici oranı korumalı (bugün %22 olsa bile dün imzalanan
  // teklif %20 ile görünmeli). createdAt serializer'da ISO string'e
  // çevrildi, burada Date'e geri dönüştürüyoruz.
  const kdvRate = await getPricingValue(
    "kdv_rate",
    new Date(proposal.createdAt)
  );

  // ── Dal a) Disabled mode — banner + direkt render ──
  // Ne phone ne email kayıtlı, gate uygulanamaz. Müşteri direkt görür, ama
  // ProposalView üzerinde bir uyarı bantı ile "bu teklife ikinci faktörlü
  // erişim kapalı, link gizli tutunuz" bildirimi gösterilir (Q3-a).
  if (kind === "disabled") {
    const [, portfolioItems] = await Promise.all([
      markProposalViewed(proposal.id),
      getSimilarPortfolioItems(proposal.sector),
    ]);
    return (
      <ProposalView
        proposal={proposal}
        portfolioItems={portfolioItems}
        kdvRate={kdvRate}
        showAccessWarning={true}
      />
    );
  }

  // ── Dal b) Cookie valid — gate geçilmiş, normal render ──
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(
    buildAccessCookieName(proposal.id)
  )?.value;

  if (verifyAccessCookie(cookieValue, proposal.id)) {
    const [, portfolioItems] = await Promise.all([
      markProposalViewed(proposal.id),
      getSimilarPortfolioItems(proposal.sector),
    ]);
    return (
      <ProposalView
        proposal={proposal}
        portfolioItems={portfolioItems}
        kdvRate={kdvRate}
      />
    );
  }

  // ── Dal c) Cookie yok/invalid — verify gate ──
  // Proposal detayı (phone/email) gate'e propla GEÇİRİLMEZ. Sadece kind
  // + firmName: müşteri kendi numarası/maili'ni hatırlar, sunucu tarafı
  // maskelemesiz ipucu vermez (brute force saldırı yüzeyini daraltır).
  return (
    <VerifyGate token={token} kind={kind} firmName={proposal.firmName} />
  );
}
