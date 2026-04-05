/**
 * WhatsApp Bildirim Şablonları — Proje süreç bildirimleri
 *
 * Lead ilk temas şablonları: lib/wa-templates.ts
 * Bu dosya: Sözleşme, ödeme, proje, portal bildirimleri
 */

export type WANotificationKey =
  | "teklif_gonderildi"
  | "sozlesme_imzalandi"
  | "odeme_bekleniyor"
  | "odeme_alindi"
  | "revizyon_tamamlandi"
  | "proje_asamasi"
  | "hosgeldiniz"
  | "takip_mesaji"
  | "bakim_yenileme";

export interface WANotificationInput {
  firmName?: string;
  contactName?: string;
  proposalUrl?: string;
  totalPrice?: number;
  projectTitle?: string;
  stage?: string;
  paymentAmount?: number;
  paymentLabel?: string;
  renewalDate?: string;
  customNote?: string;
}

function fmt(n: number) {
  return n.toLocaleString("tr-TR");
}

export const WA_NOTIFICATIONS: Record<
  WANotificationKey,
  {
    label: string;
    description: string;
    contextType: string;
    generate: (input: WANotificationInput) => string;
  }
> = {
  teklif_gonderildi: {
    label: "Teklif Gönderildi",
    description: "Müşteriye teklif linki gönderildiğinde",
    contextType: "PROPOSAL",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

Vorte Studio olarak firmanız *${input.firmName || ""}* için hazırladığımız web sitesi teklifimiz hazır.

Teklif detaylarını buradan inceleyebilirsiniz:
${input.proposalUrl || "[Teklif Linki]"}

Toplam: *₺${fmt(input.totalPrice || 0)}*

Sorularınız için bize ulaşabilirsiniz.

Saygılarımızla,
Vorte Studio`,
  },
  sozlesme_imzalandi: {
    label: "Sözleşme İmzalandı",
    description: "Dijital sözleşme imzalandığında",
    contextType: "CONTRACT",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.firmName || ""}* için sözleşme başarıyla imzalandı!

Proje süreciniz başlamıştır. Müşteri portalınız üzerinden tüm gelişmeleri takip edebilirsiniz.

Portal: https://vortestudio.com/portal/giris

Hayırlı olsun!
Vorte Studio`,
  },
  odeme_bekleniyor: {
    label: "Ödeme Bekleniyor",
    description: "Ödeme vadesi yaklaştığında",
    contextType: "PAYMENT",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.firmName || ""}* projesine ait *${input.paymentLabel || "ödeme"}* vadesi yaklaşmaktadır.

Tutar: *₺${fmt(input.paymentAmount || 0)}*

Ödeme bilgileri için portal hesabınızı kontrol edebilirsiniz.

Saygılarımızla,
Vorte Studio`,
  },
  odeme_alindi: {
    label: "Ödeme Alındı",
    description: "Ödeme teyit edildiğinde",
    contextType: "PAYMENT",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.firmName || ""}* projesine ait *₺${fmt(input.paymentAmount || 0)}* tutarındaki ödemeniz başarıyla alınmıştır.

Teşekkür ederiz!
Vorte Studio`,
  },
  revizyon_tamamlandi: {
    label: "Revizyon Tamamlandı",
    description: "Revizyon talebi tamamlandığında",
    contextType: "PROJECT",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.projectTitle || input.firmName || ""}* projesinde istediğiniz revizyon tamamlanmıştır.

Portal hesabınızdan inceleyebilir ve onay verebilirsiniz.

Portal: https://vortestudio.com/portal/giris

Vorte Studio`,
  },
  proje_asamasi: {
    label: "Proje Aşaması Değişti",
    description: "Proje yeni bir aşamaya geçtiğinde",
    contextType: "PROJECT",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.projectTitle || input.firmName || ""}* projeniz yeni aşamaya geçti:

*${input.stage || "Yeni Aşama"}*

Detayları portal hesabınızdan takip edebilirsiniz.

Vorte Studio`,
  },
  hosgeldiniz: {
    label: "Hoş Geldiniz",
    description: "Portal hesabı oluşturulduğunda",
    contextType: "PORTAL",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.firmName || ""}* müşteri portalınız hazır!

Buradan projenizin tüm sürecini takip edebilir, dosya paylaşabilir ve bizimle iletişime geçebilirsiniz.

Portal: https://vortestudio.com/portal/giris

Hoş geldiniz!
Vorte Studio`,
  },
  takip_mesaji: {
    label: "Takip Mesajı",
    description: "Lead takip mesajı gönderimi",
    contextType: "LEAD",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.firmName || ""}* için hazırladığımız teklifi inceleme fırsatınız oldu mu?

Sorularınız varsa yardımcı olmaktan memnuniyet duyarız.
${input.customNote ? `\n${input.customNote}\n` : ""}
Saygılarımızla,
Vorte Studio`,
  },
  bakim_yenileme: {
    label: "Bakım Yenileme",
    description: "Bakım paketi yenileme zamanı",
    contextType: "MAINTENANCE",
    generate: (input) =>
      `Merhaba ${input.contactName || ""},

*${input.firmName || ""}* bakım paketinizin yenileme tarihi yaklaşmaktadır.

Yenileme: *${input.renewalDate || "Yakında"}*
Aylık: *₺${fmt(input.paymentAmount || 0)}*

Devam etmek isterseniz bilgilendirmenizi rica ederiz.

Vorte Studio`,
  },
};

export function getNotificationTemplateList() {
  return Object.entries(WA_NOTIFICATIONS).map(([key, tmpl]) => ({
    key: key as WANotificationKey,
    label: tmpl.label,
    description: tmpl.description,
    contextType: tmpl.contextType,
  }));
}

export function generateNotificationMessage(
  template: WANotificationKey,
  input: WANotificationInput
): string {
  const tmpl = WA_NOTIFICATIONS[template];
  if (!tmpl) return "";
  return tmpl.generate(input);
}
