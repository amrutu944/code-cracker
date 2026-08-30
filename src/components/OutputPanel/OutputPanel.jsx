import { useState } from 'react';

export default function OutputPanel({
  output = '',
  error = '',
}) {
  const [collapsed, setCollapsed] = useState(false);

  const hasError = Boolean(error);

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
          Output
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

      {/* Output content */}
      {!collapsed && (
        <div
          className="
            min-h-0
            flex-1
            overflow-auto
            bg-[#0b1120]
            p-4
            font-mono
            text-sm
            leading-6
          "
        >
          {hasError ? (
            <pre className="whitespace-pre-wrap break-words text-red-400">
              {error}
            </pre>
          ) : output ? (
            <pre className="whitespace-pre-wrap break-words text-slate-200">
              {output}
            </pre>
          ) : (
            <span className="text-slate-600">
              Output will appear here...
            </span>
          )}
        </div>
      )}
    </section>
  );
}