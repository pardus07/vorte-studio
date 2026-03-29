// Türkiye GSM numarası kontrolü
// GSM: 05XX ile başlar (0530, 0532, 0542, 0505, vb.)
// Sabit hat: 0XXX şehir kodu (0224, 0242, 0312, vb.)

export function isGSM(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  // 05XX ile başlıyorsa GSM
  if (digits.startsWith("05") && digits.length >= 10) return true;
  // 905XX ile başlıyorsa (uluslararası format)
  if (digits.startsWith("905") && digits.length >= 12) return true;
  // 5XX ile başlıyorsa (başında 0 olmadan)
  if (digits.startsWith("5") && digits.length >= 10) return true;
  return false;
}

export function formatWANumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Zaten 90 ile başlıyorsa
  if (digits.startsWith("90") && digits.length >= 12) return digits;
  // 0 ile başlıyorsa kaldır ve 90 ekle
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  // 5 ile başlıyorsa 90 ekle
  if (digits.startsWith("5")) return `90${digits}`;
  return `90${digits}`;
}
