import { Monitor, Tablet, Smartphone } from 'lucide-react';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
];

export default function DevicePreview({ device, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-cc-panel p-1 border border-cc-border" role="group" aria-label="Preview device size">
      {DEVICES.map((d) => {
        const Icon = d.icon;
        const active = device === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onChange(d.id)}
            aria-pressed={active}
            title={`${d.label} preview`}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-all ${
              active ? 'bg-cc-accent/20 text-cc-accent' : 'text-cc-muted hover:text-cc-text'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{d.label}</span>
          </button>
        );
      })}
    </div>
  );
}
