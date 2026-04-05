"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  data: { month: string; gelir: number; bakim: number }[];
}

export default function RevenueLineChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Proje Geliri",
        data: data.map((d) => d.gelir),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.06)",
        borderWidth: 2,
        pointBackgroundColor: "#f97316",
        pointBorderColor: "#0c0c0e",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Bakım Geliri",
        data: data.map((d) => d.bakim),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.04)",
        borderWidth: 2,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#0c0c0e",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          color: "#8f8f99",
          font: { size: 11 },
          boxWidth: 12,
          boxHeight: 3,
          padding: 16,
          usePointStyle: false,
        },
      },
      tooltip: {
        backgroundColor: "#111114",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        titleColor: "#e8e8ea",
        bodyColor: "#f97316",
        bodyFont: { weight: "bold" as const },
        padding: 10,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
            `${ctx.dataset.label}: ₺${(ctx.parsed.y ?? 0).toLocaleString("tr-TR")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#55555f", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#55555f",
          font: { size: 11 },
          callback: (v: string | number) =>
            `₺${(Number(v) / 1000).toFixed(0)}K`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
