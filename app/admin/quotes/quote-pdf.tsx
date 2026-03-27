import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  logo: { fontSize: 18, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  logoDot: { color: "#f97316" },
  contact: { textAlign: "right", fontSize: 9, color: "#666" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", fontFamily: "Helvetica-Bold", marginBottom: 8, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
  rowLabel: { fontSize: 10, color: "#444" },
  rowValue: { fontSize: 10, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, marginTop: 4, borderTopWidth: 2, borderTopColor: "#f97316" },
  totalLabel: { fontSize: 13, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  totalValue: { fontSize: 13, fontWeight: "bold", fontFamily: "Helvetica-Bold", color: "#f97316" },
  paymentGrid: { flexDirection: "row", gap: 8, marginTop: 8 },
  payBox: { flex: 1, padding: 10, backgroundColor: "#f8f8f8", borderRadius: 4, textAlign: "center" },
  payLabel: { fontSize: 8, color: "#888", marginBottom: 4 },
  payValue: { fontSize: 11, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#999", borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 8 },
  note: { fontSize: 9, color: "#888", fontStyle: "italic", marginTop: 6 },
  clientBox: { backgroundColor: "#f8f8f8", padding: 12, borderRadius: 4, marginBottom: 20 },
  clientName: { fontSize: 12, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  clientSub: { fontSize: 9, color: "#666", marginTop: 2 },
});

const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

export default function QuotePDF({
  clientName,
  packageName,
  packagePrice,
  addons,
  total,
}: {
  clientName: string;
  packageName: string;
  packagePrice: number;
  addons: { name: string; price: number }[];
  total: number;
}) {
  const pay1 = Math.round(total * 0.4);
  const pay2 = Math.round(total * 0.3);
  const pay3 = total - pay1 - pay2;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>
            VORTE<Text style={s.logoDot}>.</Text>STUDIO
          </Text>
          <View style={s.contact}>
            <Text>studio@vorte.com.tr</Text>
            <Text>studio.vorte.com.tr</Text>
            <Text>Antalya, Turkiye</Text>
          </View>
        </View>

        {/* Client */}
        <View style={s.clientBox}>
          <Text style={s.clientName}>{clientName}</Text>
          <Text style={s.clientSub}>Teklif Tarihi: {new Date().toLocaleDateString("tr-TR")}</Text>
        </View>

        {/* Package Details */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Paket Detayi</Text>
          <View style={s.row}>
            <Text style={s.rowLabel}>{packageName}</Text>
            <Text style={s.rowValue}>{fmt(packagePrice)}</Text>
          </View>
          {addons.map((a) => (
            <View key={a.name} style={s.row}>
              <Text style={s.rowLabel}>+ {a.name}</Text>
              <Text style={s.rowValue}>{fmt(a.price)}</Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>TOPLAM</Text>
            <Text style={s.totalValue}>{fmt(total)}</Text>
          </View>
          <Text style={s.note}>* Fiyatlar KDV haric belirtilmistir.</Text>
        </View>

        {/* Payment Plan */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Odeme Takvimi (%40 / %30 / %30)</Text>
          <View style={s.paymentGrid}>
            <View style={s.payBox}>
              <Text style={s.payLabel}>Pesinat</Text>
              <Text style={[s.payValue, { color: "#22c55e" }]}>{fmt(pay1)}</Text>
            </View>
            <View style={s.payBox}>
              <Text style={s.payLabel}>Ara Odeme</Text>
              <Text style={[s.payValue, { color: "#f59e0b" }]}>{fmt(pay2)}</Text>
            </View>
            <View style={s.payBox}>
              <Text style={s.payLabel}>Bakiye</Text>
              <Text style={[s.payValue, { color: "#3b82f6" }]}>{fmt(pay3)}</Text>
            </View>
          </View>
        </View>

        {/* Validity */}
        <View style={s.section}>
          <Text style={{ fontSize: 9, color: "#888" }}>
            Bu teklif 30 gun gecerlidir. Teklif kabul edildikten sonra pesinat odemesi ile proje baslatilir.
          </Text>
        </View>

        {/* Footer */}
        <Text style={s.footer}>
          Vorte Studio · studio.vorte.com.tr · Dijital Deneyimler
        </Text>
      </Page>
    </Document>
  );
}
