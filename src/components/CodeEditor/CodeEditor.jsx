import Editor from '@monaco-editor/react';

const LANGUAGE_MAP = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  python: 'python',
  'python3.10': 'python',
  'python3.8-ml': 'python',
  'python3.9': 'python',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
};

export default function CodeEditor({
  language = 'javascript',
  value = '',
  onChange,
  height = '100%',
}) {
  const monacoLanguage =
    LANGUAGE_MAP[language] || language;

  function handleChange(newValue) {
    if (onChange) {
      onChange(newValue ?? '');
    }
  }

  return (
    <div className="h-full w-full overflow-hidden bg-[#0b1120]">
      <Editor
        height={height}
        language={monacoLanguage}
        value={value}
        onChange={handleChange}
        theme="code-cracker-dark"
        beforeMount={(monaco) => {
          monaco.editor.defineTheme(
            'code-cracker-dark',
            {
              base: 'vs-dark',
              inherit: true,
              rules: [
                {
                  token: 'comment',
                  foreground: '64748B',
                },
                {
                  token: 'keyword',
                  foreground: 'C084FC',
                },
                {
                  token: 'string',
                  foreground: '86EFAC',
                },
                {
                  token: 'number',
                  foreground: 'FDE68A',
                },
                {
                  token: 'type',
                  foreground: '67E8F9',
                },
              ],
              colors: {
                'editor.background': '#0B1120',
                'editor.foreground': '#E2E8F0',
                'editorLineNumber.foreground':
                  '#475569',
                'editorLineNumber.activeForeground':
                  '#CBD5E1',
                'editorCursor.foreground':
                  '#A78BFA',
                'editor.selectionBackground':
                  '#334155',
                'editor.inactiveSelectionBackground':
                  '#1E293B',
                'editor.lineHighlightBackground':
                  '#111827',
                'editorIndentGuide.background':
                  '#1E293B',
                'editorIndentGuide.activeBackground':
                  '#334155',
              },
            }
          );
        }}
        options={{
          automaticLayout: true,

          fontSize: 14,
          lineHeight: 22,
          fontFamily:
            'Consolas, "Courier New", monospace',

          minimap: {
            enabled: false,
          },

          padding: {
            top: 16,
            bottom: 16,
          },

          scrollBeyondLastLine: false,

          smoothScrolling: true,

          cursorBlinking: 'smooth',

          cursorSmoothCaretAnimation: 'on',

          renderLineHighlight: 'line',

          roundedSelection: false,

          tabSize: 2,

          insertSpaces: true,

          wordWrap: 'off',

          folding: true,

          foldingHighlight: true,

          showFoldingControls: 'mouseover',

          bracketPairColorization: {
            enabled: true,
          },

          guides: {
            indentation: true,
            bracketPairs: true,
          },

          suggest: {
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
          },

          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            useShadows: false,
          },

          overviewRulerBorder: false,

          hideCursorInOverviewRuler: true,

          renderWhitespace: 'selection',
        }}
      />
    </div>
  );
}