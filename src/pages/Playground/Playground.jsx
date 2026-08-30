import { useCallback, useEffect, useRef, useState } from 'react';
import { executeCode } from '../../services/codeExecutionService.js';
import { useNavigate, useParams } from 'react-router-dom';

import EditorPanel from '../../components/EditorPanel/EditorPanel.jsx';
import Preview from '../../components/Preview/Preview.jsx';
import Console from '../../components/Console/Console.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.jsx';
import InputPanel from '../../components/InputPanel/InputPanel.jsx';
import OutputPanel from '../../components/OutputPanel/OutputPanel.jsx';
import CodeEditor from '../../components/CodeEditor/CodeEditor.jsx';
import TemplatesModal from '../../components/TemplatesModal.jsx';
import SettingsModal from '../../components/SettingsModal.jsx';
import ShortcutsModal from '../../components/ShortcutsModal.jsx';

import { useCodeRunner } from '../../hooks/useCodeRunner.js';
import * as projectStorage from '../../services/projectStorage.js';
import NewProjectDialog from '../../components/NewProjectDialog.jsx';

import {
  Save,
  RotateCcw,
  Settings,
  Sparkles,
  Keyboard,
  Download,
  Play,
  Copy,
  Check,
} from 'lucide-react';

const EMPTY_PROJECT = {
  id: null,
  name: 'Untitled Playground',
  html: projectStorage.STARTER_CODE.html,
  css: projectStorage.STARTER_CODE.css,
  javascript: projectStorage.STARTER_CODE.javascript,
};

