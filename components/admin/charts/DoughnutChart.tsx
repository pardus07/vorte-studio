"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: { label: string; count: number }[];
  colors?: string[];
  centerLabel?: string;
  centerValue?: string;
}

const DEFAULT_COLORS = [
  "#f97316", "#3b82f6", "#22c55e", "#f59e0b",
  "#a855f7", "#ef4444", "#06b6d4", "#ec4899",
];

export default function DoughnutChart({
  data,
  colors = DEFAULT_COLORS,
  centerLabel,
  centerValue,
}: Props) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((_, i) => colors[i % colors.length]),
        borderColor: "#0c0c0e",
        borderWidth: 2,
        hoverBorderColor: "#18181c",
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#8f8f99",
          font: { size: 11 },
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          usePointStyle: true,
          pointStyle: "circle" as const,
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
      },
    },
  };

  const centerPlugin = centerLabel
    ? {
        id: "centerText",
        beforeDraw(chart: ChartJS) {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          const cx = (chartArea.left + chartArea.right) / 2;
          const cy = (chartArea.top + chartArea.bottom) / 2;

          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          if (centerValue) {
            ctx.fillStyle = "#f0f0f2";
            ctx.font = "bold 22px sans-serif";
            ctx.fillText(centerValue, cx, cy - 8);
          }

          ctx.fillStyle = "#55555f";
          ctx.font = "11px sans-serif";
          ctx.fillText(centerLabel, cx, cy + 14);
          ctx.restore();
        },
      }
    : undefined;

  return (
    <div style={{ height: 260 }}>
      <Doughnut
        data={chartData}
        options={options}
        plugins={centerPlugin ? [centerPlugin] : []}
      />
    </div>
  );
}
