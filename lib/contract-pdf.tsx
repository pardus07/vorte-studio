import React from "react";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

// ── Lokal font — Docker container'da dış CDN timeout sorununu önler ──
// DM Sans (Vorte brand font) — Türkçe karakterleri (ş, ç, ö, ü, ğ, ı, İ) tam
// destekler. NOT: fi/fl ligature substitution sorunu yaşıyor — `nl()` helper'ı
// U+200C ZWNJ ile bu sorunu kırıyor (aşağıya bak).
const fontsDir = path.join(process.cwd(), "fonts");

Font.register({
  family: "DMSans",
  fonts: [
    { src: path.join(fontsDir, "DMSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "DMSans-Bold.ttf"), fontWeight: 700 },
  ],
});

// Hyphenation'ı kapat — react-pdf default kelime bölme algoritması
// bazı Türkçe harfleri yanlış işliyor.
Font.registerHyphenationCallback((word) => [word]);

/** Null-safe string normalize helper
 *
 * fontkit (react-pdf'in alt katmanı) GSUB tablosundaki `liga` feature'ını
 * otomatik uyguluyor — DM Sans'ta fi/fl ligature mapping var ama glyph render
 * edilemiyor ve karakter tamamen düşüyor. Çözüm: U+200C (Zero-Width Non-Joiner)
 * ekleyerek ligature substitution'ı kır. Görsel etki yok, dosya boyutu etkilenmez.
 */
const nl = (s: string | number | null | undefined): string => {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/fi/g, "f\u200Ci")
    .replace(/fl/g, "f\u200Cl")
    .replace(/Fi/g, "F\u200Ci")
    .replace(/Fl/g, "F\u200Cl");
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "DMSans",
    fontSize: 9,
    paddingTop: 35,
    paddingBottom: 50,
    paddingHorizontal: 45,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#FF4500",
  },
  logo: {
    fontSize: 16,
    fontWeight: 700,
    color: "#FF4500",
  },
  logoSub: {
    fontSize: 8,
    color: "#999",
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 15,
    color: "#1a1a1a",
    // textTransform: "uppercase" KULLANMA — JS toUpperCase() locale-aware değil,
    // Türkçe "i" → "İ" dönüşümünü yapamıyor (yanlışlıkla "I" üretiyor).
    // Onun yerine direkt UPPERCASE Türkçe metin kullan.
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#FF4500",
  },
  text: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: "#333",
    marginBottom: 3,
  },
  textBold: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 8.5,
    color: "#666",
    width: 120,
  },
  infoValue: {
    fontSize: 8.5,
    fontWeight: 700,
    color: "#1a1a1a",
    flex: 1,
  },
  table: {
    marginTop: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingVertical: 2,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    fontSize: 8,
    color: "#333",
    flex: 1,
  },
  tableCellRight: {
    fontSize: 8,
    color: "#333",
    width: 100,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: "#FF4500",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 700,
    flex: 1,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#FF4500",
    width: 100,
    textAlign: "right",
  },
  signatureSection: {
    marginTop: 30,
    borderTopWidth: 2,
    borderTopColor: "#FF4500",
    paddingTop: 15,
  },
  signatureGrid: {
    flexDirection: "row",
    gap: 30,
  },
  signatureBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
  },
  signatureImage: {
    width: 150,
    height: 60,
    objectFit: "contain",
  },
  metadata: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  metaText: {
    fontSize: 7,
    color: "#999",
    marginBottom: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 7,
    color: "#bbb",
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  paymentBox: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  paymentCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    textAlign: "center",
  },
});

interface ContractPDFData {
  contractText: string;
  firmName: string;
  signerName: string;
  signerCompany?: string;
  signatureData: string; // base64
  signedAt: string;
  signerIp: string;
  signerAgent: string;
  contractHash: string;
  // Fiyatlandırma
  items: Array<{ label: string; cost: number }>;
  totalPrice: number;
  kdvAmount: number;
  totalWithKdv: number;
  paymentPlan: Array<{ label: string; percent: number; amount: number; description: string }>;
  // Taraflar
  ownerName: string;
  ownerIban: string;
}

const fmt = (n: number) => n.toLocaleString("tr-TR");

