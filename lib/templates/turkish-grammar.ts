/**
 * Türkçe dil bilgisi yardımcıları — şehir/yer adlarına doğru ek üretir.
 *
 * Neden? 103 şablonda `{props.city}&apos;de` gibi HARDCODED Türkçe ekler vardı.
 * "İzmir'de" doğru ama "İstanbul'de" yanlış (doğrusu: "İstanbul'da").
 * Bu helper ünlü uyumu ve ünsüz sertleşme kurallarını uygular.
 *
 * Kurallar:
 *   1) Büyük ünlü uyumu (kalın/ince):
 *      a, ı, o, u  → kalın  → -a / -da / -dan / -ın/-un ailesi
 *      e, i, ö, ü  → ince   → -e / -de / -den / -in/-ün ailesi
 *
 *   2) Ünsüz sertleşmesi (p, ç, t, k, f, s, ş, h — "FıSTıKÇı ŞaHaP"):
 *      Sert ünsüzle biten kelimelerde d/D → t, b/B → p olur.
 *      → -da/-de → -ta/-te
 *      → -dan/-den → -tan/-ten
 *
 *   3) Kaynaştırma "n":
 *      Tamlama eki (-ın/-in/-un/-ün), ünlüyle biten kelimeye eklenirken
 *      araya "n" girer: Ankara → Ankara'nın
 *
 * Not: Türkçe'nin "İ/I" ikilemi nedeniyle .toLowerCase() güvenilir değil
 * (locale'a göre değişir). Manuel küçük harfe çevirme kullanıyoruz.
 */

/* ------------------------------------------------------------------ */
/*  Küçük harf eşlemi — locale'den bağımsız                           */
/* ------------------------------------------------------------------ */
const TR_LOWER_MAP: Record<string, string> = {
  A: "a", B: "b", C: "c", Ç: "ç", D: "d",
  E: "e", F: "f", G: "g", Ğ: "ğ", H: "h",
  I: "ı", İ: "i", J: "j", K: "k", L: "l",
  M: "m", N: "n", O: "o", Ö: "ö", P: "p",
  R: "r", S: "s", Ş: "ş", T: "t", U: "u",
  Ü: "ü", V: "v", Y: "y", Z: "z",
};

