"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMilestone, updateProjectStatus } from "@/actions/projects";
import ProjectFormModal from "./project-form-modal";

type Milestone = { id: string; title: string; completed: boolean };
type Project = {
  id: string; title: string; clientId: string; clientName: string; type: string;
  status: string; budget: number; progress: number; techStack: string[];
  deadline: string | null; notes: string | null; milestones: Milestone[];
};
type Client = { id: string; name: string };

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

const statusList = Object.entries(statusConfig).map(([value, { label }]) => ({ value, label }));

export default function ProjectList({ projects: initial, clients }: { projects: Project[]; clients: Client[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  async function handleMilestoneToggle(projectId: string, milestoneId: string, currentCompleted: boolean) {
    // Optimistic update
    setProjects((prev) => prev.map((p) => {
      if (p.id !== projectId) return p;
      const newMilestones = p.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !currentCompleted } : m
      );
      const completedCount = newMilestones.filter((m) => m.completed).length;
      const progress = Math.round((completedCount / newMilestones.length) * 100);
      return { ...p, milestones: newMilestones, progress };
    }));

    const result = await updateMilestone(milestoneId, !currentCompleted);
    if (!result.success) {
      setProjects(initial); // Rollback
    }
  }

  async function handleStatusChange(projectId: string, newStatus: string) {
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, status: newStatus } : p));
    await updateProjectStatus(projectId, newStatus);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-admin-muted">{projects.length} proje</span>
        <button onClick={() => setShowModal(true)} className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white hover:brightness-110 transition-colors">
          + Yeni Proje
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const st = statusConfig[project.status] || statusConfig.DISCOVERY;
          const progressColor = project.progress >= 80 ? "var(--color-admin-green)" : project.progress >= 50 ? "var(--color-admin-blue)" : "var(--color-admin-amber)";
          const daysLeft = project.deadline ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

          return (
            <div key={project.id} className="rounded-xl border border-admin-border bg-admin-bg2 p-5 transition-colors hover:border-admin-border2">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <button onClick={() => router.push(`/admin/projects/${project.id}`)} className="text-left text-[13px] font-semibold hover:text-admin-accent transition-colors">
                    {project.title}
                  </button>
                  <p className="mt-0.5 text-[11px] text-admin-muted">
                    {project.clientName} · {typeLabels[project.type] || project.type}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <select value={project.status} onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium border-0 cursor-pointer ${st.color}`}
                    style={{ appearance: "none", WebkitAppearance: "none", paddingRight: 8 }}>
                    {statusList.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                  </select>
                  <button onClick={() => setEditProject(project)} className="text-admin-muted hover:text-admin-text text-[14px]" title="Düzenle">⋮</button>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-admin-muted">İlerleme</span>
                  <span className="font-medium" style={{ color: progressColor }}>%{project.progress}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-admin-bg4">
                  <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, background: progressColor }} />
                </div>
              </div>

              {/* Milestones */}
              <div className="mt-4 space-y-1.5">
                {project.milestones.map((m) => (
                  <button key={m.id} onClick={() => handleMilestoneToggle(project.id, m.id, m.completed)}
                    className="flex w-full items-center gap-2 text-[11px] text-left hover:bg-admin-bg3 rounded px-1 py-0.5 -mx-1 transition-colors">
                    <span className={`h-3.5 w-3.5 shrink-0 rounded border text-center text-[8px] leading-[14px] transition-colors ${
                      m.completed ? "border-admin-green bg-admin-green text-white" : "border-admin-border text-transparent hover:border-admin-accent"
                    }`}>✓</span>
                    <span className={m.completed ? "text-admin-muted line-through" : "text-admin-text"}>{m.title}</span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-admin-border pt-3">
                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded border border-admin-border px-1.5 py-0.5 text-[9px] text-admin-muted">{tech}</span>
                  ))}
                </div>
                <div className="text-right text-[11px]">
                  <div className="font-medium">₺{project.budget.toLocaleString("tr-TR")}</div>
                  {daysLeft !== null && (
                    <div className={`text-[10px] ${daysLeft <= 3 ? "text-admin-red" : daysLeft <= 7 ? "text-admin-amber" : "text-admin-muted"}`}>
                      {daysLeft > 0 ? `${daysLeft} gün kaldı` : daysLeft === 0 ? "Bugün teslim" : `${Math.abs(daysLeft)} gün gecikmiş`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modaller */}
      {showModal && <ProjectFormModal clients={clients} onClose={() => { setShowModal(false); router.refresh(); }} />}
      {editProject && (
        <ProjectFormModal
          clients={clients}
          editData={{
            id: editProject.id,
            title: editProject.title,
            clientId: editProject.clientId,
            type: editProject.type,
            status: editProject.status,
            budget: editProject.budget,
            deadline: editProject.deadline?.split("T")[0] || "",
            techStack: editProject.techStack.join(", "),
            notes: editProject.notes || "",
          }}
          onClose={() => { setEditProject(null); router.refresh(); }}
        />
      )}
    </div>
  );
}
