"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  color?: "green" | "accent" | "amber" | "blue" | "red" | "default";
  trend?: "up" | "down" | "warn";
  icon?: React.ReactNode;
  href?: string;
};

const colorConfig = {
  green: {
    value: "var(--color-admin-green)",
    iconBg: "bg-admin-green/12",
    iconColor: "text-admin-green",
    borderHover: "hover:border-admin-green/30",
  },
  accent: {
    value: "var(--color-admin-accent)",
    iconBg: "bg-admin-accent/12",
    iconColor: "text-admin-accent",
    borderHover: "hover:border-admin-accent/30",
  },
  amber: {
    value: "var(--color-admin-amber)",
    iconBg: "bg-admin-amber/12",
    iconColor: "text-admin-amber",
    borderHover: "hover:border-admin-amber/30",
  },
  blue: {
    value: "var(--color-admin-blue)",
    iconBg: "bg-admin-blue/12",
    iconColor: "text-admin-blue",
    borderHover: "hover:border-admin-blue/30",
  },
  red: {
    value: "var(--color-admin-red)",
    iconBg: "bg-admin-red/12",
    iconColor: "text-admin-red",
    borderHover: "hover:border-admin-red/30",
  },
  default: {
    value: "var(--color-admin-text)",
    iconBg: "bg-admin-bg4",
    iconColor: "text-admin-muted",
    borderHover: "hover:border-admin-border2",
  },
};

export default function StatCard({
  label,
  value,
  sub,
  color = "default",
  trend,
  icon,
  href,
}: StatCardProps) {
  const cfg = colorConfig[color];

  const content = (
    <>
      {/* Subtle gradient glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: cfg.value }}
      />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            {label}
          </div>
          <div
            className="mt-2 text-[28px] font-bold leading-none tracking-tight"
            style={{ color: cfg.value }}
          >
            {value}
          </div>
          <div
            className="mt-2 flex items-center gap-1.5 text-[12px]"
            style={{
              color:
                trend === "up"
                  ? "var(--color-admin-green)"
                  : trend === "warn"
                    ? "var(--color-admin-amber)"
                    : "var(--color-admin-muted)",
            }}
          >
            {trend === "up" && <TrendUpIcon className="h-3.5 w-3.5" />}
            {trend === "down" && <TrendDownIcon className="h-3.5 w-3.5" />}
            {trend === "warn" && <AlertIcon className="h-3.5 w-3.5" />}
            {sub}
          </div>
        </div>

        {/* Icon circle */}
        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
          cfg.iconBg,
          href && "group-hover:scale-110 group-hover:shadow-md"
        )}>
          {icon ? (
            <div className={cfg.iconColor}>{icon}</div>
          ) : (
            <DefaultIcon className={cn("h-5 w-5", cfg.iconColor)} color={color} />
          )}
        </div>
      </div>
    </>
  );

  const cardClass = cn(
    "group relative overflow-hidden rounded-2xl border border-admin-border bg-admin-bg2 p-5 transition-all duration-300",
    cfg.borderHover,
    "hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5",
    href && "cursor-pointer"
  );

  if (href) {
    return (
      <Link href={href} className={cn(cardClass, "block no-underline")}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

/* ── Default Icons ── */
function DefaultIcon({ className, color }: { className?: string; color: string }) {
  if (color === "green") return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v16M14 6H8a3 3 0 000 6h4a3 3 0 010 6H6" />
    </svg>
  );
  if (color === "accent") return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-2 2L13 8.6l1.7-2.3z" />
      <path d="M9.7 5.3l-7.4 7.4a1.4 1.4 0 000 2l.4.4a1.4 1.4 0 002 0l7.4-7.4" />
    </svg>
  );
  if (color === "amber") return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6v4l3 2" />
    </svg>
  );
  if (color === "blue") return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="13" rx="2" />
      <path d="M7 8h6M7 11h4" />
    </svg>
  );
  if (color === "red") return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l2.3 4.7 5.2.75-3.75 3.65.9 5.15L10 14l-4.65 2.3.9-5.15L2.5 7.45l5.2-.75L10 2z" />
    </svg>
  );
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="7" rx="2" />
      <rect x="11" y="2" width="7" height="7" rx="2" />
      <rect x="2" y="11" width="7" height="7" rx="2" />
      <rect x="11" y="11" width="7" height="7" rx="2" />
    </svg>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l4-4 2 2 4-4" />
      <path d="M10 5h3v3" />
    </svg>
  );
}

function TrendDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l4 4 2-2 4 4" />
      <path d="M10 11h3v-3" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1L1 14h14L8 1z" />
      <path d="M8 6v3M8 11.5v.5" />
    </svg>
  );
}
