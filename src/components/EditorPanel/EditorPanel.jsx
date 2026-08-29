import CodeEditor from '../CodeEditor/CodeEditor.jsx';

/**
 * Stacks the HTML, CSS and JavaScript editors into one panel.
 */
export default function EditorPanel({ code, onChange, onRun, onSave }) {
  return (
    <div className="flex h-full min-h-0 flex-col divide-y divide-cc-border">
      <div className="min-h-0 flex-1">
        <CodeEditor
          language="html"
          value={code.html}
          onChange={(val) => onChange('html', val)}
          onRun={onRun}
          onSave={onSave}
        />
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor
          language="css"
          value={code.css}
          onChange={(val) => onChange('css', val)}
          onRun={onRun}
          onSave={onSave}
        />
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor
          language="javascript"
          value={code.javascript}
          onChange={(val) => onChange('javascript', val)}
          onRun={onRun}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
