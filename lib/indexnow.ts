/**
 * IndexNow — Bing/Yandex anında indeksleme protokolü.
 * Google desteklemiyor ama Bing + Yandex için trafiği hızlı açar.
 * Key, public olabilir (protokol böyle tasarlanmış), env'den okur.
 * keyLocation: /api/indexnow-key (route.ts üzerinden serve edilir).
 */

const HOST = "www.vortestudio.com";
const KEY_LOCATION = `https://${HOST}/api/indexnow-key`;

function getKey(): string | null {
  const k = process.env.INDEXNOW_KEY;
  if (!k || k.length < 8 || k.length > 128) return null;
  if (!/^[a-f0-9-]+$/i.test(k)) return null;
  return k;
}

export function getIndexNowKey(): string | null {
  return getKey();
}

/**
 * URL'leri IndexNow'a bildir (Bing, Yandex, Seznam).
 * Hata olursa sessiz fail — blog kayıt akışını bloke etmesin.
 */
export async function submitToIndexNow(urls: string[]): Promise<void> {
  const key = getKey();
  if (!key || urls.length === 0) return;

  const clean = urls.filter((u) => u.startsWith(`https://${HOST}/`));
  if (clean.length === 0) return;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: KEY_LOCATION,
        urlList: clean,
      }),
      // 5 sn timeout — admin UI bekletme
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok && res.status !== 202) {
      console.warn(`[indexnow] ${res.status} — ${clean.length} URL başarısız`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[indexnow] Gönderilemedi:", msg);
  }
}
