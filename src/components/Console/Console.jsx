const LEVEL_CONFIG = {
  log: { icon: '✓', className: 'text-cc-text' },
  info: { icon: 'i', className: 'text-cc-accent2' },
  warn: { icon: '⚠', className: 'text-amber-400' },
  error: { icon: '✕', className: 'text-red-400' },
};

function ConsoleLine({ entry }) {
  const config = LEVEL_CONFIG[entry.level] || LEVEL_CONFIG.log;
  return (
    <div className={`flex gap-2 border-b border-cc-border/50 px-3 py-1.5 font-mono text-xs ${config.className}`}>
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {config.icon}
      </span>
      <div className="min-w-0 flex-1 break-words">
        <span>
          {entry.errorName && entry.level === 'error' ? `${entry.errorName}: ` : ''}
          {entry.message}
          {entry.lineNumber ? ` (line ${entry.lineNumber})` : ''}
        </span>
        {entry.hint && <p className="mt-1 text-cc-muted">💡 {entry.hint}</p>}
      </div>
    </div>
  );
}

export default function Console({ entries, onClear }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-cc-border bg-cc-panel2 px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-cc-muted">
          Console {entries.length > 0 && `(${entries.length})`}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-2 py-1 text-xs font-medium text-cc-muted hover:bg-cc-bg hover:text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
        >
          Clear Console
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto" role="log" aria-live="polite" aria-label="Console output">
        {entries.length === 0 ? (
          <p className="p-3 text-xs text-cc-muted">Console output will appear here after you run your code.</p>
        ) : (
          entries.map((entry, index) => <ConsoleLine key={`${entry.timestamp}-${index}`} entry={entry} />)
        )}
      </div>
    </div>
  );
}
