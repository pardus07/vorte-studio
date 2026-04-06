"use client";

import {
  WORKFLOW_STEPS,
  TOTAL_WORKFLOW_STEPS,
  getCurrentStep,
  isStepCompleted,
  isStepActive,
  type WorkflowState,
} from "@/lib/workflow";

interface Props {
  state: WorkflowState;
}

export default function WorkflowTimeline({ state }: Props) {
  const current = getCurrentStep(state);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-bg2 p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Proje Yol Haritası
        </h2>
        <span className="text-xs text-white/40">
          {current.order}/{TOTAL_WORKFLOW_STEPS} — {current.label}
        </span>
      </div>
      <p className="mb-6 text-xs text-white/40">{current.description}</p>

      <ol className="relative space-y-4">
        {/* Dikey çizgi (background) */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.08]" />

        {WORKFLOW_STEPS.map((step) => {
          const completed = isStepCompleted(step.key, state);
          const active = isStepActive(step.key, state);
          const upcoming = !completed && !active;

          return (
            <li key={step.key} className="relative flex items-start gap-3">
              {/* Dot */}
              <div
                className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] ${
                  completed
                    ? "border-accent bg-accent text-white"
                    : active
                    ? "border-accent bg-bg2 text-accent ring-2 ring-accent/20"
                    : "border-white/15 bg-bg2 text-white/30"
                }`}
              >
                {completed ? (
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.order}</span>
                )}
              </div>

              {/* İçerik */}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      completed ? "text-white/50" : active ? "text-accent" : "text-white/40"
                    }`}
                  >
                    {step.icon} {step.label}
                  </span>
                  {active && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                      Şu anda
                    </span>
                  )}
                  {completed && (
                    <span className="text-[10px] text-white/30">Tamamlandı</span>
                  )}
                </div>
                {(active || upcoming) && (
                  <p className={`mt-0.5 text-xs leading-relaxed ${active ? "text-white/60" : "text-white/30"}`}>
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
