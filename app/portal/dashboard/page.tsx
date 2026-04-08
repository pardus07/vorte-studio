import { getPortalDashboard } from "@/actions/portal";
import PortalDashboardView from "@/components/portal/PortalDashboardView";
import PortalDataError from "@/components/portal/PortalDataError";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  let data = null;
  try {
    data = await getPortalDashboard();
  } catch {
    data = null;
  }

  // NOT: Eskiden burada `redirect("/portal/giris")` vardı ama middleware
  // giriş sayfasından logged-in portal kullanıcısını dashboard'a geri
  // attığı için sonsuz redirect döngüsü oluşuyordu. Artık hata ekranı
  // gösteriyoruz; kullanıcı "çıkış yap" ile oturumu temizleyebilir.
  if (!data) return <PortalDataError />;

  return <PortalDashboardView data={data} />;
}
