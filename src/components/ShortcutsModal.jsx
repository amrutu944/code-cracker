import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Ctrl + Enter / Cmd + Enter', description: 'Run / Execute Code' },
  { key: 'Ctrl + S / Cmd + S', description: 'Save Project' },
  { key: 'Ctrl + L', description: 'Clear Console' },
  { key: 'Esc', description: 'Close Dialogs / Modals' },
];

export default function ShortcutsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-cc-border bg-cc-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cc-border pb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-cc-accent" />
            <h2 className="text-lg font-bold text-cc-text">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-cc-muted hover:bg-cc-panel2 hover:text-cc-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {SHORTCUTS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-cc-border bg-cc-panel2 p-3 text-sm"
            >
              <span className="font-semibold text-cc-text">{item.description}</span>
              <kbd className="rounded border border-cc-border bg-cc-bg px-2 py-1 font-mono text-xs font-semibold text-cc-accent2">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-cc-accent px-4 py-2 text-sm font-bold text-black hover:brightness-110"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