const DEFAULT_CODE = {
  web: {
    html: projectStorage.STARTER_CODE.html,
    css: projectStorage.STARTER_CODE.css,
    javascript: projectStorage.STARTER_CODE.javascript,
  },
  'python3.10': `print("Hello, Code Cracker!")\n\nscores = [90, 85, 95, 100]\nprint("Average:", sum(scores) / len(scores))`,
  'python3.8-ml': `print("Hello, Code Cracker ML Playground!")`,
  'python3.9': `print("Hello, Code Cracker Python 3.9!")`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, Code Cracker!\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Code Cracker!" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Code Cracker!");\n    }\n}`,
};

const NON_WEB_LANGUAGES = ['python3.10', 'python3.8-ml', 'python3.9', 'c', 'cpp', 'java'];

function isWebLanguage(language) {
  return language === 'web';
}

export default function Playground() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { srcDoc, consoleEntries, runId, run, clearConsole, iframeRef } = useCodeRunner();

  const [project, setProject] = useState(null);
  const [code, setCode] = useState({ html: '', css: '', javascript: '' });
  const [language, setLanguage] = useState('web');
  const [programCode, setProgramCode] = useState(DEFAULT_CODE['python3.10']);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [executionError, setExecutionError] = useState('');

  const [loadError, setLoadError] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Modals state
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(220);
  const previewColumnRef = useRef(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Settings
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'off',
  });

  const hasRunOnce = useRef(false);

  useEffect(() => {
    if (!projectId) {
      setProject(EMPTY_PROJECT);
      setCode({
        html: EMPTY_PROJECT.html,
        css: EMPTY_PROJECT.css,
        javascript: EMPTY_PROJECT.javascript,
      });
      setLanguage('web');
      setProgramCode(DEFAULT_CODE['python3.10']);
      setInput('');
      setOutput('');
      setExecutionError('');
      setShowOnboarding(!projectStorage.hasSeenOnboarding());
      return;
    }

    const existing = projectStorage.getProject(projectId);
    if (!existing) {
      setLoadError('That project could not be found. It may have been deleted.');
      return;
    }

    setProject(existing);
    setCode({
      html: existing.html || '',
      css: existing.css || '',
      javascript: existing.javascript || '',
    });

    const existingLanguage = existing.language || 'web';
    setLanguage(existingLanguage);
    setProgramCode(existing.code || DEFAULT_CODE[existingLanguage] || DEFAULT_CODE['python3.10']);
    setInput(existing.input || '');
    setOutput('');
    setExecutionError('');
  }, [projectId]);

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    setOutput('');
    setExecutionError('');
    if (nextLanguage === 'web') return;
    if (DEFAULT_CODE[nextLanguage]) {
      setProgramCode(DEFAULT_CODE[nextLanguage]);
    }
  }

  function updateCode(editorLanguage, value) {
    setCode((prev) => ({
      ...prev,
      [editorLanguage]: value,
    }));
  }

  const runCode = useCallback(async () => {
    setOutput('');
    setExecutionError('');

    if (isWebLanguage(language)) {
      run(code);
      return;
    }

    try {
      const result = await executeCode({
        language,
        code: programCode,
        input,
      });

      if (result.success) {
        setOutput(result.output || '');
        setExecutionError('');
      } else {
        setOutput(result.output || '');
        setExecutionError(result.error || 'Program failed.');
      }
    } catch (error) {
      setOutput('');
      setExecutionError(error.message || 'Unable to execute program.');
    }
  }, [language, code, programCode, input, run]);

  useEffect(() => {
    if (project && isWebLanguage(language) && !hasRunOnce.current) {
      hasRunOnce.current = true;
      run(code);
    }
  }, [project, language, code, run]);

  // Hotkey listener (Ctrl+Enter to run, Ctrl+S to save)
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveDialogOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runCode]);

  function handleSave() {
    setSaveDialogOpen(true);
  }

  function saveProject(name) {
    const projectData = {
      ...code,
      language,
      code: programCode,
      input,
    };

    if (project.id) {
      setProject(projectStorage.updateProject(project.id, { ...projectData, name }));
    } else {
      const created = projectStorage.createProject(name, projectData);
      setProject(created);
      navigate(`/playground/${created.id}`, { replace: true });
    }

    setSaveDialogOpen(false);
  }

  function startConsoleResize(event) {
    event.preventDefault();
    const containerHeight = previewColumnRef.current?.getBoundingClientRect().height || 0;
    const startY = event.clientY;
    const startHeight = consoleHeight;
    const minConsoleHeight = 120;
    const maxConsoleHeight = Math.max(minConsoleHeight, containerHeight - 180);

    function resize(moveEvent) {
      const nextHeight = startHeight + startY - moveEvent.clientY;
      setConsoleHeight(Math.min(maxConsoleHeight, Math.max(minConsoleHeight, nextHeight)));
    }

    function stopResize() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', resize);
      window.removeEventListener('pointerup', stopResize);
    }

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
    window.addEventListener('pointermove', resize);
    window.addEventListener('pointerup', stopResize, { once: true });
  }

  function resizeConsoleBy(amount) {
    const containerHeight = previewColumnRef.current?.getBoundingClientRect().height || 0;
    const maxConsoleHeight = Math.max(120, containerHeight - 180);
    setConsoleHeight((current) => Math.min(maxConsoleHeight, Math.max(120, current + amount)));
  }

  function handleCopyCode() {
    const textToCopy = isWebLanguage(language)
      ? `<!-- HTML -->\n${code.html}\n\n/* CSS */\n${code.css}\n\n// JS\n${code.javascript}`
      : programCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadProject() {
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${project?.name || 'Code Cracker Export'}</title>
  <style>${code.css}</style>
</head>
<body>
  ${code.html}
  <script>${code.javascript}</script>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(project?.name || 'project').toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSelectTemplate(tmpl) {
    if (tmpl.code.language) {
      setLanguage(tmpl.code.language);
      setProgramCode(tmpl.code.programCode);
    } else {
      setLanguage('web');
      setCode({
        html: tmpl.code.html,
        css: tmpl.code.css,
        javascript: tmpl.code.javascript,
      });
      run(tmpl.code);
    }
  }

  function confirmReset() {
    if (isWebLanguage(language)) {
      const starter = projectStorage.STARTER_CODE;
      setCode({
        html: starter.html,
        css: starter.css,
        javascript: starter.javascript,
      });
      clearConsole();
      run(starter);
    } else {
      setProgramCode(DEFAULT_CODE[language] || DEFAULT_CODE['python3.10']);
      setInput('');
      setOutput('');
      setExecutionError('');
    }
    setResetDialogOpen(false);
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-cc-text">Project not found</h1>
        <p className="mt-2 text-sm text-cc-muted">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mt-6 rounded-xl bg-cc-accent px-5 py-2.5 text-xs font-bold text-black hover:brightness-110"
        >
          Go to My Projects
        </button>
      </div>
    );
  }

  if (!project) return null;

  const webMode = language === 'web';
  const languageCode = NON_WEB_LANGUAGES.includes(language) ? language : 'python3.10';

  return (
    <div className="flex h-[calc(100vh-56px)] min-h-0 flex-col overflow-hidden bg-cc-bg">
      {/* Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-cc-border bg-cc-panel px-4">
        <div className="flex items-center gap-3">
          <LanguageSelector value={language} onChange={handleLanguageChange} />

          <button
            onClick={() => setTemplatesOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-cc-border bg-cc-panel2 px-3 py-1.5 text-xs font-bold text-cc-accent hover:border-cc-accent/50"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy Code"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel2 text-cc-muted hover:text-cc-text transition"
          >
            {copied ? <Check className="h-4 w-4 text-cc-accent" /> : <Copy className="h-4 w-4" />}
          </button>

          {/* Download HTML */}
          {webMode && (
            <button
              type="button"
              onClick={handleDownloadProject}
              title="Download HTML"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel2 text-cc-muted hover:text-cc-text transition"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          {/* Settings */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            title="Editor Settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel2 text-cc-muted hover:text-cc-text transition"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Shortcuts */}
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            title="Keyboard Shortcuts"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel2 text-cc-muted hover:text-cc-text transition"
          >
            <Keyboard className="h-4 w-4" />
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            title="Save Project"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel2 text-cc-muted hover:text-cc-text transition"
          >
            <Save className="h-4 w-4" />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => setResetDialogOpen(true)}
            title="Reset Project"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cc-border bg-cc-panel2 text-cc-muted hover:text-cc-text transition"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Onboarding Notice */}
      {showOnboarding && (
        <div className="flex shrink-0 items-center justify-between border-b border-cc-border bg-cc-accent/10 px-4 py-2 text-xs text-cc-text">
          <p>
            <strong>Welcome to Code Cracker 👋</strong> Write code and press{' '}
            <kbd className="rounded bg-cc-panel px-1 py-0.5 font-mono text-[10px] text-cc-accent">
              Ctrl + Enter
            </kbd>{' '}
            or click Run Code to execute.
          </p>
          <button
            type="button"
            onClick={() => {
              projectStorage.markOnboardingSeen();
              setShowOnboarding(false);
            }}
            className="text-cc-muted hover:text-cc-text font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Web Mode Split Screen */}
      {webMode ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)]">
          <div className="min-h-0 border-r border-cc-border">
            <EditorPanel
              code={code}
              onChange={updateCode}
              onRun={runCode}
              onSave={handleSave}
              settings={editorSettings}
            />
          </div>

          <div
            ref={previewColumnRef}
            className="grid min-h-0"
            style={{ gridTemplateRows: `minmax(180px, 1fr) 10px minmax(120px, ${consoleHeight}px)` }}
          >
            <div className="min-h-0">
              <Preview srcDoc={srcDoc} iframeRef={iframeRef} onRefresh={runCode} runId={runId} />
            </div>
            <div
              role="separator"
              aria-label="Resize console"
              aria-orientation="horizontal"
              aria-valuemin={120}
              aria-valuenow={Math.round(consoleHeight)}
              tabIndex={0}
              onPointerDown={startConsoleResize}
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  resizeConsoleBy(24);
                }
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  resizeConsoleBy(-24);
                }
              }}
              className="group relative z-10 flex cursor-row-resize items-center justify-center bg-cc-panel2 outline-none hover:bg-cc-accent/10 focus-visible:bg-cc-accent/15"
              title="Drag to resize console"
            >
              <span className="h-1 w-10 rounded-full bg-cc-border transition group-hover:bg-cc-accent group-focus-visible:bg-cc-accent" />
            </div>
            <div className="min-h-0">
              <Console entries={consoleEntries} onClear={clearConsole} />
            </div>
          </div>
        </div>
      ) : (
        /* Programming Language Mode (Python / C / C++ / Java) */
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)]">
          <div className="min-h-0 border-r border-cc-border flex flex-col bg-[#0b1120]">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-800 bg-[#111827] px-4">
              <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                {languageCode}
              </span>
            </div>

            <div className="min-h-0 flex-1">
              <CodeEditor
                language={languageCode}
                value={programCode}
                onChange={setProgramCode}
                options={editorSettings}
              />
            </div>

            <div className="flex shrink-0 justify-end gap-2.5 border-t border-slate-800 bg-[#111827] px-4 py-2.5">
              <button type="button" onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white">
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
              <button type="button" onClick={runCode} className="inline-flex items-center gap-1.5 rounded-lg bg-cc-accent px-5 py-1.5 text-xs font-bold text-black shadow-sm shadow-cc-accent/20 hover:brightness-110 active:scale-95">
                <Play className="h-3.5 w-3.5 fill-black" />
                <span>Run Code</span>
              </button>
            </div>
          </div>

          <div
            ref={previewColumnRef}
            className="grid min-h-0 bg-cc-bg p-3"
            style={{ gridTemplateRows: `minmax(160px, 1fr) 10px minmax(120px, ${consoleHeight}px)` }}
          >
            <InputPanel value={input} onChange={setInput} />
            <div
              role="separator"
              aria-label="Resize output panel"
              aria-orientation="horizontal"
              aria-valuemin={120}
              aria-valuenow={Math.round(consoleHeight)}
              tabIndex={0}
              onPointerDown={startConsoleResize}
              onKeyDown={(event) => {
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  resizeConsoleBy(24);
                }
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  resizeConsoleBy(-24);
                }
              }}
              className="group relative z-10 flex cursor-row-resize items-center justify-center outline-none hover:bg-cc-accent/10 focus-visible:bg-cc-accent/15"
              title="Drag to resize output panel"
            >
              <span className="h-1 w-10 rounded-full bg-cc-border transition group-hover:bg-cc-accent group-focus-visible:bg-cc-accent" />
            </div>
            <OutputPanel output={output} error={executionError} />
          </div>
        </div>
      )}

      {/* Dialog Modals */}
      <TemplatesModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={editorSettings}
        onUpdateSettings={setEditorSettings}
      />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      <NewProjectDialog
        open={saveDialogOpen}
        initialName={project.name || 'Untitled Project'}
        title={project.id ? 'Save project' : 'Save a new project'}
        submitLabel="Save Project"
        onCreate={saveProject}
        onCancel={() => setSaveDialogOpen(false)}
      />

      <ConfirmDialog
        open={resetDialogOpen}
        title="Reset this project?"
        message="This will restore the starter code for the selected language."
        confirmLabel="Reset"
        danger
        onConfirm={confirmReset}
        onCancel={() => setResetDialogOpen(false)}
      />
    </div>
  );
}
