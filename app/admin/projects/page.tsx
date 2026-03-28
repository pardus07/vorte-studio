import { prisma } from "@/lib/prisma";
import { seedProjects } from "@/lib/seed-data";
import ProjectList from "./project-list";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        client: { select: { id: true, name: true } },
        milestones: { orderBy: { createdAt: "asc" } },
      },
    });
    if (projects.length > 0)
      return projects.map((p) => ({
        id: p.id,
        title: p.title,
        clientId: p.client.id,
        clientName: p.client.name,
        type: p.type,
        status: p.status,
        budget: p.budget,
        progress: p.progress,
        techStack: p.techStack,
        deadline: p.deadline?.toISOString() || null,
        notes: p.notes,
        milestones: p.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          completed: m.completed,
        })),
      }));
  } catch { /* fallback */ }
  return seedProjects.map((p) => ({
    id: p.id,
    title: p.title,
    clientId: "seed",
    clientName: p.clientName,
    type: p.type,
    status: p.status,
    budget: p.budget,
    progress: p.progress,
    techStack: p.techStack,
    deadline: p.deadline?.toISOString() || null,
    notes: null,
    milestones: [
      { id: `${p.id}-m1`, title: "Tasarım onayı", completed: p.progress >= 30 },
      { id: `${p.id}-m2`, title: "Frontend", completed: p.progress >= 60 },
      { id: `${p.id}-m3`, title: "Backend entegrasyon", completed: p.progress >= 80 },
      { id: `${p.id}-m4`, title: "Test & yayın", completed: p.progress >= 95 },
    ],
  }));
}

async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    if (clients.length > 0) return clients;
  } catch { /* fallback */ }
  return [{ id: "seed", name: "Demo Müşteri" }];
}

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([getProjects(), getClients()]);
  return <ProjectList projects={projects} clients={clients} />;
}
