"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface Props {
  data: { month: string; count: number }[];
}

export default function LeadTrendChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: "rgba(249, 115, 22, 0.6)",
        hoverBackgroundColor: "rgba(249, 115, 22, 0.85)",
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111114",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        titleColor: "#e8e8ea",
        bodyColor: "#f97316",
        bodyFont: { weight: "bold" as const },
        padding: 10,
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) =>
            `${ctx.parsed.y ?? 0} lead`,
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
        ticks: { color: "#55555f", font: { size: 11 }, stepSize: 1 },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height: 200 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
