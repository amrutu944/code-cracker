import { useEffect, useRef } from 'react';

/**
 * A small accessible confirmation dialog used for destructive or
 * irreversible actions (Reset, Delete Project) across the app.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <div className="w-full max-w-sm rounded-cc border border-cc-border bg-cc-panel p-5 shadow-2xl">
        <h2 id="confirm-dialog-title" className="text-base font-semibold text-cc-text">
          {title}
        </h2>
        <p className="mt-2 text-sm text-cc-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-cc-muted hover:bg-cc-panel2 hover:text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2 ${
              danger ? 'bg-red-500 text-white hover:brightness-110' : 'bg-cc-accent text-black hover:brightness-110'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
