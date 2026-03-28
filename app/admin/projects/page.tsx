import { prisma } from "@/lib/prisma";
import { seedProjects } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string }> = {
  DISCOVERY: { label: "Keşif", color: "bg-admin-purple-dim text-admin-purple" },
  DESIGN: { label: "Tasarım", color: "bg-admin-amber-dim text-admin-amber" },
  DEVELOPMENT: { label: "Geliştirme", color: "bg-admin-blue-dim text-admin-blue" },
  TESTING: { label: "Test", color: "bg-admin-green-dim text-admin-green" },
  DELIVERED: { label: "Teslim", color: "bg-admin-green-dim text-admin-green" },
  ARCHIVED: { label: "Arşiv", color: "bg-admin-red-dim text-admin-red" },
};

const typeLabels: Record<string, string> = {
  WEBSITE: "Web Sitesi",
  ECOMMERCE: "E-Ticaret",
  MOBILE_APP: "Mobil Uygulama",
  REDESIGN: "Yeniden Tasarım",
  CUSTOM: "Özel Proje",
};

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        client: { select: { name: true } },
        milestones: { orderBy: { dueDate: "asc" } },
      },
    });
    if (projects.length > 0)
      return projects.map((p) => ({
        id: p.id,
        title: p.title,
        clientName: p.client.name,
        type: p.type,
        status: p.status,
        budget: p.budget,
        progress: p.progress,
        techStack: p.techStack,
        deadline: p.deadline?.toISOString() || null,
        milestones: p.milestones.map((m) => ({
          title: m.title,
          completed: m.completed,
        })),
      }));
  } catch {
    /* fallback */
  }
  return seedProjects.map((p) => ({
    id: p.id,
    title: p.title,
    clientName: p.clientName,
    type: p.type,
    status: p.status,
    budget: p.budget,
    progress: p.progress,
    techStack: p.techStack,
    deadline: p.deadline?.toISOString() || null,
    milestones: [
      { title: "Tasarım onayı", completed: p.progress >= 30 },
      { title: "Frontend", completed: p.progress >= 60 },
      { title: "Backend entegrasyon", completed: p.progress >= 80 },
      { title: "Test & yayın", completed: p.progress >= 95 },
    ],
  }));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-admin-muted">
          {projects.length} proje
        </span>
        <button className="rounded-lg bg-admin-accent px-4 py-2 text-[12px] font-medium text-white">
          + Yeni Proje
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const st = statusConfig[project.status] || statusConfig.DISCOVERY;
          const progressColor =
            project.progress >= 80
              ? "var(--color-admin-green)"
              : project.progress >= 50
                ? "var(--color-admin-blue)"
                : "var(--color-admin-amber)";
          const daysLeft = project.deadline
            ? Math.ceil(
                (new Date(project.deadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          return (
            <div
              key={project.id}
              className="rounded-xl border border-admin-border bg-admin-bg2 p-5 transition-colors hover:border-admin-border2"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[13px] font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-admin-muted">
                    {project.clientName} · {typeLabels[project.type] || project.type}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${st.color}`}
                >
                  {st.label}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-admin-muted">İlerleme</span>
                  <span className="font-medium" style={{ color: progressColor }}>
                    %{project.progress}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-admin-bg4">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${project.progress}%`,
                      background: progressColor,
                    }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="mt-4 space-y-1.5">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`h-3.5 w-3.5 shrink-0 rounded border text-center text-[8px] leading-[14px] ${
                        m.completed
                          ? "border-admin-green bg-admin-green text-white"
                          : "border-admin-border text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        m.completed ? "text-admin-muted line-through" : "text-admin-text"
                      }
                    >
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-admin-border pt-3">
                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-admin-border px-1.5 py-0.5 text-[9px] text-admin-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="text-right text-[11px]">
                  <div className="font-medium">
                    ₺{project.budget.toLocaleString("tr-TR")}
                  </div>
                  {daysLeft !== null && (
                    <div
                      className={`text-[10px] ${
                        daysLeft <= 3
                          ? "text-admin-red"
                          : daysLeft <= 7
                            ? "text-admin-amber"
                            : "text-admin-muted"
                      }`}
                    >
                      {daysLeft > 0
                        ? `${daysLeft} gün kaldı`
                        : daysLeft === 0
                          ? "Bugün teslim"
                          : `${Math.abs(daysLeft)} gün gecikmiş`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
