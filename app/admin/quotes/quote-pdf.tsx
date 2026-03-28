import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Türkçe destekli Inter fontu (latin-ext subset — ş,ç,ö,ü,ğ,ı,İ,₺)
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.woff", fontWeight: "normal" },
    { src: "/fonts/Inter-Bold.woff", fontWeight: "bold" },
  ],
});

const accent = "#f97316";
const dark = "#1a1a1a";
const muted = "#6b7280";
const light = "#f3f4f6";
const border = "#e5e7eb";

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Inter",
    color: dark,
  },
  // Header
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: accent,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  logoDot: {
    color: accent,
  },
  contactBlock: {
    textAlign: "right",
    fontSize: 8,
    color: muted,
    lineHeight: 1.5,
  },
  // Quote info bar
  infoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: light,
    borderRadius: 6,
    padding: 14,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 8,
    color: muted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: dark,
    borderRadius: 4,
    padding: 8,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  colName: { flex: 3, fontSize: 10 },
  colPrice: { flex: 1, fontSize: 10, textAlign: "right", fontWeight: "bold" },
  // Total
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: dark,
    borderRadius: 4,
    padding: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: accent,
  },
  // Payment
  paymentTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentGrid: {
    flexDirection: "row",
    gap: 8,
  },
  payBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 6,
    padding: 12,
    textAlign: "center",
  },
  payLabel: {
    fontSize: 8,
    color: muted,
    marginBottom: 4,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  payValue: {
    fontSize: 13,
    fontWeight: "bold",
  },
  payDesc: {
    fontSize: 7,
    color: muted,
    marginTop: 4,
  },
  // Notes
  noteBox: {
    backgroundColor: light,
    borderRadius: 6,
    padding: 12,
    marginTop: 20,
  },
  noteText: {
    fontSize: 8,
    color: muted,
    lineHeight: 1.6,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: muted,
  },
});

const fmt = (n: number) => {
  const formatted = n.toLocaleString("tr-TR");
  return `₺${formatted}`;
};

export default function QuotePDF({
  clientName,
  packageName,
  packagePrice,
  addons,
  total,
  quoteNumber,
}: {
  clientName: string;
  packageName: string;
  packagePrice: number;
  addons: { name: string; price: number }[];
  total: number;
  quoteNumber?: string;
}) {
  const pay1 = Math.round(total * 0.4);
  const pay2 = Math.round(total * 0.3);
  const pay3 = total - pay1 - pay2;
  const today = new Date().toLocaleDateString("tr-TR");
  const validDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("tr-TR");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerBar}>
          <Text style={s.logo}>
            VORTE<Text style={s.logoDot}>.</Text>STUDIO
          </Text>
          <View style={s.contactBlock}>
            <Text>studio@vorte.com.tr</Text>
            <Text>studio.vorte.com.tr</Text>
            <Text>Antalya, Türkiye</Text>
          </View>
        </View>

        {/* Info Bar */}
        <View style={s.infoBar}>
          <View>
            <Text style={s.infoLabel}>Müşteri</Text>
            <Text style={s.infoValue}>{clientName}</Text>
          </View>
          <View>
            <Text style={s.infoLabel}>Teklif No</Text>
            <Text style={s.infoValue}>{quoteNumber || "TASLAK"}</Text>
          </View>
          <View>
            <Text style={s.infoLabel}>Tarih</Text>
            <Text style={s.infoValue}>{today}</Text>
          </View>
          <View>
            <Text style={s.infoLabel}>Geçerlilik</Text>
            <Text style={s.infoValue}>{validDate}</Text>
          </View>
        </View>

        {/* Hizmet Tablosu */}
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, { flex: 3 }]}>Hizmet</Text>
          <Text style={[s.tableHeaderText, { flex: 1, textAlign: "right" }]}>Tutar</Text>
        </View>

        <View style={s.tableRow}>
          <Text style={s.colName}>{packageName}</Text>
          <Text style={s.colPrice}>{fmt(packagePrice)}</Text>
        </View>

        {addons.map((a, i) => (
          <View key={a.name} style={i % 2 === 0 ? s.tableRowAlt : s.tableRow}>
            <Text style={s.colName}>+ {a.name}</Text>
            <Text style={s.colPrice}>{fmt(a.price)}</Text>
          </View>
        ))}

        {/* Toplam */}
        <View style={s.totalBar}>
          <Text style={s.totalLabel}>TOPLAM (KDV Hariç)</Text>
          <Text style={s.totalValue}>{fmt(total)}</Text>
        </View>

        {/* Ödeme Takvimi */}
        <Text style={s.paymentTitle}>Ödeme Takvimi</Text>
        <View style={s.paymentGrid}>
          <View style={[s.payBox, { borderColor: "#22c55e" }]}>
            <Text style={s.payLabel}>Peşinat (%40)</Text>
            <Text style={[s.payValue, { color: "#22c55e" }]}>{fmt(pay1)}</Text>
            <Text style={s.payDesc}>Sözleşme imzalanınca</Text>
          </View>
          <View style={[s.payBox, { borderColor: "#f59e0b" }]}>
            <Text style={s.payLabel}>Ara Ödeme (%30)</Text>
            <Text style={[s.payValue, { color: "#f59e0b" }]}>{fmt(pay2)}</Text>
            <Text style={s.payDesc}>Tasarım onayında</Text>
          </View>
          <View style={[s.payBox, { borderColor: "#3b82f6" }]}>
            <Text style={s.payLabel}>Bakiye (%30)</Text>
            <Text style={[s.payValue, { color: "#3b82f6" }]}>{fmt(pay3)}</Text>
            <Text style={s.payDesc}>Teslimatta</Text>
          </View>
        </View>

        {/* Notlar */}
        <View style={s.noteBox}>
          <Text style={s.noteText}>
            • Fiyatlar KDV hariçtir.{"\n"}
            • Bu teklif {validDate} tarihine kadar geçerlidir.{"\n"}
            • Teklif kabul edildikten sonra peşinat ödemesi ile proje başlatılır.{"\n"}
            • Proje süresi paket tipine göre 2-6 hafta arasında değişmektedir.
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Vorte Studio — Dijital Deneyimler</Text>
          <Text style={s.footerText}>studio.vorte.com.tr · studio@vorte.com.tr</Text>
        </View>
      </Page>
    </Document>
  );
}
