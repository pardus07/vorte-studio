import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectDetailView from "./project-detail";

export const dynamic = "force-dynamic";

async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        milestones: { orderBy: { dueDate: "asc" } },
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
  } catch { return null; }
}

async function getPayments(projectId: string) {
  try {
    return await prisma.payment.findMany({
      where: { projectId },
      orderBy: { dueDate: "desc" },
    });
  } catch { return []; }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const payments = await getPayments(id);

  const data = {
    id: project.id,
    title: project.title,
    clientId: project.client.id,
    clientName: project.client.name,
    type: project.type,
    status: project.status,
    budget: project.budget,
    progress: project.progress,
    techStack: project.techStack,
    startDate: project.startDate?.toISOString() || null,
    deadline: project.deadline?.toISOString() || null,
    notes: project.notes,
    milestones: project.milestones.map((m) => ({
      id: m.id, title: m.title, completed: m.completed,
      completedAt: m.completedAt?.toISOString() || null,
    })),
    payments: payments.map((p) => ({
      id: p.id, amount: p.amount, type: p.type, status: p.status,
      dueDate: p.dueDate.toISOString(), paidAt: p.paidAt?.toISOString() || null,
      invoiceNo: p.invoiceNo,
    })),
    activities: project.activities.map((a) => ({
      id: a.id, type: a.type, description: a.description,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  return <ProjectDetailView project={data} />;
}
