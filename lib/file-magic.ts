/**
 * Magic-byte (file signature) doğrulama
 *
 * MIME header ve extension kullanıcı tarafından kolayca sahteleştirilebilir.
 * Dosyanın ilk N byte'ı gerçek içerik tipini belirler (RFC standardı "magic
 * number"). Bu modül yüklenen dosyanın iddia edilen tip ile gerçekten eşleşip
 * eşleşmediğini doğrular.
 *
 * file-type gibi harici kütüphane eklemedik — az sayıda desteklenen tip için
 * manuel kontrol yeterli ve bağımlılık yükü getirmiyor.
 *
 * NOT: SVG ve TXT gibi text tabanlı formatlar magic-byte taşımaz. Onlar
 * allowlist'ten çıkarıldı (SVG → XSS) ya da content-type sniffing ile
 * doğrulandı (TXT).
 */

import type { Buffer as NodeBuffer } from "node:buffer";

type MagicCheck = {
  /** Mime canonical karşılığı (validateFile'ın beklentisi ile birebir) */
  mime: string;
  /** file-constraints'teki extensions ile çakışan dosya uzantıları */
  extensions: string[];
  /** Signature(lar) — bazı formatlar birden fazla imzaya sahip */
  signatures: Array<{
    offset: number;
    bytes: number[];
  }>;
};

const CHECKS: MagicCheck[] = [
  // ── Görseller ─────────────────────────────────────────────────────
  {
    mime: "image/jpeg",
    extensions: [".jpg", ".jpeg"],
    signatures: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  },
  {
    mime: "image/png",
    extensions: [".png"],
    signatures: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  },
  {
    mime: "image/gif",
    extensions: [".gif"],
    signatures: [
      { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
      { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
    ],
  },
  {
    mime: "image/webp",
    extensions: [".webp"],
    // RIFF....WEBP — offset 0 "RIFF", offset 8 "WEBP"
    signatures: [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }],
  },
  {
    mime: "image/tiff",
    extensions: [".tif", ".tiff"],
    signatures: [
      { offset: 0, bytes: [0x49, 0x49, 0x2a, 0x00] }, // little-endian
      { offset: 0, bytes: [0x4d, 0x4d, 0x00, 0x2a] }, // big-endian
    ],
  },

  // ── Belgeler ──────────────────────────────────────────────────────
  {
    mime: "application/pdf",
    extensions: [".pdf"],
    signatures: [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  },
  {
    mime: "application/msword",
    extensions: [".doc"],
    // MS-CFB (OLE2) header — .doc/.xls eski formatlar
    signatures: [{ offset: 0, bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }],
  },
  {
    mime: "application/vnd.ms-excel",
    extensions: [".xls"],
    signatures: [{ offset: 0, bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }],
  },
  {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: [".docx"],
    // ZIP (PK\x03\x04) — docx/xlsx/pptx hepsi zip container
    signatures: [{ offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }],
  },
  {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extensions: [".xlsx"],
    signatures: [{ offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }],
  },

  // ── Video ─────────────────────────────────────────────────────────
  {
    mime: "video/mp4",
    extensions: [".mp4"],
    // "ftyp" at offset 4 — MP4/MOV ISO base media
    signatures: [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }],
  },
  {
    mime: "video/quicktime",
    extensions: [".mov"],
    signatures: [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }],
  },
  {
    mime: "video/webm",
    extensions: [".webm"],
    // EBML header (Matroska container)
    signatures: [{ offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3] }],
  },
];

/**
 * Buffer'ın iddia edilen mime/extension ile eşleşip eşleşmediğini kontrol et.
 *
 * @param buffer  Dosyanın ilk birkaç KB'ı yeterli (tamamı gönderilebilir)
 * @param claimedMime  FormData'dan gelen MIME (user-controlled, güvensiz)
 * @param fileName  Orijinal dosya adı (extension için)
 * @returns  true → signature eşleşti; false → sahte/bozuk
 *
 * Text tabanlı formatlar (.txt) magic-byte taşımaz; bu fonksiyon true dönmeli.
 * Caller TXT için bu fonksiyonu çağırmamalı ya da sonucu override etmeli.
 */
export function verifyMagicBytes(
  buffer: NodeBuffer | Uint8Array,
  claimedMime: string,
  fileName: string
): boolean {
  const lowerMime = (claimedMime || "").toLowerCase();
  const lowerName = fileName.toLowerCase();

  // TXT — magic-byte yok, doğrudan geç
  if (lowerMime === "text/plain" || lowerName.endsWith(".txt")) {
    return true;
  }

  // Uygun check'i bul (MIME önce, sonra extension)
  const check =
    CHECKS.find((c) => c.mime === lowerMime) ||
    CHECKS.find((c) => c.extensions.some((ext) => lowerName.endsWith(ext)));

  if (!check) {
    // Bilmediğimiz format — güvenli tarafta kalıp reddet
    return false;
  }

  // En az bir signature eşleşmeli
  for (const sig of check.signatures) {
    if (buffer.length < sig.offset + sig.bytes.length) continue;
    let matched = true;
    for (let i = 0; i < sig.bytes.length; i++) {
      if (buffer[sig.offset + i] !== sig.bytes[i]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      // WebP için ek kontrol: offset 8'de "WEBP"
      if (check.mime === "image/webp") {
        if (buffer.length < 12) return false;
        const webpMarker = [0x57, 0x45, 0x42, 0x50];
        for (let i = 0; i < 4; i++) {
          if (buffer[8 + i] !== webpMarker[i]) return false;
        }
      }
      return true;
    }
  }
  return false;
}
