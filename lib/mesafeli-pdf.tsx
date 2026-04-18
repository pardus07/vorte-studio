import React from "react";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

// ─────────────────────────────────────────────────────────────────────────
// Mesafeli Satış Sözleşmesi PDF üretici
// ─────────────────────────────────────────────────────────────────────────
// 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
// Yönetmeliği uyarınca, mesafeli sözleşmenin bir örneği tüketiciye KALICI
// VERİ SAKLAYICISI üzerinden iletilmelidir (Yönetmelik m.5/1-a ve m.6).
// Bu dosya, sözleşme imzalandığında otomatik olarak PDF üretir ve email
// ekine konulur.
//
// İçerik app/(site)/mesafeli-satis-sozlesmesi/page.tsx ile senkron — satıcı
// bilgileri ve hükümler orada güncellenirse burası da güncellenmelidir.
// ─────────────────────────────────────────────────────────────────────────

const fontsDir = path.join(process.cwd(), "fonts");
Font.register({
  family: "DMSans",
  fonts: [
    { src: path.join(fontsDir, "DMSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "DMSans-Bold.ttf"), fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

// fi/fl ligature fix — bkz. contract-pdf.tsx açıklaması
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
  logo: { fontSize: 16, fontWeight: 700, color: "#FF4500" },
  logoSub: { fontSize: 8, color: "#999", marginTop: 2 },
  title: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  intro: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: "#333",
    marginBottom: 10,
    textAlign: "justify",
  },
  h2: {
    fontSize: 10,
    fontWeight: 700,
    color: "#FF4500",
    marginTop: 10,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  h3: { fontSize: 9, fontWeight: 700, marginTop: 6, marginBottom: 3 },
  p: { fontSize: 8.5, lineHeight: 1.6, color: "#333", marginBottom: 4, textAlign: "justify" },
  li: { fontSize: 8.5, lineHeight: 1.5, color: "#333", marginBottom: 2, paddingLeft: 10 },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: { fontSize: 8.5, color: "#666", width: 120 },
  infoValue: { fontSize: 8.5, fontWeight: 700, color: "#1a1a1a", flex: 1 },
  callout: {
    marginTop: 6,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#fef3c7",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    borderRadius: 2,
  },
  calloutText: { fontSize: 8, lineHeight: 1.5, color: "#78350f" },
  metadata: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  metaText: { fontSize: 7, color: "#999", marginBottom: 1 },
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
});

export interface MesafeliPDFData {
  firmName: string;
  signerName: string;
  signerEmail: string;
  signerCompany?: string;
  signedAt: string;
  signerIp: string;
  signerAgent: string;
  contractHash: string;
  packagePlan?: string; // Starter / Profesyonel / E-Ticaret
  totalPrice: number;
  ownerName: string;
}

const fmt = (n: number) => n.toLocaleString("tr-TR");

function MesafeliPDF({ data }: { data: MesafeliPDFData }) {
  return (
    <Document>
      {/* SAYFA 1 — Giriş, Taraflar, Konu, Fiyat */}
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

        <Text style={styles.title}>{nl("MESAFELİ SATIŞ SÖZLEŞMESİ")}</Text>

        <Text style={styles.intro}>
          {nl(
            `İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri çerçevesinde düzenlenmiştir. Tüketici sıfatıyla hizmet alan kişiler ("Alıcı") ile aşağıda bilgileri yer alan Satıcı arasında, Alıcı'nın vortestudio.com üzerinden teklif onaylaması ve sözleşmeyi kabul etmesi ile elektronik ortamda kurulur.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("1. TARAFLAR")}</Text>

        <Text style={styles.h3}>{nl("1.1. Satıcı")}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{nl("Ticari Ünvan")}</Text>
          <Text style={styles.infoValue}>{nl("İbrahim Yaşar — Vorte Studio (Şahıs Şirketi)")}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>T.C. Kimlik No</Text>
          <Text style={styles.infoValue}>46594013798</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Adres</Text>
          <Text style={styles.infoValue}>
            {nl("Mansuroğlu Mah., Ankara Caddesi No:81/012, Bayraklı Tower, 35030 Bayraklı / İzmir")}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefon</Text>
          <Text style={styles.infoValue}>0543 188 34 25</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>E-posta</Text>
          <Text style={styles.infoValue}>info@vortestudio.com</Text>
        </View>

        <Text style={styles.h3}>{nl("1.2. Alıcı")}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{nl("Ad Soyad")}</Text>
          <Text style={styles.infoValue}>{nl(data.signerName)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{nl("Firma / Ünvan")}</Text>
          <Text style={styles.infoValue}>{nl(data.signerCompany || data.firmName)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>E-posta</Text>
          <Text style={styles.infoValue}>{data.signerEmail}</Text>
        </View>

        <Text style={styles.h2}>{nl("2. SÖZLEŞMENİN KONUSU")}</Text>
        <Text style={styles.p}>
          {nl(
            `İşbu Sözleşme, Alıcı'nın Satıcı'ya ait vortestudio.com web sitesinden elektronik ortamda sipariş verdiği web tasarım, yazılım geliştirme, hosting ve bakım hizmetlerinin sunumu ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesine ilişkindir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("3. HİZMET BİLGİLERİ VE FİYAT")}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Paket</Text>
          <Text style={styles.infoValue}>{nl(data.packagePlan || "Teklife göre")}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{nl("Toplam Bedel (KDV hariç)")}</Text>
          <Text style={styles.infoValue}>{fmt(data.totalPrice)} TL</Text>
        </View>
        <Text style={[styles.p, { marginTop: 6, color: "#666" }]}>
          {nl(
            `Alıcı tarafından seçilen paketin içeriği, kapsamı ve toplam bedeli, teklif sayfasında ve portal üzerinden Alıcı'ya açıkça bildirilmiştir. Yürürlükteki KDV oranları eklenerek faturalandırılır.`
          )}
        </Text>

        <Text style={styles.footer} fixed>
          {nl("Vorte Studio · vortestudio.com · Mesafeli Satış Sözleşmesi")}
        </Text>
      </Page>

      {/* SAYFA 2 — Ödeme, Teslim, Cayma Hakkı, Yükümlülükler */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTE STUDIO</Text>
          <Text style={{ fontSize: 8, color: "#999" }}>{nl("Mesafeli Satış · Sayfa 2")}</Text>
        </View>

        <Text style={styles.h2}>{nl("4. ÖDEME KOŞULLARI")}</Text>
        <Text style={styles.p}>{nl("Ödemeler 3 (üç) aşamalı olarak tahsil edilir:")}</Text>
        <Text style={styles.li}>
          {nl("• Peşinat (%40): Sözleşme imzalandıktan sonra. Portal aktif edilir.")}
        </Text>
        <Text style={styles.li}>
          {nl("• Ara ödeme (%30): Logo/marka kimliği onaylandıktan sonra. Geliştirme başlar.")}
        </Text>
        <Text style={styles.li}>
          {nl("• Final ödeme (%30): Yayın öncesi. Ödeme sonrası site canlıya alınır.")}
        </Text>
        <Text style={[styles.p, { marginTop: 4 }]}>
          {nl(
            `Ödemeler, Satıcı tarafından Alıcı'ya bildirilen banka hesabına (IBAN) havale/EFT yoluyla gerçekleştirilir. Kredi kartı ile ödeme şu an desteklenmemektedir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("5. TESLİM SÜRESİ")}</Text>
        <Text style={styles.p}>
          {nl(
            `Hizmet teslim süresi, tam ödemenin alınması ve Alıcı tarafından gerekli tüm içeriklerin sağlanmasından itibaren: Starter 15 iş günü, Profesyonel 30 iş günü, E-Ticaret 60 iş günü. Alıcı'nın onay veya içerik teslim gecikmeleri süreye eklenir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("6. CAYMA HAKKI")}</Text>
        <Text style={styles.p}>
          {nl(
            `Alıcı, Mesafeli Sözleşmeler Yönetmeliği m.9 uyarınca sözleşmenin kurulduğu tarihten itibaren 14 (ondört) gün içerisinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.`
          )}
        </Text>

        <View style={styles.callout}>
          <Text style={[styles.calloutText, { fontWeight: 700, marginBottom: 3 }]}>
            {nl("Cayma hakkının sona ermesi:")}
          </Text>
          <Text style={styles.calloutText}>
            {nl(
              `Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ uyarınca, cayma hakkı süresi sona ermeden önce tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin sözleşmelerde cayma hakkı kullanılamaz. Alıcı, peşinat ödemesini yaparak ve portalı aktif kullanarak hizmet ifasının başlamasına açık onay vermiş sayılır; bu onayın verilmesi ile cayma hakkı sona erer.`
            )}
          </Text>
        </View>

        <Text style={styles.p}>
          {nl(
            `Cayma hakkı süresi dolmadan ve hizmet ifası başlamadan önce Alıcı, cayma kararını info@vortestudio.com adresine yazılı bildirim göndererek veya portal üzerinden mesaj ileterek kullanabilir. Cayma halinde, Alıcı tarafından yapılan ödemeler 14 gün içinde aynı ödeme yöntemi ile iade edilir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("7. ALICI VE SATICININ YÜKÜMLÜLÜKLERİ")}</Text>
        <Text style={styles.p}>
          {nl(
            `Alıcı, hizmet ifası için gerekli içerikleri zamanında sağlamak, ödemeleri belirlenen tarihlerde yapmak, tasarım ve geliştirme onaylarını azami 7 gün içinde yanıtlamak ve sağladığı içeriklerin telif hakkına sahip olduğunu taahhüt etmekle yükümlüdür.`
          )}
        </Text>
        <Text style={styles.p}>
          {nl(
            `Satıcı, hizmeti teslim sürelerine uygun olarak sunmak, portal üzerinden iletilen soruları 48 saat içinde yanıtlamak, hosting/domain/SSL'i ilk yıl ücretsiz sağlamak, Alıcı'nın kişisel verilerini KVKK çerçevesinde korumak ve teslim edilen üründe 30 gün içinde tespit edilen hataları ücretsiz gidermekle yükümlüdür.`
          )}
        </Text>

        <Text style={styles.footer} fixed>
          {nl("Vorte Studio · vortestudio.com · Mesafeli Satış Sözleşmesi")}
        </Text>
      </Page>

      {/* SAYFA 3 — Fikri Mülkiyet, Uyuşmazlık, Yürürlük, İmza Metadata */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTE STUDIO</Text>
          <Text style={{ fontSize: 8, color: "#999" }}>{nl("Mesafeli Satış · Sayfa 3")}</Text>
        </View>

        <Text style={styles.h2}>{nl("8. AYIPLI HİZMET VE GARANTİ")}</Text>
        <Text style={styles.p}>
          {nl(
            `Alıcı, teslim tarihinden itibaren 30 gün içinde tespit edilen ve Satıcı'dan kaynaklanan hataları bildirerek ücretsiz düzeltilmesini talep edebilir. Alıcı kaynaklı hatalar, üçüncü taraf eklentilerden kaynaklanan sorunlar ve hosting süresi dolduktan sonraki sorunlar garanti kapsamı dışındadır.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("9. FİKRİ MÜLKİYET HAKLARI")}</Text>
        <Text style={styles.p}>
          {nl(
            `Final ödemenin tamamlanması ile Alıcı'ya özel üretilen tasarım ve kaynak kodların kullanım hakkı Alıcı'ya devredilir. Kullanılan açık kaynak framework ve kütüphaneler (Next.js, React, Prisma vb.) kendi lisansları altında kalmaya devam eder. Satıcı, tamamlanmış projeyi portföy olarak sergileme hakkını saklı tutar; Alıcı bu hakkı reddederse sözleşme aşamasında yazılı olarak bildirmelidir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("10. MÜCBİR SEBEP")}</Text>
        <Text style={styles.p}>
          {nl(
            `Tarafların kontrolü dışında gelişen ve önceden öngörülemeyen olaylar (deprem, sel, yangın, salgın hastalık, savaş, terör, internet altyapısında yaşanan kesintiler, resmi makam kararları vb.) mücbir sebep sayılır. Mücbir sebebin 30 günden fazla devam etmesi halinde taraflardan her biri sözleşmeyi tek taraflı feshedebilir ve henüz ifa edilmemiş hizmetlere ait ödemeler iade edilir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("11. KİŞİSEL VERİLER")}</Text>
        <Text style={styles.p}>
          {nl(
            `Satıcı, Alıcı'nın kişisel verilerini 6698 sayılı KVKK ve yürürlükteki mevzuat kapsamında işler. Detaylı bilgi vortestudio.com/kvkk ve vortestudio.com/gizlilik-politikasi adreslerinde yer almaktadır.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("12. UYUŞMAZLIKLARIN ÇÖZÜMÜ")}</Text>
        <Text style={styles.p}>
          {nl(
            `İşbu Sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı'nca her yıl belirlenen parasal sınırlar dahilinde Alıcı'nın ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir. Ticari satış ilişkilerinde İzmir Mahkemeleri ve İcra Daireleri yetkilidir.`
          )}
        </Text>

        <Text style={styles.h2}>{nl("13. YÜRÜRLÜK")}</Text>
        <Text style={styles.p}>
          {nl(
            `İşbu Sözleşme, Alıcı tarafından elektronik ortamda onaylanması ve peşinat ödemesinin tamamlanması ile yürürlüğe girer. Sözleşmenin bir kopyası Alıcı'nın portal hesabında kalıcı olarak saklanır ve e-posta ile Alıcı'ya iletilir.`
          )}
        </Text>

        {/* İmza metadata — Hukuki delil */}
        <View style={styles.metadata}>
          <Text style={{ fontSize: 8, fontWeight: 700, marginBottom: 4 }}>
            {nl("ELEKTRONİK ONAY METADATA (Hukuki Delil — HMK m.193)")}
          </Text>
          <Text style={styles.metaText}>{nl(`Alıcı           : ${data.signerName}`)}</Text>
          <Text style={styles.metaText}>{nl(`Onay Tarihi     : ${data.signedAt}`)}</Text>
          <Text style={styles.metaText}>IP Adresi       : {data.signerIp}</Text>
          <Text style={styles.metaText}>{nl(`Cihaz Bilgisi   : ${data.signerAgent}`)}</Text>
          <Text style={styles.metaText}>{nl(`Sözleşme Hash   : ${data.contractHash}`)}</Text>
          <Text style={[styles.metaText, { marginTop: 4 }]}>
            {nl(
              `Alıcı, web sitesi üzerinden "Mesafeli Satış Sözleşmesini okudum, kabul ediyorum" kutusunu işaretleyerek bu sözleşmeyi kabul etmiştir. Yukarıdaki metadata bilgileri HMK m.193 uyarınca kesin delil niteliğindedir.`
            )}
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          {nl("Vorte Studio · vortestudio.com · Mesafeli Satış Sözleşmesi")}
        </Text>
      </Page>
    </Document>
  );
}

/** Mesafeli Satış Sözleşmesi PDF'ini Buffer olarak üret */
export async function generateMesafeliPDF(data: MesafeliPDFData): Promise<Buffer> {
  const buffer = await renderToBuffer(<MesafeliPDF data={data} />);
  return Buffer.from(buffer);
}
