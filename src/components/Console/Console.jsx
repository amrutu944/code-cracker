import { CheckCircle2, Info, AlertTriangle, XCircle, Trash2, Terminal } from 'lucide-react';

const LEVEL_CONFIG = {
  log: { icon: CheckCircle2, className: 'text-slate-300' },
  info: { icon: Info, className: 'text-cc-accent2' },
  warn: { icon: AlertTriangle, className: 'text-amber-400' },
  error: { icon: XCircle, className: 'text-red-400 font-semibold' },
};

function ConsoleLine({ entry }) {
  const config = LEVEL_CONFIG[entry.level] || LEVEL_CONFIG.log;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-2 border-b border-cc-border/40 px-3 py-2 font-mono text-xs ${config.className}`}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0 flex-1 break-words">
        <span>
          {entry.errorName && entry.level === 'error' ? `${entry.errorName}: ` : ''}
          {entry.message}
          {entry.lineNumber ? ` (line ${entry.lineNumber})` : ''}
        </span>
        {entry.hint && <p className="mt-1 text-cc-muted text-[11px] font-sans bg-cc-panel2 p-1.5 rounded border border-cc-border">💡 Hint: {entry.hint}</p>}
      </div>
    </div>
  );
}

export default function Console({ entries, onClear }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0b1120]">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-[#111827] px-3 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cc-accent2" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Console {entries.length > 0 && `(${entries.length})`}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          title="Clear Console"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite" aria-label="Console output">
        {entries.length === 0 ? (
          <p className="p-4 text-xs text-slate-500 font-mono">Console output will appear here after running your JavaScript code...</p>
        ) : (
          entries.map((entry, index) => <ConsoleLine key={`${entry.timestamp}-${index}`} entry={entry} />)
        )}
      </div>
    </div>
  );
}
