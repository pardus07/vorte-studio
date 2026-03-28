import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientDetailView from "./client-detail";

export const dynamic = "force-dynamic";

async function getClient(id: string) {
  try {
    return await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: { milestones: true },
          orderBy: { updatedAt: "desc" },
        },
        quotes: { orderBy: { createdAt: "desc" } },
        maintenance: true,
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
  } catch {
    return null;
  }
}

async function getPayments(clientId: string) {
  try {
    return await prisma.payment.findMany({
      where: { project: { clientId } },
      include: { project: { select: { title: true } } },
      orderBy: { dueDate: "desc" },
      take: 10,
    });
  } catch {
    return [];
  }
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  const payments = await getPayments(id);

  const data = {
    id: client.id,
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    sector: client.sector,
    status: client.status,
    notes: client.notes,
    totalRevenue: client.totalRevenue,
    createdAt: client.createdAt.toISOString(),
    projects: client.projects.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      status: p.status,
      budget: p.budget,
      progress: p.progress,
      deadline: p.deadline?.toISOString() || null,
      milestones: p.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        completed: m.completed,
      })),
    })),
    payments: payments.map((p) => ({
      id: p.id,
      projectTitle: p.project.title,
      amount: p.amount,
      type: p.type,
      status: p.status,
      dueDate: p.dueDate.toISOString(),
      paidAt: p.paidAt?.toISOString() || null,
    })),
    activities: client.activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  return <ClientDetailView client={data} />;
}
