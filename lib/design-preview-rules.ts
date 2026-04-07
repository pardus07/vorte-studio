/**
 * Tasarım Önizleme — Revizyon Kuralları
 *
 * Müşteri staging URL'deki tasarımı inceler ve iki aksiyondan birini seçer:
 *   1. Onaylar → final ödemeye geçilir
 *   2. Revizyon ister → admin düzeltir, yeni versiyon paylaşır
 *
 * Sözleşmede tanımlı revizyon hakkı: 3. Bu limit burada merkezi olarak
 * tutulur. Sözleşme değişirse tek satır güncelleme yeterli.
 *
 * Tasarım kararı: Revizyon sayısını ayrı bir counter alanı yerine
 * DesignRevision kayıtlarının count()'u ile hesaplıyoruz — race
 * condition olmaz, audit trail sağlar, sayım her zaman tutarlı kalır.
 */

/** Sözleşmede tanımlı toplam revizyon hakkı */
export const MAX_DESIGN_REVISIONS = 3;

export interface RevisionRuleResult {
  /** Müşteri yeni revizyon isteyebilir mi? */
  allowed: boolean;
  /** Kalan revizyon hakkı (görselde "2/3 hakkın kaldı" göstermek için) */
  remainingRevisions: number;
  /** Kullanılan revizyon sayısı */
  usedRevisions: number;
  /** İzin verilmiyorsa müşteriye gösterilecek açıklama */
  reason?: string;
}

/**
 * Müşteri yeni bir revizyon isteyebilir mi kontrol eder.
 *
 * Bu fonksiyon UI'daki "Revizyon İste" butonunun davranışını belirler:
 *   - allowed=true → buton aktif, tıklanabilir
 *   - allowed=false → buton disabled, reason mesajı gösterilir
 *
 * Kenar durumlar (senin karar vereceğin):
 *   1. Müşteri tasarımı zaten onayladıysa (isAlreadyApproved=true) — bir
 *      daha revizyon isteyebilmeli mi? Muhtemelen hayır, ama domain sana
 *      bağlı (belki "onayladım ama şunu görünce fikrim değişti" senaryosu).
 *   2. Limit aşıldığında reason mesajı ne olmalı? Müşteri ne anlamalı —
 *      "admin ile iletişime geçin" mi, "ek ücret karşılığı" mı?
 *   3. used === MAX_DESIGN_REVISIONS olduğunda son revizyon hakkı kullanılmış
 *      sayılır mı, yoksa "sonuncu zaten geldi" diye farklı mı ele alınır?
 *
 * @param usedRevisions - Şu ana kadar kullanılmış revizyon sayısı (DesignRevision count)
 * @param isAlreadyApproved - Müşteri designApprovedAt'i dolu mu?
 * @returns RevisionRuleResult — UI buton state'ini ve mesajı belirler
 */
export function canRequestRevision(
  usedRevisions: number,
  isAlreadyApproved: boolean
): RevisionRuleResult {
  const remaining = Math.max(0, MAX_DESIGN_REVISIONS - usedRevisions);

  if (isAlreadyApproved) {
    return {
      allowed: false,
      remainingRevisions: 0,
      usedRevisions,
      reason:
        "Tasarım onaylandı. Üretim aşamasına geçildiği için yeni revizyon talep edilemez.",
    };
  }

  if (remaining <= 0) {
    return {
      allowed: false,
      remainingRevisions: 0,
      usedRevisions,
      reason:
        "Revizyon hakkınız doldu. Lütfen tasarımı onaylayın veya ekibimizle iletişime geçin.",
    };
  }

  return {
    allowed: true,
    remainingRevisions: remaining,
    usedRevisions,
  };
}
