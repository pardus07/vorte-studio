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
  data: { label: string; count: number }[];
}

export default function PipelineBarChart({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => {
          const ratio = i / (data.length - 1 || 1);
          // Gradient from amber to green
          const r = Math.round(245 * (1 - ratio) + 34 * ratio);
          const g = Math.round(158 * (1 - ratio) + 197 * ratio);
          const b = Math.round(11 * (1 - ratio) + 94 * ratio);
          return `rgba(${r}, ${g}, ${b}, 0.8)`;
        }),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
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
          label: (ctx: { parsed: { x: number | null } }) =>
            `${ctx.parsed.x ?? 0} lead`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: { color: "#55555f", font: { size: 11 } },
        border: { display: false },
        max: maxCount + Math.ceil(maxCount * 0.2),
      },
      y: {
        grid: { display: false },
        ticks: { color: "#8f8f99", font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  return (
    <div style={{ height: Math.max(200, data.length * 36) }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
