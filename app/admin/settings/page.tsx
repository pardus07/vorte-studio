import { getSettings } from "@/actions/settings";
import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Site Ayarları</h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          Public sitede görünen iletişim bilgileri ve sosyal medya bağlantıları.
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
