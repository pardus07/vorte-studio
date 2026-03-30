"use client";

interface AIConfirmDialogProps {
  title: string;
  description: string;
  details?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AIConfirmDialog({
  title,
  description,
  details,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: AIConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-md rounded-xl border border-admin-border bg-admin-bg shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-admin-border px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-admin-red/10">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-admin-red">
              <path d="M8 1l7 13H1zM8 6v3M8 11h.01" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-admin-text">{title}</h3>
            <p className="text-sm text-admin-muted">{description}</p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-admin-muted hover:bg-admin-bg3 hover:text-admin-text"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Details */}
        {details && (
          <div className="border-b border-admin-border px-5 py-3">
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-admin-bg2 p-3 font-mono text-xs text-admin-muted">
              {details}
            </pre>
          </div>
        )}

        {/* Warning */}
        <div className="px-5 py-3">
          <div className="rounded-lg border border-admin-red/20 bg-admin-red-dim p-3">
            <p className="text-xs font-medium text-admin-red">
              Bu işlem geri alınamaz. Devam etmek istediğinize emin misiniz?
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-admin-border px-5 py-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-admin-border px-4 py-2 text-sm font-medium text-admin-muted hover:bg-admin-bg3 disabled:opacity-50"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-admin-red px-4 py-2 text-sm font-medium text-white hover:bg-admin-red/80 disabled:opacity-50"
          >
            {isLoading ? "İşleniyor..." : "Evet, Uygula"}
          </button>
        </div>
      </div>
    </div>
  );
}
