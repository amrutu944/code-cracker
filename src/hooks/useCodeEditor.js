import { useCallback } from 'react';

/**
 * Wires up common Monaco editor behavior: beginner-friendly options and
 * keyboard shortcuts (Ctrl/Cmd+Enter to run, Ctrl/Cmd+S to save) that are
 * bound per-editor-instance without leaking Monaco internals into the UI.
 */
export function useCodeEditor({ onRun, onSave }) {
  const handleMount = useCallback(
    (editor, monaco) => {
      if (onRun) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun());
      }
      if (onSave) {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave());
      }
    },
    [onRun, onSave]
  );

  const editorOptions = {
    fontSize: 14,
    minimap: { enabled: false },
    wordWrap: 'on',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    tabSize: 2,
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    renderLineHighlight: 'gutter',
    folding: true,
    matchBrackets: 'always',
    bracketPairColorization: { enabled: true },
    fixedOverflowWidgets: true,
    padding: { top: 12, bottom: 12 },
  };

  return { handleMount, editorOptions };
}