function ContractPDF({ data }: { data: ContractPDFData }) {
  // Sözleşme metnini bölümlere ayır
  const sections = data.contractText
    .split(/={3,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Document>
      {/* Sayfa 1: Kapak + Taraflar + Kapsam */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>VORTE STUDIO</Text>
            <Text style={styles.logoSub}>{nl("Web Tasarım & Geliştirme")}</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 8, color: "#999" }}>{nl("Sözleşme Tarihi")}</Text>
            <Text style={{ fontSize: 9, fontWeight: 700 }}>{nl(data.signedAt)}</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {nl("WEB TASARIM VE GELİŞTİRME HİZMET SÖZLEŞMESİ")}
        </Text>

        {/* Sözleşme bölümlerini render et */}
        {sections.map((section, i) => {
          // WEB TASARIM başlıklı section'ı SKIP et — title olarak yukarıda zaten render edildi
          // Sadece tarih + sözleşme no body'sini koru
          if (section.startsWith("WEB TASARIM")) {
            const lines = section.split("\n");
            // İlk satır (başlık) atla, gerisini body olarak göster
            const body = lines.slice(1).join("\n").trim();
            if (!body) return null;
            return (
              <View key={i} wrap={true}>
                <Text style={styles.text}>{nl(body)}</Text>
              </View>
            );
          }
          // MADDE başlıkları
          if (section.startsWith("MADDE")) {
            const lines = section.split("\n");
            const title = lines[0];
            const body = lines.slice(1).join("\n").trim();
            return (
              <View key={i} wrap={true}>
                <Text style={styles.sectionTitle}>{nl(title)}</Text>
                <Text style={styles.text}>{nl(body)}</Text>
              </View>
            );
          }
          // İMZA bölümü - ayrı render
          if (section.startsWith("İMZA") || section.startsWith("IMZA") || section.includes("imzalanmış") || section.includes("imzalanmis")) {
            return null; // İmza bölümünü kendimiz render edeceğiz
          }
          // Diğer bölümler
          return (
            <View key={i} wrap={true}>
              <Text style={styles.text}>{nl(section)}</Text>
            </View>
          );
        })}

        <Text style={styles.footer} fixed>
          {nl("Vorte Studio · vortestudio.com · Bu belge dijital ortamda oluşturulmuş ve imzalanmıştır.")}
        </Text>
      </Page>

      {/* Sayfa 2: Fiyat Kırılımı + Ödeme Planı + Banka Bilgileri */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTE STUDIO</Text>
          <Text style={{ fontSize: 8, color: "#999" }}>{nl("Fiyat Kırılımı")}</Text>
        </View>

        {/* Fiyat tablosu — break edilebilir, satır sayısı dinamik */}
        <Text style={styles.sectionTitle}>{nl("FİYAT KIRILIMI")}</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { fontWeight: 700 }]}>Kalem</Text>
            <Text style={[styles.tableCellRight, { fontWeight: 700 }]}>Tutar</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <Text style={styles.tableCell}>{nl(item.label)}</Text>
              <Text style={styles.tableCellRight}>{fmt(item.cost)} TL</Text>
            </View>
          ))}
          {/* Ara Toplam — atomik blok, sayfa kayması olmasın */}
          <View wrap={false}>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.tableCell, { color: "#666" }]}>Ara Toplam</Text>
              <Text style={[styles.tableCellRight, { color: "#666" }]}>{fmt(data.totalPrice)} TL</Text>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.tableCell, { color: "#666" }]}>KDV (%20)</Text>
              <Text style={[styles.tableCellRight, { color: "#666" }]}>{fmt(data.kdvAmount)} TL</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOPLAM (KDV Dahil)</Text>
              <Text style={styles.totalValue}>{fmt(data.totalWithKdv)} TL</Text>
            </View>
          </View>
        </View>

        {/* Ödeme Planı — atomik blok */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>{nl("ÖDEME PLANI")}</Text>
          <View style={styles.paymentBox}>
            {data.paymentPlan.map((pay, i) => {
              const colors = ["#22c55e", "#f59e0b", "#3b82f6"];
              return (
                <View key={i} style={[styles.paymentCard, { borderColor: colors[i] || "#ddd" }]}>
                  <Text style={{ fontSize: 7, color: "#999", marginBottom: 2 }}>
                    {nl(pay.label)} (%{pay.percent})
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>
                    {fmt(pay.amount)} TL
                  </Text>
                  <Text style={{ fontSize: 7, color: "#999", marginTop: 2 }}>
                    {nl(pay.description)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Banka Bilgileri — atomik blok, orphan oluşmasın */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>{nl("BANKA BİLGİLERİ")}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Banka</Text>
            <Text style={styles.infoValue}>{nl("Türkiye İş Bankası")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hesap Sahibi</Text>
            <Text style={styles.infoValue}>{nl(data.ownerName)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IBAN</Text>
            <Text style={styles.infoValue}>{data.ownerIban}</Text>
          </View>
          <Text style={[styles.text, { marginTop: 6, color: "#666" }]}>
            {nl("Ödeme açıklamasına firma adınızı, proje türünü ve ödemenin hangi aşamaya ait olduğunu yazınız.")}
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          {nl("Vorte Studio · vortestudio.com · Bu belge dijital ortamda oluşturulmuş ve imzalanmıştır.")}
        </Text>
      </Page>

      {/* Sayfa 3: İmza + Metadata */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTE STUDIO</Text>
          <Text style={{ fontSize: 8, color: "#999" }}>{nl("İmza Sayfası")}</Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
            {nl("DİJİTAL İMZA")}
          </Text>

          <View style={styles.signatureGrid}>
            {/* Hizmet Sağlayıcı */}
            <View style={styles.signatureBox}>
              <Text style={[styles.textBold, { marginBottom: 4 }]}>{nl("HİZMET SAĞLAYICI")}</Text>
              <Text style={styles.text}>{nl(data.ownerName)}</Text>
              <Text style={styles.text}>Vorte Studio</Text>
              <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 4 }}>
                <Text style={{ fontSize: 7, color: "#999" }}>{nl("Dijital onay ile imzalanmıştır")}</Text>
              </View>
            </View>

            {/* Müşteri */}
            <View style={styles.signatureBox}>
              <Text style={[styles.textBold, { marginBottom: 4 }]}>{nl("MÜŞTERİ")}</Text>
              <Text style={styles.text}>{nl(data.signerName)}</Text>
              {data.signerCompany && (
                <Text style={styles.text}>{nl(data.signerCompany)}</Text>
              )}
              {data.signatureData && (
                <Image src={data.signatureData} style={styles.signatureImage} />
              )}
              <Text style={{ fontSize: 7, color: "#999", marginTop: 4 }}>
                {nl(`İmza Tarihi: ${data.signedAt}`)}
              </Text>
            </View>
          </View>
        </View>

        {/* Metadata — Hukuki delil */}
        <View style={styles.metadata}>
          <Text style={[styles.textBold, { fontSize: 8, marginBottom: 4 }]}>
            {nl("DİJİTAL İMZA METADATA (Hukuki Delil — HMK m. 193)")}
          </Text>
          <Text style={styles.metaText}>{nl(`İmza Tarihi    : ${data.signedAt}`)}</Text>
          <Text style={styles.metaText}>IP Adresi      : {data.signerIp}</Text>
          <Text style={styles.metaText}>{nl(`Cihaz Bilgisi  : ${data.signerAgent}`)}</Text>
          <Text style={styles.metaText}>{nl(`Sözleşme Hash  : ${data.contractHash}`)}</Text>
          <Text style={[styles.metaText, { marginTop: 4 }]}>
            {nl("Bu sözleşme dijital ortamda imzalanmış olup, yukarıdaki metadata bilgileri HMK m. 193 uyarınca kesin delil niteliğindedir.")}
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          {nl("Vorte Studio · vortestudio.com · Bu belge dijital ortamda oluşturulmuş ve imzalanmıştır.")}
        </Text>
      </Page>
    </Document>
  );
}

/** Sözleşme PDF'ini Buffer olarak oluştur */
export async function generateContractPDF(data: ContractPDFData): Promise<Buffer> {
  const buffer = await renderToBuffer(<ContractPDF data={data} />);
  return Buffer.from(buffer);
}
