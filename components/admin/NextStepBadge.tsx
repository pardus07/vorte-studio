"use client";

import Link from "next/link";
import { getCurrentStep, TOTAL_WORKFLOW_STEPS, type WorkflowState } from "@/lib/workflow";

interface Props {
  state: WorkflowState;
  /** "compact" satır içi kullanım için kısa, "full" geniş kart için detaylı */
  variant?: "compact" | "full";
}

// Adım rengi — UX olarak "şu an ne yapmalı" net olsun
const STEP_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  lead:               { bg: "bg-white/5",         border: "border-white/10",          text: "text-white/60",   dot: "bg-white/40" },
  proposal_sent:      { bg: "bg-amber-500/10",    border: "border-amber-500/20",      text: "text-amber-400",  dot: "bg-amber-400" },
  proposal_accepted:  { bg: "bg-purple-500/10",   border: "border-purple-500/20",     text: "text-purple-400", dot: "bg-purple-400" },
  contract_signed:    { bg: "bg-rose-500/10",     border: "border-rose-500/30",       text: "text-rose-400",   dot: "bg-rose-400" },
  deposit_paid:       { bg: "bg-cyan-500/10",     border: "border-cyan-500/20",       text: "text-cyan-400",   dot: "bg-cyan-400" },
  logo_approved:      { bg: "bg-yellow-500/10",   border: "border-yellow-500/30",     text: "text-yellow-400", dot: "bg-yellow-400" },
  in_progress:        { bg: "bg-blue-500/10",     border: "border-blue-500/20",       text: "text-blue-400",   dot: "bg-blue-400" },
  final_paid:         { bg: "bg-orange-500/10",   border: "border-orange-500/20",     text: "text-orange-400", dot: "bg-orange-400" },
  completed:          { bg: "bg-emerald-500/10",  border: "border-emerald-500/30",    text: "text-emerald-400",dot: "bg-emerald-400" },
};

export default function NextStepBadge({ state, variant = "compact" }: Props) {
  const step = getCurrentStep(state);
  const colors = STEP_COLORS[step.key] || STEP_COLORS.lead;

  if (variant === "compact") {
    return (
      <Link
        href={step.href}
        title={step.description}
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all hover:scale-105 ${colors.bg} ${colors.border} ${colors.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot} animate-pulse`} />
        <span>{step.icon}</span>
        <span>{step.label}</span>
      </Link>
    );
  }

  // Full variant — detaylı kart
  return (
    <Link
      href={step.href}
      onClick={(e) => e.stopPropagation()}
      className={`block rounded-xl border p-3 transition-all hover:scale-[1.01] ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${colors.bg} ${colors.border} border`}>
          {step.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-admin-muted">Sıradaki Adım</span>
            <span className="text-[10px] text-admin-muted/60">·</span>
            <span className="text-[10px] text-admin-muted">{step.order}/{TOTAL_WORKFLOW_STEPS}</span>
          </div>
          <div className={`mt-0.5 text-sm font-bold ${colors.text}`}>{step.label}</div>
          <p className="mt-1 text-[11px] leading-relaxed text-admin-muted">{step.description}</p>
        </div>
        <svg className={`h-4 w-4 shrink-0 ${colors.text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
