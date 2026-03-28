import { prisma } from "@/lib/prisma";
import QuoteBuilder from "./quote-builder";

export const dynamic = "force-dynamic";

const seedClients = [
  { id: "c1", name: "Koray Hukuk Bürosu", email: null },
  { id: "c2", name: "Sarıgül Otomotiv", email: null },
  { id: "c3", name: "Güzellik Merkezi Lina", email: null },
];

const seedQuotes = [
  { id: "sq1", client: "Akdeniz Spor Kompleksi", packageType: "Android MVP", total: 65000, createdAt: "2026-03-23", status: "SENT", daysWaiting: 4 },
  { id: "sq2", client: "Sarıgül Otomotiv", packageType: "Web Sitesi", total: 18000, createdAt: "2026-03-20", status: "SENT", daysWaiting: 7 },
  { id: "sq3", client: "DisSağlık Dental", packageType: "Web + Bakım", total: 28000, createdAt: "2026-03-15", status: "ACCEPTED", daysWaiting: 0 },
];

async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    });
    if (clients.length > 0) return clients;
  } catch { /* fallback */ }
  return seedClients;
}

async function getRecentQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true } } },
      take: 10,
    });
    if (quotes.length > 0) {
      return quotes.map((q) => {
        const daysAgo = Math.floor((Date.now() - q.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: q.id,
          client: q.client.name,
          packageType: q.packageType,
          total: q.total,
          createdAt: q.createdAt.toISOString().split("T")[0],
          status: q.status,
          daysWaiting: q.status === "SENT" ? daysAgo : 0,
        };
      });
    }
  } catch { /* fallback */ }
  return seedQuotes;
}

export default async function QuotesPage() {
  const [clients, recentQuotes] = await Promise.all([
    getClients(),
    getRecentQuotes(),
  ]);
  return <QuoteBuilder clients={clients} recentQuotes={recentQuotes} />;
}