function toTurkishLower(s: string): string {
  let out = "";
  for (const ch of s) {
    out += TR_LOWER_MAP[ch] ?? ch.toLowerCase();
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Ses karakteri setleri                                              */
/* ------------------------------------------------------------------ */
const VOWELS = "aeıioöuü";
const BACK_VOWELS = "aıou"; // kalın ünlü
const HARD_CONSONANTS = "pçtkfsşh"; // FıSTıKÇı ŞaHaP

/**
 * Kelimenin son ünlüsünü küçük harfle döndürür. Hiç ünlü yoksa null.
 */
function getLastVowel(word: string): string | null {
  const lower = toTurkishLower(word);
  for (let i = lower.length - 1; i >= 0; i--) {
    if (VOWELS.includes(lower[i])) return lower[i];
  }
  return null;
}

/**
 * Son harfi küçük harfle döndürür.
 * Kesme işaretleri, rakamlar ve boşluk gibi karakterleri atlar.
 */
function getLastLetter(word: string): string {
  const lower = toTurkishLower(word);
  for (let i = lower.length - 1; i >= 0; i--) {
    const c = lower[i];
    // Türkçe harf veya latin harf
    if (/[a-zçğıöşü]/.test(c)) return c;
  }
  return "";
}

function endsWithVowel(word: string): boolean {
  const last = getLastLetter(word);
  return VOWELS.includes(last);
}

function endsWithHardConsonant(word: string): boolean {
  const last = getLastLetter(word);
  return HARD_CONSONANTS.includes(last);
}

function isBackVowel(v: string): boolean {
  return BACK_VOWELS.includes(v);
}

/* ================================================================== */
/*                        BULUNMA EKİ (-de / -da / -te / -ta)          */
/* ================================================================== */

/**
 * Bulunma (lokatif) eki ekler.
 *
 *   İzmir     → İzmir'de     (ince ünlü + yumuşak ünsüz)
 *   İstanbul  → İstanbul'da  (kalın ünlü + yumuşak ünsüz)
 *   Ankara    → Ankara'da    (kalın ünlü + ünlü ile biter)
 *   Gaziantep → Gaziantep'te (ince ünlü + sert ünsüz "p")
 *   Uşak      → Uşak'ta      (kalın ünlü + sert ünsüz "k")
 */
export function suffixDe(word: string): string {
  if (!word) return word;
  const lastVowel = getLastVowel(word);
  if (!lastVowel) return `${word}'de`; // fallback — ünlü yok, default ince

  const hard = endsWithHardConsonant(word);
  const back = isBackVowel(lastVowel);

  const suffix = back ? (hard ? "ta" : "da") : (hard ? "te" : "de");
  return `${word}'${suffix}`;
}

/* ================================================================== */
/*                        TAMLAMA EKİ (-ın/-in/-un/-ün, -nın/-nin...) */
/* ================================================================== */

/**
 * Tamlama (ilgi/genitif) eki ekler.
 *
 *   İzmir     → İzmir'in       (i → ince/düz, ünsüz biter)
 *   İstanbul  → İstanbul'un    (u → kalın/yuvarlak, ünsüz biter)
 *   Ankara    → Ankara'nın     (a → kalın/düz, ünlü biter → bağlayıcı n)
 *   Antalya   → Antalya'nın    (a → kalın/düz, ünlü biter → bağlayıcı n)
 *   Bursa     → Bursa'nın      (a → kalın/düz, ünlü biter → bağlayıcı n)
 *   Çorum     → Çorum'un       (u → kalın/yuvarlak, ünsüz biter)
 *   Tokyo     → Tokyo'nun      (o → kalın/yuvarlak, ünlü biter)
 *   Ürgüp     → Ürgüp'ün       (ü → ince/yuvarlak, ünsüz biter)
 */
export function suffixIn(word: string): string {
  if (!word) return word;
  const lastVowel = getLastVowel(word);
  if (!lastVowel) return `${word}'in`; // fallback

  const endsVowel = endsWithVowel(word);
  // Tamlama ekinde ünsüz SERTLEŞMESİ YOK (d/t değişimi yok).
  // Sadece ünlü uyumu + bağlayıcı "n" kararı verilir.

  let core: string;
  switch (lastVowel) {
    case "a":
    case "ı":
      core = "ın";
      break;
    case "e":
    case "i":
      core = "in";
      break;
    case "o":
    case "u":
      core = "un";
      break;
    case "ö":
    case "ü":
      core = "ün";
      break;
    default:
      core = "in";
  }

  const suffix = endsVowel ? `n${core}` : core;
  return `${word}'${suffix}`;
}

/* ================================================================== */
/*                        YÖNELME EKİ (-a / -e / -ya / -ye)            */
/* ================================================================== */

/**
 * Yönelme (datif) eki ekler.
 *
 *   İzmir    → İzmir'e
 *   İstanbul → İstanbul'a
 *   Ankara   → Ankara'ya   (ünlü biter → bağlayıcı y)
 *   Bursa    → Bursa'ya
 */
export function suffixE(word: string): string {
  if (!word) return word;
  const lastVowel = getLastVowel(word);
  if (!lastVowel) return `${word}'e`;

  const endsVowel = endsWithVowel(word);
  const back = isBackVowel(lastVowel);

  const core = back ? "a" : "e";
  const suffix = endsVowel ? `y${core}` : core;
  return `${word}'${suffix}`;
}

/* ================================================================== */
/*                        AYRILMA EKİ (-den / -dan / -ten / -tan)      */
/* ================================================================== */

/**
 * Ayrılma (ablatif) eki ekler.
 *
 *   İzmir     → İzmir'den
 *   İstanbul  → İstanbul'dan
 *   Ankara    → Ankara'dan
 *   Gaziantep → Gaziantep'ten (sert ünsüz)
 *   Uşak      → Uşak'tan
 */
export function suffixDen(word: string): string {
  if (!word) return word;
  const lastVowel = getLastVowel(word);
  if (!lastVowel) return `${word}'den`;

  const hard = endsWithHardConsonant(word);
  const back = isBackVowel(lastVowel);

  const suffix = back ? (hard ? "tan" : "dan") : (hard ? "ten" : "den");
  return `${word}'${suffix}`;
}
