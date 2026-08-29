import { SAVE_STATUS } from '../../hooks/useAutosave.js';

const CONFIG = {
  [SAVE_STATUS.IDLE]: { text: '', dot: '' },
  [SAVE_STATUS.UNSAVED]: { text: 'Unsaved changes', dot: 'bg-cc-muted' },
  [SAVE_STATUS.SAVING]: { text: 'Saving...', dot: 'bg-cc-accent2 animate-pulse' },
  [SAVE_STATUS.SAVED]: { text: 'Saved', dot: 'bg-cc-accent' },
  [SAVE_STATUS.ERROR]: { text: 'Could not save', dot: 'bg-red-500' },
};

export default function SaveStatus({ status }) {
  const config = CONFIG[status] || CONFIG[SAVE_STATUS.IDLE];
  if (!config.text) return <span className="text-xs text-cc-muted" aria-hidden="true" />;

  return (
    <span className="flex items-center gap-1.5 text-xs text-cc-muted" role="status" aria-live="polite">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.text}
      {status === SAVE_STATUS.SAVED && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
