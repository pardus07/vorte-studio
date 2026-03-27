import QuoteBuilder from "./quote-builder";

const seedQuotes = [
  {
    id: "sq1",
    client: "Akdeniz Spor Kompleksi",
    packageType: "Android MVP",
    total: 65000,
    createdAt: "2026-03-23",
    status: "SENT",
    daysWaiting: 4,
  },
  {
    id: "sq2",
    client: "Sarıgül Otomotiv",
    packageType: "Web Sitesi",
    total: 18000,
    createdAt: "2026-03-20",
    status: "SENT",
    daysWaiting: 7,
  },
  {
    id: "sq3",
    client: "DisSağlık Dental",
    packageType: "Web + Bakım",
    total: 28000,
    createdAt: "2026-03-15",
    status: "ACCEPTED",
    daysWaiting: 0,
  },
  {
    id: "sq4",
    client: "Güneş Turizm",
    packageType: "E-Ticaret",
    total: 38000,
    createdAt: "2026-03-02",
    status: "ACCEPTED",
    daysWaiting: 0,
  },
];

const seedClients = [
  { id: "c1", name: "Koray Hukuk Bürosu" },
  { id: "c2", name: "Sarıgül Otomotiv" },
  { id: "c3", name: "Güzellik Merkezi Lina" },
  { id: "c4", name: "Anatolian Spa Hotel" },
];

export default function QuotesPage() {
  return (
    <QuoteBuilder clients={seedClients} recentQuotes={seedQuotes} />
  );
}
