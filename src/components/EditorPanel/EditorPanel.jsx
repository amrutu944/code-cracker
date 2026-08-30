import { useEffect, useState } from 'react';
import CodeEditor from '../CodeEditor/CodeEditor.jsx';
import { Play, Save, Code } from 'lucide-react';

const TABS = [
  {
    id: 'html',
    label: 'HTML',
    color: 'bg-orange-500',
  },
  {
    id: 'css',
    label: 'CSS',
    color: 'bg-sky-500',
  },
  {
    id: 'javascript',
    label: 'JAVASCRIPT',
    color: 'bg-yellow-400',
  },
];

export default function EditorPanel({
  code,
  onChange,
  onRun,
  onSave,
  settings = {},
}) {
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    if (!TABS.some((tab) => tab.id === activeTab)) {
      setActiveTab('html');
    }
  }, [activeTab]);

  function handleEditorChange(value) {
    onChange(activeTab, value);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0b1120]">
      {/* Editor Tabs */}
      <div className="flex h-11 shrink-0 items-center border-b border-slate-800 bg-[#111827] px-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex h-full items-center gap-2
                px-4 text-xs font-bold
                tracking-wider transition
                ${
                  active
                    ? 'bg-[#0b1120] text-white border-t-2 border-cc-accent'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
              `}
            >
              <span className={`h-2 w-2 rounded-full ${tab.color}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Monaco Code Editor */}
      <div className="min-h-0 flex-1">
        <CodeEditor
          language={activeTab}
          value={code[activeTab] || ''}
          onChange={handleEditorChange}
          options={settings}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-slate-800 bg-[#111827] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Code className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold uppercase text-slate-400">
            {activeTab}
          </span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-500 font-mono">
            {code[activeTab]?.length || 0} chars
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSave}
            className="
              flex items-center gap-1.5
              rounded-lg border border-slate-700
              px-3.5 py-1.5
              text-xs font-semibold
              text-slate-300
              transition
              hover:border-slate-500
              hover:bg-slate-800
              hover:text-white
            "
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={onRun}
            className="
              inline-flex items-center gap-1.5
              rounded-lg bg-cc-accent
              px-4 py-1.5
              text-xs font-bold text-black
              shadow-sm shadow-cc-accent/20
              transition
              hover:brightness-110
              active:scale-95
            "
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>Run Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}