/**
 * KVKK Açık Rıza — Merkezi Sabitler
 *
 * Bu dosya; chat formu, chat-submit route'u ve ileride sözleşme imza akışı
 * tarafından tek doğruluk kaynağı olarak okunur. KVKK metni veya versiyonu
 * güncellenirse sadece burası değiştirilir.
 *
 * Versiyon formatı: v{sıra}-{YYYY-MM}
 * Örn: v1-2026-04  → Nisan 2026 metni
 *      v2-2027-01  → Ocak 2027'de metin güncellenirse
 */

export const KVKK_VERSION = "v1-2026-04";

export const KVKK_URL = "/kvkk";

export const KVKK_CONSENT_MESSAGE =
  "Son adıma geçmeden önce bir onay rica ediyoruz: Size özel teklif " +
  "hazırlayabilmemiz için ad, telefon ve e-posta bilgilerinizi işleyeceğiz. " +
  "6698 sayılı KVKK kapsamında açık rızanızı alıyoruz — detaylar " +
  "aydınlatma metnimizde.";

export const KVKK_ACCEPT_BUTTON_LABEL = "✅ Kabul ediyorum, devam et";

export const KVKK_READ_BUTTON_LABEL = "📄 Aydınlatma Metnini Oku";
