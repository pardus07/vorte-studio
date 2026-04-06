/**
 * Workflow Engine — Lead/Proposal yaşam döngüsü adım belirleme
 *
 * Pure function: state in → step out, side-effect yok.
 * Hem server (proposals-list) hem client (NextStepBadge) tarafından kullanılır.
 *
 * Akış (8 adım):
 *   1. Lead alındı
 *   2. Teklif gönderildi
 *   3. Teklif onaylandı
 *   4. Sözleşme imzalandı
 *   5. Peşinat alındı  ← burada portal aktif olur, project açılır
 *   6. Tasarım & geliştirme (ara ödemeler, milestone'lar)
 *   7. Final ödeme alındı
 *   8. Tamamlandı (yayında)
 */

export type WorkflowStepKey =
  | "lead"
  | "proposal_sent"
  | "proposal_accepted"
  | "contract_signed"
  | "deposit_paid"
  | "in_progress"
  | "final_paid"
  | "completed";

export interface WorkflowStep {
  key: WorkflowStepKey;
  order: number;
  /** Kısa etiket — badge'de gözükür */
  label: string;
  /** Uzun açıklama — tooltip / portal timeline'da gözükür */
  description: string;
  /** Bu adıma karşılık gelen admin sayfası — tıklanınca yönlendirilir */
  href: string;
  /** İkon adı (lucide-react veya emoji fallback) */
  icon: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    key: "lead",
    order: 1,
    label: "Lead Alındı",
    description: "Müşteri ile iletişim kurulmadı, ön değerlendirme aşamasında.",
    href: "/admin/leads",
    icon: "📥",
  },
  {
    key: "proposal_sent",
    order: 2,
    label: "Teklif Gönderildi",
    description: "Teklif hazırlandı ve müşteriye iletildi, görüntülenme bekleniyor.",
    href: "/admin/proposals",
    icon: "📤",
  },
  {
    key: "proposal_accepted",
    order: 3,
    label: "Sözleşme Bekleniyor",
    description: "Müşteri teklifi onayladı, sözleşmeyi imzalaması bekleniyor.",
    href: "/admin/proposals",
    icon: "✍️",
  },
  {
    key: "contract_signed",
    order: 4,
    label: "Peşinat Bekleniyor",
    description: "Sözleşme imzalandı. Müşterinin peşinat ödemesi bekleniyor. Ödeme alındığında portal aktif olacak.",
    href: "/admin/proposals",
    icon: "💳",
  },
  {
    key: "deposit_paid",
    order: 5,
    label: "Logo & Tasarım",
    description: "Peşinat alındı. Portal aktif. Logo ve tasarım çalışmasına başlanabilir.",
    href: "/admin/logo",
    icon: "🎨",
  },
  {
    key: "in_progress",
    order: 6,
    label: "Geliştirme",
    description: "Ara ödeme alındı. Frontend ve backend geliştirmesi sürüyor.",
    href: "/admin/projects",
    icon: "⚙️",
  },
  {
    key: "final_paid",
    order: 7,
    label: "Yayın Hazırlığı",
    description: "Final ödeme alındı. Test ve canlıya alma aşaması.",
    href: "/admin/projects",
    icon: "🚀",
  },
  {
    key: "completed",
    order: 8,
    label: "Tamamlandı",
    description: "Proje canlıda. Bakım sözleşmesine geçilebilir.",
    href: "/admin/projects",
    icon: "✅",
  },
];

/** Proposal/Lead state'inden current step'i çıkar */
export interface WorkflowState {
  proposalStatus: string | null;       // DRAFT, SENT, VIEWED, ACCEPTED, REJECTED
  contractStatus: string | null;       // null, PENDING, SIGNED
  payments: Array<{ stage: number; status: string }>;
}

/**
 * Verilen state için "şu an aktif olan" adımı döndürür.
 * Mantık: ilk tamamlanmamış adım = şu anki adım.
 */
export function getCurrentStep(state: WorkflowState): WorkflowStep {
  const { proposalStatus, contractStatus, payments } = state;

  // Tamamlanma kuralları (sırayla kontrol edilir)
  const stage1Paid = payments.some((p) => p.stage === 1 && p.status === "PAID");
  const stage2Paid = payments.some((p) => p.stage === 2 && p.status === "PAID");
  const stage3Paid = payments.some((p) => p.stage === 3 && p.status === "PAID");
  const allPaid = payments.length > 0 && payments.every((p) => p.status === "PAID");

  // En ileri adımdan başlayıp geriye doğru kontrol et
  if (allPaid && stage3Paid) {
    return WORKFLOW_STEPS.find((s) => s.key === "completed")!;
  }
  if (stage3Paid) {
    return WORKFLOW_STEPS.find((s) => s.key === "final_paid")!;
  }
  if (stage2Paid) {
    return WORKFLOW_STEPS.find((s) => s.key === "in_progress")!;
  }
  if (stage1Paid) {
    return WORKFLOW_STEPS.find((s) => s.key === "deposit_paid")!;
  }
  if (contractStatus === "SIGNED") {
    return WORKFLOW_STEPS.find((s) => s.key === "contract_signed")!;
  }
  if (proposalStatus === "ACCEPTED") {
    return WORKFLOW_STEPS.find((s) => s.key === "proposal_accepted")!;
  }
  if (proposalStatus === "SENT" || proposalStatus === "VIEWED") {
    return WORKFLOW_STEPS.find((s) => s.key === "proposal_sent")!;
  }
  return WORKFLOW_STEPS.find((s) => s.key === "lead")!;
}

/** Bir adımın tamamlanıp tamamlanmadığını kontrol et (timeline render için) */
export function isStepCompleted(stepKey: WorkflowStepKey, state: WorkflowState): boolean {
  const current = getCurrentStep(state);
  const step = WORKFLOW_STEPS.find((s) => s.key === stepKey);
  if (!step) return false;
  return step.order < current.order;
}

/** Bir adımın aktif (şu anki) olduğunu kontrol et */
export function isStepActive(stepKey: WorkflowStepKey, state: WorkflowState): boolean {
  return getCurrentStep(state).key === stepKey;
}

/** Sıradaki tüm adımları render etmek için (portal müşteri timeline'ı) */
export function getAllSteps(): WorkflowStep[] {
  return WORKFLOW_STEPS;
}
