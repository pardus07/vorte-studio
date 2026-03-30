"use client";

interface AIQuickActionsProps {
  shortcuts: { label: string; prompt: string }[];
  onAction: (text: string) => void;
}

export function AIQuickActions({ shortcuts, onAction }: AIQuickActionsProps) {
  return (
    <div className="space-y-4 p-5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#da7756] to-[#c15a3a]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 12l-4 2.5 1.5-4.5L6 7.5h4.5z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-admin-text">Vorte Asistan</h3>
        <p className="mt-1 text-xs text-admin-muted">
          Admin panelinde istediğiniz her işlemi yapabilirim.
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="px-1 text-[10px] font-medium uppercase tracking-wider text-admin-muted2">
          Hızlı Eylemler
        </p>
        {shortcuts.map((s) => (
          <button
            key={s.label}
            onClick={() => onAction(s.prompt)}
            className="flex w-full items-center gap-2.5 rounded-lg border border-admin-border bg-admin-bg2 px-3 py-2.5 text-left text-[13px] text-admin-muted transition-colors hover:border-[#da7756]/40 hover:bg-admin-bg3 hover:text-[#da7756]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-admin-muted2">
              <path d="M12 3l1.5 4.5H18l-3.5 2.5L16 14.5 12 12l-4 2.5 1.5-4.5L6 7.5h4.5z" />
            </svg>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
