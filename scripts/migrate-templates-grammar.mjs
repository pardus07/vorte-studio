/**
 * Sprint 3.6c-fix / FAZ 3
 *
 * 46 şablonda hardcoded Türkçe ek kullanımlarını suffixDe/suffixIn helper'a
 * çevirir ve gerekli import'u ekler.
 *
 * Desteklenen değişim pattern'leri:
 *   {props.city}&apos;de   →  {suffixDe(props.city)}
 *   {props.city}&apos;da   →  {suffixDe(props.city)}
 *   {props.city}&apos;nın  →  {suffixIn(props.city)}
 *   {props.city}&apos;in   →  {suffixIn(props.city)}
 *
 * Her değiştirilen dosyaya (değişiklik yapıldıysa) import satırı eklenir:
 *   import { suffixDe, suffixIn } from './turkish-grammar'
 *
 * Güvenlik:
 *   - Zaten import varsa yeniden eklemez.
 *   - Değişiklik yoksa dosyayı yazmaz.
 *   - compound (district) patternler manuel işlenecek — script onları atlayabilir.
 *
 * Çalıştırma:
 *   node scripts/migrate-templates-grammar.mjs
 */

import fs from "node:fs";
import path from "node:path";

const TEMPLATES_DIR = path.resolve("lib/templates");
const files = fs.readdirSync(TEMPLATES_DIR).filter(
  (f) => f.endsWith(".tsx") && f !== "types.ts" && f !== "turkish-grammar.ts",
);

const report = {
  totalFiles: files.length,
  changedFiles: [],
  skippedFiles: [],
  replacements: { de: 0, da: 0, nin: 0, in: 0 },
};

function transform(content) {
  let updated = content;
  const before = { de: 0, da: 0, nin: 0, in: 0 };

  // {props.city}&apos;de (her zaman bulunma eki — suffixDe)
  const deRegex = /\{props\.city\}&apos;de\b/g;
  const deMatches = updated.match(deRegex);
  if (deMatches) {
    before.de = deMatches.length;
    updated = updated.replace(deRegex, "{suffixDe(props.city)}");
  }

  // {props.city}&apos;da (bulunma eki — suffixDe)
  const daRegex = /\{props\.city\}&apos;da\b/g;
  const daMatches = updated.match(daRegex);
  if (daMatches) {
    before.da = daMatches.length;
    updated = updated.replace(daRegex, "{suffixDe(props.city)}");
  }

  // {props.city}&apos;nın (tamlama eki — suffixIn)
  const ninRegex = /\{props\.city\}&apos;nın\b/g;
  const ninMatches = updated.match(ninRegex);
  if (ninMatches) {
    before.nin = ninMatches.length;
    updated = updated.replace(ninRegex, "{suffixIn(props.city)}");
  }

  // {props.city}&apos;in (tamlama eki — suffixIn)
  const inRegex = /\{props\.city\}&apos;in\b/g;
  const inMatches = updated.match(inRegex);
  if (inMatches) {
    before.in = inMatches.length;
    updated = updated.replace(inRegex, "{suffixIn(props.city)}");
  }

  const totalChanges =
    before.de + before.da + before.nin + before.in;
  return { updated, changes: before, totalChanges };
}

function addImportIfMissing(content) {
  // Zaten import varsa dokunma
  if (content.includes("from './turkish-grammar'")) return content;
  if (content.includes('from "./turkish-grammar"')) return content;

  // './types' import'undan hemen sonra ekle
  const typesImportRegex = /(import\s*\{[^}]*\}\s*from\s*['"]\.\/types['"];?\s*\n)/;
  const match = content.match(typesImportRegex);
  if (match) {
    return content.replace(
      typesImportRegex,
      `$1import { suffixDe, suffixIn } from './turkish-grammar'\n`,
    );
  }

  // Fallback: './use-track' import'undan sonra
  const trackImportRegex = /(import\s*\{[^}]*\}\s*from\s*['"]\.\/use-track['"];?\s*\n)/;
  const trackMatch = content.match(trackImportRegex);
  if (trackMatch) {
    return content.replace(
      trackImportRegex,
      `$1import { suffixDe, suffixIn } from './turkish-grammar'\n`,
    );
  }

  return null; // import yerini bulamadık, manuel inceleme gerek
}

for (const file of files) {
  const filePath = path.join(TEMPLATES_DIR, file);
  const content = fs.readFileSync(filePath, "utf8");

  const { updated, changes, totalChanges } = transform(content);

  if (totalChanges === 0) {
    report.skippedFiles.push(file);
    continue;
  }

  const withImport = addImportIfMissing(updated);
  if (withImport === null) {
    console.error(
      `⚠ ${file}: import yeri bulunamadı — MANUEL kontrol gerek.`,
    );
    continue;
  }

  fs.writeFileSync(filePath, withImport, "utf8");
  report.changedFiles.push({ file, changes });
  report.replacements.de += changes.de;
  report.replacements.da += changes.da;
  report.replacements.nin += changes.nin;
  report.replacements.in += changes.in;
}

console.log("\n=== Migration Report ===");
console.log(`Total template files: ${report.totalFiles}`);
console.log(`Changed files: ${report.changedFiles.length}`);
console.log(`Skipped (no matching pattern): ${report.skippedFiles.length}`);
console.log("\nReplacements:");
console.log(`  &apos;de → suffixDe: ${report.replacements.de}`);
console.log(`  &apos;da → suffixDe: ${report.replacements.da}`);
console.log(`  &apos;nın → suffixIn: ${report.replacements.nin}`);
console.log(`  &apos;in → suffixIn: ${report.replacements.in}`);
console.log("\nChanged files:");
for (const { file, changes } of report.changedFiles) {
  const parts = [];
  if (changes.de) parts.push(`de×${changes.de}`);
  if (changes.da) parts.push(`da×${changes.da}`);
  if (changes.nin) parts.push(`nın×${changes.nin}`);
  if (changes.in) parts.push(`in×${changes.in}`);
  console.log(`  ${file.padEnd(30)} — ${parts.join(", ")}`);
}
