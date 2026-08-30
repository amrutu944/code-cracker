import { X, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsModal({ open, onClose, settings, onUpdateSettings }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-cc-border bg-cc-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cc-border pb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-cc-accent2" />
            <h2 className="text-lg font-bold text-cc-text">Editor Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-cc-muted hover:bg-cc-panel2 hover:text-cc-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {/* Font Size */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-cc-text">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ ...settings, fontSize: Number(e.target.value) })}
              className="rounded-md border border-cc-border bg-cc-panel2 px-3 py-1.5 text-sm text-cc-text outline-none focus:border-cc-accent"
            >
              <option value={12}>12 px</option>
              <option value={14}>14 px (Default)</option>
              <option value={16}>16 px</option>
              <option value={18}>18 px</option>
            </select>
          </div>

          {/* Tab Size */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-cc-text">Tab Indentation</label>
            <select
              value={settings.tabSize}
              onChange={(e) => onUpdateSettings({ ...settings, tabSize: Number(e.target.value) })}
              className="rounded-md border border-cc-border bg-cc-panel2 px-3 py-1.5 text-sm text-cc-text outline-none focus:border-cc-accent"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-cc-text">Word Wrap</label>
            <input
              type="checkbox"
              checked={settings.wordWrap === 'on'}
              onChange={(e) =>
                onUpdateSettings({ ...settings, wordWrap: e.target.checked ? 'on' : 'off' })
              }
              className="h-4 w-4 rounded border-cc-border text-cc-accent focus:ring-0"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-cc-accent px-4 py-2 text-sm font-bold text-black hover:brightness-110"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
