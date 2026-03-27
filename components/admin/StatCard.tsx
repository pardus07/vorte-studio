type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  color?: "green" | "accent" | "amber" | "blue" | "red" | "default";
  trend?: "up" | "down" | "warn";
};

const colorMap = {
  green: "var(--color-admin-green)",
  accent: "var(--color-admin-accent)",
  amber: "var(--color-admin-amber)",
  blue: "var(--color-admin-blue)",
  red: "var(--color-admin-red)",
  default: "var(--color-admin-text)",
};

export default function StatCard({
  label,
  value,
  sub,
  color = "default",
  trend,
}: StatCardProps) {
  return (
    <div
      className="rounded-xl border border-admin-border bg-admin-bg2 px-5 py-4"
      style={{ minWidth: 0 }}
    >
      <div className="text-[11px] font-medium text-admin-muted">{label}</div>
      <div
        className="mt-1 text-2xl font-semibold tracking-tight"
        style={{ color: colorMap[color] }}
      >
        {value}
      </div>
      <div
        className="mt-0.5 text-[11px]"
        style={{
          color:
            trend === "up"
              ? "var(--color-admin-green)"
              : trend === "warn"
                ? "var(--color-admin-amber)"
                : "var(--color-admin-muted)",
        }}
      >
        {trend === "up" && "↑ "}
        {trend === "down" && "↓ "}
        {sub}
      </div>
    </div>
  );
}
