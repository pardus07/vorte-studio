/**
 * Türkçe gramer helper test runner.
 *
 * TS dosyasını derlemeden test edebilmek için helper logic'ini
 * bu dosyaya birebir kopyalıyoruz. Her değişiklik sonrası
 *   node scripts/test-turkish-grammar.mjs
 * ile manuel çalıştırın. Güncelleme stratejisi: TS'yi değiştir →
 * bu dosyanın logic'ini güncelle → koştur → yeşilse commit.
 *
 * (Proje native test framework kullanmıyor. tsx/jest yok.)
 */

import { test } from "node:test";
import assert from "node:assert/strict";

/* ------------------------------------------------------------------ */
/*  Helper logic mirror (turkish-grammar.ts ile birebir aynı)          */
/* ------------------------------------------------------------------ */
const TR_LOWER_MAP = {
  A: "a", B: "b", C: "c", Ç: "ç", D: "d",
  E: "e", F: "f", G: "g", Ğ: "ğ", H: "h",
  I: "ı", İ: "i", J: "j", K: "k", L: "l",
  M: "m", N: "n", O: "o", Ö: "ö", P: "p",
  R: "r", S: "s", Ş: "ş", T: "t", U: "u",
  Ü: "ü", V: "v", Y: "y", Z: "z",
};

function toTurkishLower(s) {
  let out = "";
  for (const ch of s) out += TR_LOWER_MAP[ch] ?? ch.toLowerCase();
  return out;
}

const VOWELS = "aeıioöuü";
const BACK_VOWELS = "aıou";
const HARD_CONSONANTS = "pçtkfsşh";

function getLastVowel(word) {
  const lower = toTurkishLower(word);
  for (let i = lower.length - 1; i >= 0; i--) {
    if (VOWELS.includes(lower[i])) return lower[i];
  }
  return null;
}

function getLastLetter(word) {
  const lower = toTurkishLower(word);
  for (let i = lower.length - 1; i >= 0; i--) {
    const c = lower[i];
    if (/[a-zçğıöşü]/.test(c)) return c;
  }
  return "";
}

function endsWithVowel(word) {
  return VOWELS.includes(getLastLetter(word));
}

function endsWithHardConsonant(word) {
  return HARD_CONSONANTS.includes(getLastLetter(word));
}

function isBackVowel(v) {
  return BACK_VOWELS.includes(v);
}

function suffixDe(word) {
  if (!word) return word;
  const lv = getLastVowel(word);
  if (!lv) return `${word}'de`;
  const hard = endsWithHardConsonant(word);
  const back = isBackVowel(lv);
  const suffix = back ? (hard ? "ta" : "da") : (hard ? "te" : "de");
  return `${word}'${suffix}`;
}

function suffixIn(word) {
  if (!word) return word;
  const lv = getLastVowel(word);
  if (!lv) return `${word}'in`;
  const endsVowel = endsWithVowel(word);
  let core;
  switch (lv) {
    case "a": case "ı": core = "ın"; break;
    case "e": case "i": core = "in"; break;
    case "o": case "u": core = "un"; break;
    case "ö": case "ü": core = "ün"; break;
    default: core = "in";
  }
  return `${word}'${endsVowel ? `n${core}` : core}`;
}

function suffixE(word) {
  if (!word) return word;
  const lv = getLastVowel(word);
  if (!lv) return `${word}'e`;
  const endsVowel = endsWithVowel(word);
  const back = isBackVowel(lv);
  const core = back ? "a" : "e";
  return `${word}'${endsVowel ? `y${core}` : core}`;
}

function suffixDen(word) {
  if (!word) return word;
  const lv = getLastVowel(word);
  if (!lv) return `${word}'den`;
  const hard = endsWithHardConsonant(word);
  const back = isBackVowel(lv);
  const suffix = back ? (hard ? "tan" : "dan") : (hard ? "ten" : "den");
  return `${word}'${suffix}`;
}

/* ------------------------------------------------------------------ */
/*  Testler                                                             */
/* ------------------------------------------------------------------ */

