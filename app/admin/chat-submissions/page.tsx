import { getChatSubmissions } from "@/actions/chat-submissions";
import SubmissionsDashboard from "./submissions-dashboard";

export const dynamic = "force-dynamic";

export default async function ChatSubmissionsPage() {
  const submissions = await getChatSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Chatbot Başvuruları</h1>
        <p className="mt-1 text-[13px] text-admin-muted">
          Demo sayfalarından gelen tüm chatbot başvuruları. Başvuruları
          inceleyin ve lead&apos;lere dönüştürün.
        </p>
      </div>
      <SubmissionsDashboard initialData={submissions} />
    </div>
  );
}
