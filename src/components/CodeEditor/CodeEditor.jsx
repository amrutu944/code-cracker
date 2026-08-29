import Editor from '@monaco-editor/react';
import { useCodeEditor } from '../../hooks/useCodeEditor.js';

const LANGUAGE_LABELS = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
};

/**
 * A single Monaco editor pane for one language (HTML, CSS or JavaScript).
 */
export default function CodeEditor({ language, value, onChange, onRun, onSave, height = '100%' }) {
  const { handleMount, editorOptions } = useCodeEditor({ onRun, onSave });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-cc-border bg-cc-panel2 px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-cc-muted">
          {LANGUAGE_LABELS[language] || language}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={(val) => onChange(val ?? '')}
          onMount={handleMount}
          theme="vs-dark"
          options={editorOptions}
          loading={<div className="p-3 text-sm text-cc-muted">Loading editor...</div>}
        />
      </div>
    </div>
  );
}
