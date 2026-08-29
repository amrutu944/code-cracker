export default function RunButton({ onClick, label = 'Run', title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || 'Run your code (Ctrl/Cmd + Enter)'}
      className="flex items-center gap-1.5 rounded-cc bg-cc-accent px-4 py-2 text-sm font-semibold text-black transition-transform hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 4l14 8-14 8V4z" />
      </svg>
      {label}
    </button>
  );
}
