import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Code2, Terminal, Layers } from 'lucide-react';

const LANGUAGES = [
  {
    id: 'web',
    name: 'Web (HTML/CSS/JS)',
    icon: Code2,
    badge: 'Web App',
  },
  {
    id: 'python3.10',
    name: 'Python 3.10',
    icon: Terminal,
    badge: 'Python',
  },
  {
    id: 'python3.8-ml',
    name: 'Python 3.8 (ML)',
    icon: Terminal,
    badge: 'Python',
  },
  {
    id: 'python3.9',
    name: 'Python 3.9',
    icon: Terminal,
    badge: 'Python',
  },
  {
    id: 'c',
    name: 'C (gcc 8.3)',
    icon: Layers,
    badge: 'C',
  },
  {
    id: 'cpp',
    name: 'C++ (g++)',
    icon: Layers,
    badge: 'C++',
  },
  {
    id: 'java',
    name: 'Java (OpenJDK)',
    icon: Layers,
    badge: 'Java',
  },
];

export default function LanguageSelector({ value = 'web', onChange }) {
  const [open, setOpen] = useState(false);
  const selectorRef = useRef(null);

  const selectedLanguage =
    LANGUAGES.find((lang) => lang.id === value) || LANGUAGES[0];
  const Icon = selectedLanguage.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(lang) {
    setOpen(false);
    if (onChange) {
      onChange(lang.id);
    }
  }

  return (
    <div ref={selectorRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          flex h-10 items-center justify-between gap-3
          rounded-lg border border-cc-border bg-cc-panel px-3.5
          text-xs font-bold text-cc-text
          transition hover:border-cc-accent/50 hover:bg-cc-panel2
          focus:outline-none
        "
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-cc-accent" />
          <span>{selectedLanguage.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-cc-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select programming language"
          className="
            absolute left-0 top-full z-50 mt-1.5
            w-56 overflow-hidden
            rounded-xl border border-cc-border
            bg-cc-panel py-1 shadow-2xl backdrop-blur-md
          "
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.id === selectedLanguage.id;
            const LangIcon = lang.icon;

            return (
              <button
                key={lang.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang)}
                className={`
                  flex w-full items-center justify-between
                  px-3.5 py-2.5 text-left text-xs font-semibold
                  transition
                  ${
                    isSelected
                      ? 'bg-cc-accent/15 text-cc-accent'
                      : 'text-cc-text hover:bg-cc-panel2 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <LangIcon className="h-4 w-4 shrink-0 text-cc-accent2" />
                  <span>{lang.name}</span>
                </div>
                <span className="rounded bg-cc-border px-1.5 py-0.5 text-[10px] text-cc-muted">
                  {lang.badge}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}