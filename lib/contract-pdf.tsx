import React from "react";
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

// ── Google Fonts — Türkçe karakter desteği ──
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v47/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbGmT.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/roboto/v47/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbVmQ.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
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
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 6,
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
    paddingVertical: 3,
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
            <Text style={styles.logoSub}>Web Tasarim & Gelistirme</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 8, color: "#999" }}>Sozlesme Tarihi</Text>
            <Text style={{ fontSize: 9, fontWeight: 700 }}>{data.signedAt}</Text>
          </View>
        </View>

        <Text style={styles.title}>
          Web Tasarim ve Gelistirme Hizmet Sozlesmesi
        </Text>

        {/* Sözleşme bölümlerini render et */}
        {sections.map((section, i) => {
          // MADDE başlıkları
          if (section.startsWith("MADDE") || section.startsWith("WEB TASARIM")) {
            const lines = section.split("\n");
            const title = lines[0];
            const body = lines.slice(1).join("\n").trim();
            return (
              <View key={i} wrap={true}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.text}>{body}</Text>
              </View>
            );
          }
          // İMZA bölümü - ayrı render
          if (section.startsWith("IMZA") || section.includes("imzalanmis")) {
            return null; // İmza bölümünü kendimiz render edeceğiz
          }
          // Diğer bölümler
          return (
            <View key={i} wrap={true}>
              <Text style={styles.text}>{section}</Text>
            </View>
          );
        })}

        <Text style={styles.footer}>
          Vorte Studio · vortestudio.com · Bu belge dijital ortamda olusturulmus ve imzalanmistir.
        </Text>
      </Page>

      {/* Sayfa 2: Fiyat Kırılımı + Ödeme Planı */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTE STUDIO</Text>
          <Text style={{ fontSize: 8, color: "#999" }}>Fiyat Kirilimi</Text>
        </View>

        <Text style={styles.sectionTitle}>FIYAT KIRILIMI</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { fontWeight: 700 }]}>Kalem</Text>
            <Text style={[styles.tableCellRight, { fontWeight: 700 }]}>Tutar</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.label}</Text>
              <Text style={styles.tableCellRight}>{fmt(item.cost)} TL</Text>
            </View>
          ))}
          {/* Ara Toplam */}
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

        {/* Ödeme Planı */}
        <Text style={styles.sectionTitle}>ODEME PLANI</Text>
        <View style={styles.paymentBox}>
          {data.paymentPlan.map((pay, i) => {
            const colors = ["#22c55e", "#f59e0b", "#3b82f6"];
            return (
              <View key={i} style={[styles.paymentCard, { borderColor: colors[i] || "#ddd" }]}>
                <Text style={{ fontSize: 7, color: "#999", marginBottom: 2 }}>
                  {pay.label} (%{pay.percent})
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>
                  {fmt(pay.amount)} TL
                </Text>
                <Text style={{ fontSize: 7, color: "#999", marginTop: 2 }}>
                  {pay.description}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Banka Bilgileri */}
        <Text style={styles.sectionTitle}>BANKA BILGILERI</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Banka</Text>
          <Text style={styles.infoValue}>Turkiye Is Bankasi</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hesap Sahibi</Text>
          <Text style={styles.infoValue}>{data.ownerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>IBAN</Text>
          <Text style={styles.infoValue}>{data.ownerIban}</Text>
        </View>
        <Text style={[styles.text, { marginTop: 8, color: "#666" }]}>
          Odeme aciklamasina firma adinizi, proje turunu ve odemenin hangi asamaya ait oldugunu yaziniz.
        </Text>

        <Text style={styles.footer}>
          Vorte Studio · vortestudio.com · Bu belge dijital ortamda olusturulmus ve imzalanmistir.
        </Text>
      </Page>

      {/* Sayfa 3: İmza + Metadata */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTE STUDIO</Text>
          <Text style={{ fontSize: 8, color: "#999" }}>Imza Sayfasi</Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
            DIJITAL IMZA
          </Text>

          <View style={styles.signatureGrid}>
            {/* Hizmet Sağlayıcı */}
            <View style={styles.signatureBox}>
              <Text style={[styles.textBold, { marginBottom: 4 }]}>HIZMET SAGLAYICI</Text>
              <Text style={styles.text}>{data.ownerName}</Text>
              <Text style={styles.text}>Vorte Studio</Text>
              <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 4 }}>
                <Text style={{ fontSize: 7, color: "#999" }}>Dijital onay ile imzalanmistir</Text>
              </View>
            </View>

            {/* Müşteri */}
            <View style={styles.signatureBox}>
              <Text style={[styles.textBold, { marginBottom: 4 }]}>MUSTERI</Text>
              <Text style={styles.text}>{data.signerName}</Text>
              {data.signerCompany && (
                <Text style={styles.text}>{data.signerCompany}</Text>
              )}
              {data.signatureData && (
                <Image src={data.signatureData} style={styles.signatureImage} />
              )}
              <Text style={{ fontSize: 7, color: "#999", marginTop: 4 }}>
                Imza Tarihi: {data.signedAt}
              </Text>
            </View>
          </View>
        </View>

        {/* Metadata — Hukuki delil */}
        <View style={styles.metadata}>
          <Text style={[styles.textBold, { fontSize: 8, marginBottom: 4 }]}>
            DIJITAL IMZA METADATA (Hukuki Delil — HMK m. 193)
          </Text>
          <Text style={styles.metaText}>Imza Tarihi    : {data.signedAt}</Text>
          <Text style={styles.metaText}>IP Adresi      : {data.signerIp}</Text>
          <Text style={styles.metaText}>Cihaz Bilgisi  : {data.signerAgent}</Text>
          <Text style={styles.metaText}>Sozlesme Hash  : {data.contractHash}</Text>
          <Text style={[styles.metaText, { marginTop: 4 }]}>
            Bu sozlesme dijital ortamda imzalanmis olup, yukaridaki metadata bilgileri
            HMK m. 193 uyarinca kesin delil niteligindedir.
          </Text>
        </View>

        <Text style={styles.footer}>
          Vorte Studio · vortestudio.com · Bu belge dijital ortamda olusturulmus ve imzalanmistir.
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