test("suffixDe — bulunma eki", () => {
  // Kullanıcının spec verdiği durumlar
  assert.equal(suffixDe("İzmir"), "İzmir'de");
  assert.equal(suffixDe("İstanbul"), "İstanbul'da");
  assert.equal(suffixDe("Ankara"), "Ankara'da");

  // Kalın + yumuşak
  assert.equal(suffixDe("Bursa"), "Bursa'da");
  assert.equal(suffixDe("Antalya"), "Antalya'da");
  assert.equal(suffixDe("Konya"), "Konya'da");
  assert.equal(suffixDe("Adana"), "Adana'da");
  assert.equal(suffixDe("Samsun"), "Samsun'da");

  // İnce + yumuşak
  assert.equal(suffixDe("Edirne"), "Edirne'de");
  assert.equal(suffixDe("Mersin"), "Mersin'de");
  assert.equal(suffixDe("Kayseri"), "Kayseri'de");
  assert.equal(suffixDe("Denizli"), "Denizli'de");

  // Sert ünsüzle biten (sertleşme kuralı)
  assert.equal(suffixDe("Gaziantep"), "Gaziantep'te"); // p → -te
  assert.equal(suffixDe("Uşak"), "Uşak'ta");           // k kalın → -ta
  assert.equal(suffixDe("Sinop"), "Sinop'ta");         // p kalın → -ta
  assert.equal(suffixDe("Tokat"), "Tokat'ta");         // t kalın → -ta
  assert.equal(suffixDe("Kars"), "Kars'ta");           // s kalın → -ta
  assert.equal(suffixDe("Tekirdağ"), "Tekirdağ'da");   // ğ yumuşak + kalın → -da

  // Uzun ilçe/semt adları
  assert.equal(suffixDe("Kemalpaşa"), "Kemalpaşa'da");
  assert.equal(suffixDe("Şişli"), "Şişli'de");
  assert.equal(suffixDe("Üsküdar"), "Üsküdar'da"); // son ünlü "a" (kalın!) → da
});

test("suffixIn — tamlama eki", () => {
  // Kullanıcının spec verdiği
  assert.equal(suffixIn("İzmir"), "İzmir'in");
  assert.equal(suffixIn("İstanbul"), "İstanbul'un");
  assert.equal(suffixIn("Ankara"), "Ankara'nın");
  assert.equal(suffixIn("Antalya"), "Antalya'nın");
  assert.equal(suffixIn("Bursa"), "Bursa'nın");

  // Kalın düz a/ı — ünsüz biter
  assert.equal(suffixIn("Adana"), "Adana'nın");        // ünlü + a
  assert.equal(suffixIn("Van"), "Van'ın");             // ünsüz + a
  assert.equal(suffixIn("Kars"), "Kars'ın");           // ünsüz + a

  // Kalın yuvarlak o/u
  assert.equal(suffixIn("Konya"), "Konya'nın");        // son ünlü a → ın
  assert.equal(suffixIn("Çorum"), "Çorum'un");
  assert.equal(suffixIn("Samsun"), "Samsun'un");

  // İnce düz e/i
  assert.equal(suffixIn("Edirne"), "Edirne'nin");
  assert.equal(suffixIn("Mersin"), "Mersin'in");
  assert.equal(suffixIn("Kayseri"), "Kayseri'nin");
  assert.equal(suffixIn("Denizli"), "Denizli'nin");

  // İnce yuvarlak ö/ü
  assert.equal(suffixIn("Ürgüp"), "Ürgüp'ün");
  assert.equal(suffixIn("Göynük"), "Göynük'ün");
});

test("suffixE — yönelme eki", () => {
  assert.equal(suffixE("İzmir"), "İzmir'e");
  assert.equal(suffixE("İstanbul"), "İstanbul'a");
  assert.equal(suffixE("Ankara"), "Ankara'ya");
  assert.equal(suffixE("Bursa"), "Bursa'ya");
  assert.equal(suffixE("Mersin"), "Mersin'e");
  assert.equal(suffixE("Konya"), "Konya'ya");
});

test("suffixDen — ayrılma eki", () => {
  assert.equal(suffixDen("İzmir"), "İzmir'den");
  assert.equal(suffixDen("İstanbul"), "İstanbul'dan");
  assert.equal(suffixDen("Ankara"), "Ankara'dan");
  assert.equal(suffixDen("Uşak"), "Uşak'tan");
  assert.equal(suffixDen("Gaziantep"), "Gaziantep'ten");
});

test("Edge cases", () => {
  assert.equal(suffixDe(""), "");
  assert.equal(suffixIn(""), "");
  assert.equal(suffixE(""), "");
  assert.equal(suffixDen(""), "");

  // Büyük harf karışımı
  assert.equal(suffixDe("İZMİR"), "İZMİR'de");
  assert.equal(suffixIn("İSTANBUL"), "İSTANBUL'un");

  // Türkiye (fallback default — ünlü yok senaryosu değil, son ünlü e)
  assert.equal(suffixDe("Türkiye"), "Türkiye'de");
  assert.equal(suffixIn("Türkiye"), "Türkiye'nin");
});
