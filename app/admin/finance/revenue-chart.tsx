"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export default function RevenueChart({
  data,
}: {
  data: { month: string; value: number }[];
}) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        data: data.map((d) => d.value),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.08)",
        borderWidth: 2,
        pointBackgroundColor: "#f97316",
        pointBorderColor: "#0c0c0e",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#111114",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        titleColor: "#e8e8ea",
        bodyColor: "#f97316",
        bodyFont: { weight: "bold" as const },
        padding: 10,
        callbacks: {
          label: (ctx: unknown) => {
            const item = ctx as { parsed: { y: number | null } };
            return `₺${(item.parsed.y ?? 0).toLocaleString("tr-TR")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b6b72", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#6b6b72",
          font: { size: 11 },
          callback: (v: string | number) =>
            `₺${(Number(v) / 1000).toFixed(0)}K`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
