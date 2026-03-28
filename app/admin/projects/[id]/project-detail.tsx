"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMilestone, addMilestone, deleteMilestone, updateProject, updateProjectStatus } from "@/actions/projects";

type Milestone = { id: string; title: string; completed: boolean; completedAt: string | null };
type Payment = { id: string; amount: number; type: string; status: string; dueDate: string; paidAt: string | null; invoiceNo: string | null };
type Activity = { id: string; type: string; description: string; createdAt: string };

type ProjectData = {
  id: string; title: string; clientId: string; clientName: string; type: string;
  status: string; budget: number; progress: number; techStack: string[];
  startDate: string | null; deadline: string | null; notes: string | null;
  milestones: Milestone[]; payments: Payment[]; activities: Activity[];
};

const statusConfig: Record<string, { label: string; color: string }> = {
  DISCOVERY: { label: "Keşif", color: "bg-admin-purple-dim text-admin-purple" },
  DESIGN: { label: "Tasarım", color: "bg-admin-amber-dim text-admin-amber" },
  DEVELOPMENT: { label: "Geliştirme", color: "bg-admin-blue-dim text-admin-blue" },
  TESTING: { label: "Test", color: "bg-admin-green-dim text-admin-green" },
  DELIVERED: { label: "Teslim", color: "bg-admin-green-dim text-admin-green" },
  ARCHIVED: { label: "Arşiv", color: "bg-admin-red-dim text-admin-red" },
};

const typeLabels: Record<string, string> = {
  WEBSITE: "Web Sitesi", ECOMMERCE: "E-Ticaret", MOBILE_APP: "Mobil Uygulama",
  REDESIGN: "Yeniden Tasarım", CUSTOM: "Özel Proje",
};

const paymentBadge: Record<string, { label: string; color: string }> = {
  PAID: { label: "Ödendi", color: "bg-admin-green-dim text-admin-green" },
  PENDING: { label: "Bekliyor", color: "bg-admin-amber-dim text-admin-amber" },
  OVERDUE: { label: "Gecikmiş", color: "bg-admin-red-dim text-admin-red" },
  CANCELLED: { label: "İptal", color: "bg-admin-red-dim text-admin-red" },
};

const paymentTypeLabel: Record<string, string> = {
  DEPOSIT: "Peşinat", MILESTONE: "Aşama", FINAL: "Final", MAINTENANCE: "Bakım",
};

