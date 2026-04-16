import type { Metadata } from "next";
import LegalLayout from "@/components/site/LegalLayout";

/**
 * Mesafeli Satış Sözleşmesi — 6502 sayılı Tüketicinin Korunması Hakkında Kanun
 * ve Mesafeli Sözleşmeler Yönetmeliği esas alınarak hazırlanmıştır.
 *
 * Kritik: Web tasarım süreç içeren hizmettir, "anında ifa" değildir.
 * Bu nedenle tüketici 14 gün cayma hakkına sahiptir ANCAK peşinat ödemesi
 * + portal aktivasyonu ile hizmet ifasının başlamasına açık onay verildiği
 * kabul edilir, bu durumda cayma hakkı sona erer (m.15/1-ğ uyarınca).
 */

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | Vorte Studio",
  description:
    "Vorte Studio mesafeli satış sözleşmesi. Web tasarım ve yazılım hizmetlerinde tarafların hak ve yükümlülükleri, ödeme, teslim, cayma hakkı.",
  robots: { index: true, follow: true },
};

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" lastUpdated="7 Nisan 2026">
      <p>
        İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), 6502 sayılı Tüketicinin
        Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
        çerçevesinde düzenlenmiştir. Tüketici sıfatıyla hizmet alan kişiler
        (&quot;Alıcı&quot;) ile aşağıda bilgileri yer alan Satıcı arasında, Alıcı&apos;nın
        vortestudio.com üzerinden teklif onaylaması ve sözleşmeyi kabul etmesi
        ile elektronik ortamda kurulur.
      </p>

      <h2>1. Taraflar</h2>
      <h3>1.1. Satıcı</h3>
      <table>
        <tbody>
          <tr>
            <th>Ticari Ünvan</th>
            <td>İbrahim Yaşar — Vorte Studio (Şahıs Şirketi)</td>
          </tr>
          <tr>
            <th>T.C. Kimlik No</th>
            <td>46594013798</td>
          </tr>
          <tr>
            <th>Adres</th>
            <td>
              Mansuroğlu Mah., Ankara Caddesi No:81/012, Bayraklı Tower,
              35030 Bayraklı / İzmir
            </td>
          </tr>
          <tr>
            <th>Telefon</th>
            <td>0543 188 34 25</td>
          </tr>
          <tr>
            <th>E-posta</th>
            <td>
              <a href="mailto:info@vortestudio.com">info@vortestudio.com</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>1.2. Alıcı</h3>
      <p>
        Alıcı&apos;nın ad-soyad/ticari ünvan, T.C. kimlik/vergi numarası, adres,
        telefon ve e-posta bilgileri, teklif kabul ekranında Alıcı tarafından
        sağlanmış olup kurulan sözleşmenin ayrılmaz parçasını oluşturur.
      </p>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu Sözleşme, Alıcı&apos;nın Satıcı&apos;ya ait vortestudio.com web sitesinden
        elektronik ortamda sipariş verdiği, aşağıda nitelikleri ve satış fiyatı
        belirtilen <strong>web tasarım, yazılım geliştirme, hosting ve bakım
        hizmetlerinin</strong> sunumu ile ilgili olarak tarafların hak ve
        yükümlülüklerinin belirlenmesine ilişkindir.
      </p>

      <h2>3. Hizmet Bilgileri ve Fiyatlandırma</h2>
      <p>
        Alıcı tarafından seçilen paketin içeriği, kapsamı ve toplam bedeli,
        teklif sayfasında ve portal üzerinden Alıcı&apos;ya açıkça bildirilmiştir.
        Paketler genel olarak aşağıdaki gibidir:
      </p>
      <table>
        <thead>
          <tr>
            <th>Paket</th>
            <th>Kapsam</th>
            <th>Yıllık Hosting</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Starter</td>
            <td>Tanıtım / portföy / katalog sitesi</td>
            <td>2.490 ₺</td>
          </tr>
          <tr>
            <td>Profesyonel</td>
            <td>Randevu / rezervasyon sistemi</td>
            <td>4.490 ₺</td>
          </tr>
          <tr>
            <td>E-Ticaret</td>
            <td>Online satış platformu</td>
            <td>8.190 ₺</td>
          </tr>
        </tbody>
      </table>
      <p>
        Fiyatlar KDV hariç olup, yürürlükteki KDV oranları ekleme ile
        faturalandırılır. Proje bazlı tasarım ve geliştirme ücretleri, teklif
        aşamasında Alıcı&apos;ya ayrıca bildirilir.
      </p>

      <h2>4. Ödeme Koşulları</h2>
      <p>Ödemeler 3 (üç) aşamalı olarak tahsil edilir:</p>
      <ul>
        <li>
          <strong>Peşinat (%40):</strong> Sözleşmenin imzalanmasının ardından.
          Bu ödeme alındığında müşteri portalı aktif edilir ve logo/marka
          kimliği çalışmalarına başlanır.
        </li>
        <li>
          <strong>Ara ödeme (%30):</strong> Logo ve marka kimliği onaylandıktan
          sonra. Bu ödeme alındığında geliştirme aşaması başlar.
        </li>
        <li>
          <strong>Final ödeme (%30):</strong> Proje teslim öncesi, yayın
          aşamasında. Bu ödeme alındıktan sonra site canlıya alınır.
        </li>
      </ul>
      <p>
        Ödemeler, Satıcı tarafından Alıcı&apos;ya bildirilen banka hesabına (IBAN)
        havale/EFT yoluyla gerçekleştirilir. Kredi kartı ile ödeme şu an
        desteklenmemektedir.
      </p>

      <h2>5. Teslim Süresi</h2>
      <p>
        Hizmet teslim süresi, tam ödemenin alınması ve Alıcı tarafından
        gerekli tüm içeriklerin (metin, görsel, logo talepleri vb.)
        sağlanmasından itibaren aşağıdaki süreler içindedir:
      </p>
      <ul>
        <li>
          <strong>Starter paketi:</strong> 15 (onbeş) iş günü
        </li>
        <li>
          <strong>Profesyonel paketi:</strong> 30 (otuz) iş günü
        </li>
        <li>
          <strong>E-Ticaret paketi:</strong> 60 (altmış) iş günü
        </li>
      </ul>
      <p>
        Alıcı&apos;nın tasarım/geliştirme aşamalarındaki onay gecikmeleri ve
        içerik teslimindeki gecikmeler, teslim süresine eklenir. Satıcı,
        gecikme durumunda Alıcı&apos;yı portal üzerinden bilgilendirir.
      </p>

      <h2>6. Cayma Hakkı</h2>
      <p>
        Alıcı, Mesafeli Sözleşmeler Yönetmeliği m.9 uyarınca sözleşmenin
        kurulduğu tarihten itibaren <strong>14 (ondört) gün</strong> içerisinde
        hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden
        cayma hakkına sahiptir.
      </p>

      <div className="callout">
        <strong>Cayma hakkının sona ermesi:</strong> Mesafeli Sözleşmeler
        Yönetmeliği m.15/1-ğ uyarınca, &quot;cayma hakkı süresi sona ermeden
        önce, tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin
        sözleşmelerde&quot; cayma hakkı kullanılamaz.
        <br />
        <br />
        Bu çerçevede Alıcı, peşinat ödemesini yaparak ve müşteri portalını
        aktif kullanarak (logo seçimi, tasarım onayı vb.) hizmet ifasının
        başlamasına <strong>açık onay vermiş</strong> sayılır. Bu
        onayın verilmesi ile birlikte cayma hakkı sona erer.
      </div>

      <h3>6.1. Cayma Hakkının Kullanılması</h3>
      <p>
        Cayma hakkı süresi dolmadan ve hizmet ifası başlamadan önce Alıcı,
        cayma kararını{" "}
        <a href="mailto:info@vortestudio.com">info@vortestudio.com</a> adresine
        yazılı bildirim göndererek veya portal üzerinden mesaj ileterek
        kullanabilir. Cayma halinde, Alıcı tarafından yapılan ödemeler
        (henüz yapılmışsa) 14 gün içinde aynı ödeme yöntemi ile iade edilir.
      </p>

      <h2>7. Alıcı&apos;nın Yükümlülükleri</h2>
      <ul>
        <li>
          Hizmet ifası için gerekli tüm içerikleri (metin, logo, görsel,
          marka kimliği bilgileri) zamanında Satıcı&apos;ya sağlamak
        </li>
        <li>Ödemeleri belirlenen tarihlerde ve tam olarak yapmak</li>
        <li>
          Portal üzerinden iletilen tasarım ve geliştirme onaylarını makul
          süre içinde yanıtlamak (azami 7 gün)
        </li>
        <li>
          Alıcı tarafından sağlanan içeriklerin (metin, görsel, logo vb.)
          telif hakkı ve kullanım izinlerine sahip olmak
        </li>
        <li>
          Sağlanan içeriklerin Türkiye mevzuatına aykırı olmaması (hakaret,
          pornografi, yasadışı içerik vb. yasaktır)
        </li>
      </ul>

      <h2>8. Satıcı&apos;nın Yükümlülükleri</h2>
      <ul>
        <li>Sözleşme konusu hizmeti teslim sürelerine uygun olarak sunmak</li>
        <li>
          Alıcı&apos;nın talep ve sorularını portal üzerinden 48 saat içinde
          yanıtlamak
        </li>
        <li>
          Hizmetin teknik altyapısını (hosting, domain, SSL sertifikası)
          ilk yıl ücretsiz sağlamak ve yönetmek
        </li>
        <li>
          Alıcı&apos;nın kişisel verilerini KVKK ve gizlilik politikası
          çerçevesinde korumak
        </li>
        <li>
          Teslim edilen site/yazılımda 30 gün içinde tespit edilen hataları
          ücretsiz olarak gidermek
        </li>
      </ul>

      <h2>9. Ayıplı Hizmet ve Garanti</h2>
      <p>
        Satıcı, teslim edilen hizmetin sözleşmede belirtilen özelliklere
        uygun olduğunu garanti eder. Alıcı, teslim tarihinden itibaren
        30 (otuz) gün içinde tespit edilen ve Satıcı&apos;dan kaynaklanan hataları
        Satıcı&apos;ya bildirerek ücretsiz düzeltilmesini talep edebilir.
      </p>
      <p>
        Alıcı kaynaklı hatalar (yanlış içerik, eksik bilgi, talep
        değişiklikleri vb.), üçüncü taraf eklentilerden kaynaklanan sorunlar
        ve hosting süresi dolduktan sonraki sorunlar garanti kapsamı dışındadır.
      </p>

      <h2>10. Fikri Mülkiyet Hakları</h2>
      <ul>
        <li>
          <strong>Kaynak kod:</strong> Final ödemenin tamamlanması ile
          Alıcı&apos;ya özel olarak üretilen tasarım ve kaynak kodların
          kullanım hakkı Alıcı&apos;ya devredilir.
        </li>
        <li>
          <strong>Açık kaynak kütüphaneler:</strong> Kullanılan framework ve
          kütüphaneler (Next.js, React, Prisma vb.) kendi lisansları altında
          kalmaya devam eder.
        </li>
        <li>
          <strong>Referans hakkı:</strong> Satıcı, tamamlanmış projeyi portföy
          olarak kendi web sitesinde sergileme hakkını saklı tutar. Alıcı
          bu hakkı reddederse sözleşme aşamasında yazılı olarak bildirmelidir.
        </li>
        <li>
          <strong>Marka varlıkları:</strong> Tasarlanan logo ve marka kimliği
          final ödeme sonrası Alıcı&apos;ya ait olur, Alıcı bunları ticari olarak
          kullanma hakkına sahiptir.
        </li>
      </ul>

      <h2>11. Mücbir Sebep</h2>
      <p>
        Tarafların kontrolü dışında gelişen ve önceden öngörülemeyen olaylar
        (deprem, sel, yangın, salgın hastalık, savaş, terör, genel grev,
        internet altyapısında yaşanan kesintiler, resmi makamların
        kararları vb.) mücbir sebep sayılır.
      </p>
      <p>
        Mücbir sebep durumunda Satıcı, yükümlülüklerini yerine getirmekten
        makul ölçüde muaf tutulur. Mücbir sebebin 30 (otuz) günden fazla
        devam etmesi halinde taraflardan her biri sözleşmeyi tek taraflı
        olarak feshedebilir. Bu durumda henüz ifa edilmemiş hizmetler için
        alınmış ödemeler Alıcı&apos;ya iade edilir.
      </p>

      <h2>12. Sözleşmenin Feshi</h2>
      <ul>
        <li>
          Alıcı&apos;nın ödemelerini 15 günden fazla geciktirmesi halinde Satıcı
          sözleşmeyi tek taraflı feshedebilir ve o aşamaya kadar tahsil
          edilen ödemeler iade edilmez.
        </li>
        <li>
          Alıcı, tasarım aşamasında çekilmek isterse, o aşamaya kadar yapılan
          iş karşılığı peşinat iade edilmez; ancak ara ödeme ve final ödeme
          tahsil edilmez.
        </li>
      </ul>

      <h2>13. Kişisel Verilerin Korunması</h2>
      <p>
        Satıcı, Alıcı&apos;nın kişisel verilerini KVKK ve yürürlükteki mevzuat
        kapsamında işler. Detaylı bilgi için{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> ve{" "}
        <a href="/gizlilik-politikasi">Gizlilik Politikası</a> sayfalarını
        inceleyebilirsiniz.
      </p>

      <h2>14. Uyuşmazlıkların Çözümü</h2>
      <p>
        İşbu Sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret
        Bakanlığı&apos;nca her yıl belirlenen parasal sınırlar dahilinde Alıcı&apos;nın
        mal veya hizmeti satın aldığı veya ikametgahının bulunduğu yerdeki{" "}
        <strong>Tüketici Hakem Heyetleri</strong> ile{" "}
        <strong>Tüketici Mahkemeleri</strong> yetkilidir. Ticari satış
        ilişkilerinde{" "}
        <strong>İzmir Mahkemeleri ve İcra Daireleri</strong> yetkilidir.
      </p>

      <h2>15. Yürürlük</h2>
      <p>
        İşbu Sözleşme, Alıcı tarafından elektronik ortamda onaylanması ve
        peşinat ödemesinin tamamlanması ile yürürlüğe girer. Sözleşmenin
        bir kopyası Alıcı&apos;nın portal hesabında kalıcı olarak saklanır ve
        e-posta ile Alıcı&apos;ya iletilir.
      </p>

      <div className="callout">
        İşbu Sözleşme 15 (onbeş) maddeden ibaret olup, taraflarca her sayfası
        ayrı ayrı okunup, elektronik ortamda onaylanarak yürürlüğe girmiştir.
      </div>
    </LegalLayout>
  );
}
