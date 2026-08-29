import { useCallback, useEffect, useRef, useState } from 'react';
import { buildPreviewDocument } from '../utils/codeRunner.js';
import { formatConsoleEntry } from '../utils/errorParser.js';

let runCounter = 0;

/**
 * Owns the sandboxed preview lifecycle: builds the srcdoc document from the
 * student's code, listens for validated postMessage events from the iframe,
 * and exposes console entries plus a run/clear API.
 */
export function useCodeRunner() {
  const [srcDoc, setSrcDoc] = useState('');
  const [consoleEntries, setConsoleEntries] = useState([]);
  const [runId, setRunId] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    function handleMessage(event) {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.source !== 'code-cracker-preview') return;
      if (data.type === 'console') {
        if (!['log', 'warn', 'error', 'info'].includes(data.level)) return;
        setConsoleEntries((prev) => [
          ...prev,
          formatConsoleEntry({ level: data.level, message: String(data.message ?? '') }),
        ]);
      } else if (data.type === 'error') {
        setConsoleEntries((prev) => [
          ...prev,
          formatConsoleEntry({
            level: 'error',
            message: String(data.message ?? 'Unknown error'),
            errorName: data.errorName ? String(data.errorName) : 'Error',
            lineNumber: typeof data.lineNumber === 'number' ? data.lineNumber : null,
          }),
        ]);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const run = useCallback(({ html, css, javascript }) => {
    runCounter += 1;
    setConsoleEntries([]);
    setSrcDoc(buildPreviewDocument({ html, css, javascript }));
    setRunId(runCounter);
  }, []);

  const clearConsole = useCallback(() => {
    setConsoleEntries([]);
  }, []);

  return { srcDoc, consoleEntries, runId, run, clearConsole, iframeRef };
}
