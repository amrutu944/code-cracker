import { useState } from 'react';

export default function InputPanel({
  value = '',
  onChange,
}) {
  const [collapsed, setCollapsed] = useState(false);

  function handleChange(event) {
    if (onChange) {
      onChange(event.target.value);
    }
  }

  return (
    <section
      className={`
        flex min-h-0 flex-col overflow-hidden
        rounded-lg border border-slate-300
        bg-white
        ${collapsed ? 'h-auto' : 'h-full'}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() =>
          setCollapsed((previous) => !previous)
        }
        className="
          flex h-12 shrink-0
          items-center justify-between
          border-b border-slate-200
          bg-white
          px-4
          text-left
          transition
          hover:bg-slate-50
        "
      >
        <span className="text-base font-medium text-slate-700">
          Input
        </span>

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`text-slate-500 transition-transform duration-150 ${
            collapsed ? '' : 'rotate-180'
          }`}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Input editor */}
      {!collapsed && (
        <div className="min-h-0 flex-1 bg-[#0b1120]">
          <textarea
            value={value}
            onChange={handleChange}
            spellCheck={false}
            placeholder=""
            className="
              h-full
              min-h-[120px]
              w-full
              resize-none
              border-0
              bg-[#0b1120]
              p-4
              font-mono
              text-sm
              leading-6
              text-slate-200
              outline-none
              placeholder:text-slate-600
            "
            aria-label="Program input"
          />
        </div>
      )}
    </section>
  );
}