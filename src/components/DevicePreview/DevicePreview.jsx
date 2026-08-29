const DEVICES = [
  { id: 'desktop', label: 'Desktop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'mobile', label: 'Mobile' },
];

const ICONS = {
  desktop: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  tablet: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 19h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  mobile: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 19h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export default function DevicePreview({ device, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-cc bg-cc-panel2 p-1" role="group" aria-label="Preview device size">
      {DEVICES.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onChange(d.id)}
          aria-pressed={device === d.id}
          title={`${d.label} preview`}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2 ${
            device === d.id ? 'bg-cc-bg text-cc-text' : 'text-cc-muted hover:text-cc-text'
          }`}
        >
          {ICONS[d.id]}
          <span className="hidden sm:inline">{d.label}</span>
        </button>
      ))}
    </div>
  );
}