export default function ProjectDetailView({ project }: { project: ProjectData }) {
  const router = useRouter();
  const [milestones, setMilestones] = useState(project.milestones);
  const [progress, setProgress] = useState(project.progress);
  const [notes, setNotes] = useState(project.notes || "");
  const [newMilestone, setNewMilestone] = useState("");
  const [saving, setSaving] = useState(false);

  const st = statusConfig[project.status] || statusConfig.DISCOVERY;
  const progressColor = progress >= 80 ? "var(--color-admin-green)" : progress >= 50 ? "var(--color-admin-blue)" : "var(--color-admin-amber)";

  async function toggleMilestone(id: string, current: boolean) {
    setMilestones((prev) => prev.map((m) => m.id === id ? { ...m, completed: !current } : m));
    const newCompleted = milestones.filter((m) => m.id === id ? !current : m.completed).length;
    setProgress(Math.round((newCompleted / milestones.length) * 100));
    await updateMilestone(id, !current);
  }

  async function handleAddMilestone() {
    if (!newMilestone.trim()) return;
    await addMilestone(project.id, newMilestone.trim());
    setNewMilestone("");
    router.refresh();
  }

  async function handleDeleteMilestone(id: string) {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    await deleteMilestone(id);
  }

  async function saveNotes() {
    setSaving(true);
    await updateProject(project.id, { notes });
    setSaving(false);
  }

  async function changeStatus(newStatus: string) {
    await updateProjectStatus(project.id, newStatus);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <button onClick={() => router.push("/admin/projects")} className="text-[12px] text-admin-muted hover:text-admin-text">← Projeler</button>

      {/* Başlık kartı */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] font-semibold text-admin-text">{project.title}</h2>
              <select value={project.status} onChange={(e) => changeStatus(e.target.value)}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border-0 cursor-pointer ${st.color}`}>
                {Object.entries(statusConfig).map(([val, { label }]) => (<option key={val} value={val}>{label}</option>))}
              </select>
            </div>
            <div className="mt-1 text-[13px] text-admin-muted">{project.clientName} · {typeLabels[project.type]}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded border border-admin-border px-2 py-0.5 text-[10px] text-admin-muted">{tech}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-admin-muted">Bütçe</div>
            <div className="text-[20px] font-bold text-admin-accent">₺{project.budget.toLocaleString("tr-TR")}</div>
            {project.deadline && (
              <div className="text-[11px] text-admin-muted">Teslim: {new Date(project.deadline).toLocaleDateString("tr-TR")}</div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-admin-muted">İlerleme</span>
            <span className="font-bold" style={{ color: progressColor }}>%{progress}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-admin-bg4">
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: progressColor }} />
          </div>
        </div>
      </div>

      {/* İki sütun */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Milestones */}
        <div className="rounded-xl border border-admin-border bg-admin-bg2">
          <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
            <span className="text-[13px] font-medium">Milestone&apos;lar</span>
            <span className="text-[11px] text-admin-muted">{milestones.filter((m) => m.completed).length}/{milestones.length}</span>
          </div>
          <div className="divide-y divide-admin-border">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                <button onClick={() => toggleMilestone(m.id, m.completed)}
                  className={`h-4 w-4 shrink-0 rounded border text-center text-[9px] leading-[16px] transition-colors ${
                    m.completed ? "border-admin-green bg-admin-green text-white" : "border-admin-border hover:border-admin-accent"
                  }`}>✓</button>
                <span className={`flex-1 text-[12px] ${m.completed ? "text-admin-muted line-through" : ""}`}>{m.title}</span>
                <button onClick={() => handleDeleteMilestone(m.id)} className="text-admin-muted hover:text-admin-red text-[12px]">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-3">
            <input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
              placeholder="Yeni milestone ekle..." className="flex-1 rounded-lg border border-admin-border bg-admin-bg3 px-3 py-1.5 text-[11px] text-admin-text focus:border-admin-accent focus:outline-none" />
            <button onClick={handleAddMilestone} className="rounded-lg bg-admin-accent px-3 py-1.5 text-[10px] font-medium text-white hover:brightness-110">Ekle</button>
          </div>
        </div>

        {/* Ödemeler + Notlar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-admin-border bg-admin-bg2">
            <div className="border-b border-admin-border px-4 py-3"><span className="text-[13px] font-medium">Ödemeler</span></div>
            <div className="divide-y divide-admin-border">
              {project.payments.length === 0 && <div className="px-4 py-6 text-center text-[12px] text-admin-muted">Ödeme kaydı yok</div>}
              {project.payments.map((p) => {
                const badge = paymentBadge[p.status] || paymentBadge.PENDING;
                return (
                  <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <div className="text-[12px] font-medium">{paymentTypeLabel[p.type] || p.type}</div>
                      <div className="text-[10px] text-admin-muted">{new Date(p.dueDate).toLocaleDateString("tr-TR")}{p.invoiceNo ? ` · ${p.invoiceNo}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium">₺{p.amount.toLocaleString("tr-TR")}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${badge.color}`}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-admin-border bg-admin-bg2 p-4">
            <div className="mb-2 text-[13px] font-medium">Notlar</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              className="w-full rounded-lg border border-admin-border bg-admin-bg3 px-3 py-2 text-[12px] text-admin-text focus:border-admin-accent focus:outline-none" placeholder="Proje notları..." />
            <div className="mt-2 flex justify-end">
              <button onClick={saveNotes} disabled={saving || notes === (project.notes || "")}
                className="rounded-lg bg-admin-accent px-4 py-1.5 text-[11px] font-medium text-white hover:brightness-110 disabled:opacity-40">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Aktivite */}
      <div className="rounded-xl border border-admin-border bg-admin-bg2">
        <div className="border-b border-admin-border px-4 py-3"><span className="text-[13px] font-medium">Aktivite Geçmişi</span></div>
        <div className="divide-y divide-admin-border">
          {project.activities.length === 0 && <div className="px-4 py-6 text-center text-[12px] text-admin-muted">Henüz aktivite yok</div>}
          {project.activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-2.5">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-admin-accent" />
              <div>
                <div className="text-[12px]">{a.description}</div>
                <div className="text-[10px] text-admin-muted">{new Date(a.createdAt).toLocaleDateString("tr-TR")} · {new Date(a.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
