/**
 * Test: contract-pdf.tsx üzerinden örnek PDF üretip Türkçe karakter
 * ve fi/fl ligature düzeltmelerini doğrula.
 *
 * Çalıştırma: npx tsx scripts/test-contract-pdf.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
process.chdir(projectRoot);

const { generateContractPDF } = await import("../lib/contract-pdf.tsx");
const { generateContractText } = await import("../lib/contract-template.ts");

const testData = {
  ownerName: "İBRAHİM YAŞAR",
  ownerTcNo: "46594013798",
  ownerAddress: "Mansuroğlu Mah. Ankara Caddesi No:81/012 Bayraklı Tower, Bayraklı, İzmir",
  ownerPhone: "05431883425",
  ownerEmail: "studio@vorte.com.tr",
  ownerIban: "TR070006400000162071129573",
  ownerTaxOffice: "İZMİR BORNOVA VERGİ DAİRESİ",
  signerName: "ibrahim yaşar",
  signerTcNo: "46594013798",
  signerEmail: "vortekurumsal@gmail.com",
  signerPhone: "05427313425",
  signerAddress: "Mansuroğlu Mah. Ankara Caddesi No:81/012 Bayraklı Tower, Bayraklı, İzmir",
  firmName: "Vorte Tekstili Toptan",
  siteType: "e-ticaret",
  features: ["whatsapp", "harita", "sosyal", "odeme"],
  pageCount: "Belirlenecek",
  totalPrice: 74050,
  kdvRate: 0.2,
  kdvAmount: 14810,
  totalWithKdv: 88860,
  paymentPlan: [
    { label: "Peşinat", percent: 40, amount: 35544, description: "Sözleşme imzalandığında" },
    { label: "Ara Ödeme", percent: 30, amount: 26658, description: "Onay sonrası iş başlatılır" },
    { label: "Final", percent: 30, amount: 26658, description: "İş teslimi ve canlıya alma" },
  ],
  timeline: "1-ay",
  validUntil: "30 gün",
  contractDate: "6 Nisan 2026",
  featureLabels: {
    whatsapp: "WhatsApp Entegrasyonu",
    harita: "Google Harita",
    sosyal: "Sosyal Medya Entegrasyonu",
    odeme: "Online Ödeme Sistemi",
  },
};

const contractText = generateContractText(testData);

const pdfBuffer = await generateContractPDF({
  contractText,
  firmName: testData.firmName,
  signerName: testData.signerName,
  signerCompany: testData.firmName,
  signatureData: "",
  signedAt: "6 Nisan 2026 10:48",
  signerIp: "176.219.48.151",
  signerAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/146.0.0.0",
  contractHash: "82daa31d5065742207a94fb438f13efee3b9b71dc0e0bd235828ae2e1f06f179",
  items: [
    { label: "Temel Paket", cost: 20000 },
    { label: "WhatsApp Entegrasyonu", cost: 625 },
    { label: "Online Ödeme Sistemi", cost: 3750 },
    { label: "Fiyat / Hizmet Listesi", cost: 2500 },
    { label: "Kampanya / İndirim Sistemi", cost: 5000 },
  ],
  totalPrice: 74050,
  kdvAmount: 14810,
  totalWithKdv: 88860,
  paymentPlan: testData.paymentPlan,
  ownerName: "İBRAHİM YAŞAR",
  ownerIban: "TR070006400000162071129573",
});

const outPath = path.join(projectRoot, "scripts", "test-output.pdf");
fs.writeFileSync(outPath, pdfBuffer);
console.log(`✓ PDF üretildi: ${outPath} (${pdfBuffer.length} bytes)`);
