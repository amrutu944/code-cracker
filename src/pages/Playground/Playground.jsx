import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditorPanel from '../../components/EditorPanel/EditorPanel.jsx';
import Preview from '../../components/Preview/Preview.jsx';
import Console from '../../components/Console/Console.jsx';
import RunButton from '../../components/RunButton/RunButton.jsx';
import SaveStatus from '../../components/SaveStatus/SaveStatus.jsx';
import ProjectSelector from '../../components/ProjectSelector/ProjectSelector.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useCodeRunner } from '../../hooks/useCodeRunner.js';
import { useAutosave, SAVE_STATUS } from '../../hooks/useAutosave.js';
import * as projectStorage from '../../services/projectStorage.js';

const EMPTY_PROJECT = {
  id: null,
  name: 'Untitled Playground',
  html: projectStorage.STARTER_CODE.html,
  css: projectStorage.STARTER_CODE.css,
  javascript: projectStorage.STARTER_CODE.javascript,
};

export default function Playground() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { srcDoc, consoleEntries, runId, run, clearConsole, iframeRef } = useCodeRunner();

  const [project, setProject] = useState(null);
  const [code, setCode] = useState({ html: '', css: '', javascript: '' });
  const [loadError, setLoadError] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const hasRunOnce = useRef(false);

  // Load or create the project this route refers to.
  useEffect(() => {
    if (!projectId) {
      setProject(EMPTY_PROJECT);
      setCode({ html: EMPTY_PROJECT.html, css: EMPTY_PROJECT.css, javascript: EMPTY_PROJECT.javascript });
      setShowOnboarding(!projectStorage.hasSeenOnboarding());
      return;
    }
    const existing = projectStorage.getProject(projectId);
    if (!existing) {
      setLoadError('That project could not be found. It may have been deleted.');
      return;
    }
    setProject(existing);
    setCode({ html: existing.html, css: existing.css, javascript: existing.javascript });
  }, [projectId]);

  const persist = useCallback(
    (nextCode) => {
      if (!project) return;
      if (!project.id) {
        const created = projectStorage.createProject(project.name, nextCode);
        setProject(created);
        navigate(`/playground/${created.id}`, { replace: true });
        return;
      }
      const updated = projectStorage.updateProject(project.id, nextCode);
      setProject(updated);
    },
    [project, navigate]
  );

  const { status: saveStatus, saveNow } = useAutosave(code, persist);

  const runCode = useCallback(() => {
    hasRunOnce.current = true;
    run(code);
  }, [code, run]);

  // Run once automatically so beginners see output without hunting for the button.
  useEffect(() => {
    if (project && !hasRunOnce.current) {
      hasRunOnce.current = true;
      run(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  function updateCode(language, value) {
    setCode((prev) => ({ ...prev, [language]: value }));
  }

  function handleSave() {
    if (project?.id) saveNow();
  }

  function handleRename(newName) {
    if (project?.id) {
      const updated = projectStorage.renameProject(project.id, newName);
      setProject(updated);
    } else {
      setProject((prev) => ({ ...prev, name: newName }));
    }
  }

  function hasUnsavedWork() {
    return (
      code.html !== projectStorage.STARTER_CODE.html ||
      code.css !== projectStorage.STARTER_CODE.css ||
      code.javascript !== projectStorage.STARTER_CODE.javascript
    );
  }

  function requestReset() {
    setResetDialogOpen(true);
  }

  function confirmReset() {
    const starter = projectStorage.STARTER_CODE;
    setCode({ html: starter.html, css: starter.css, javascript: starter.javascript });
    clearConsole();
    run(starter);
    setResetDialogOpen(false);
  }

  function dismissOnboarding() {
    projectStorage.markOnboardingSeen();
    setShowOnboarding(false);
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-cc-text">Project not found</h1>
        <p className="mt-2 text-sm text-cc-muted">{loadError}</p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mt-6 rounded-cc bg-cc-accent px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          Go to My Projects
        </button>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-cc-border bg-cc-panel px-3 py-2">
        <div className="flex items-center gap-2">
          <ProjectSelector name={project.name} onRename={handleRename} />
          {project.id && <SaveStatus status={saveStatus} />}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={requestReset}
            title="Reset to starter code"
            className="flex items-center gap-1.5 rounded-cc border border-cc-border px-3 py-2 text-sm font-medium text-cc-muted hover:bg-cc-panel2 hover:text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cc-accent2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 4v5h5M20 20v-5h-5M4.5 15a8 8 0 0014.9 2.5M19.5 9A8 8 0 004.6 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reset
          </button>
          <RunButton onClick={runCode} />
        </div>
      </header>

      {showOnboarding && (
        <div className="flex items-start justify-between gap-3 border-b border-cc-border bg-cc-accent/10 px-4 py-2.5 text-sm text-cc-text">
          <p>
            <strong>Welcome to Code Cracker 👋</strong> Write HTML, CSS and JavaScript and click Run to see your result.
          </p>
          <button type="button" onClick={dismissOnboarding} aria-label="Dismiss welcome message" className="shrink-0 text-cc-muted hover:text-cc-text">
            ✕
          </button>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 border-b border-cc-border lg:border-b-0 lg:border-r">
          <EditorPanel code={code} onChange={updateCode} onRun={runCode} onSave={handleSave} />
        </div>
        <div className="grid min-h-0 grid-rows-[1fr_auto] lg:grid-rows-[minmax(0,1fr)_minmax(0,220px)]">
          <div className="min-h-[240px]">
            <Preview srcDoc={srcDoc} iframeRef={iframeRef} onRefresh={runCode} runId={runId} />
          </div>
          <div className="min-h-[160px] border-t border-cc-border">
            <Console entries={consoleEntries} onClear={clearConsole} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        title="Reset this project?"
        message={
          hasUnsavedWork()
            ? 'This will replace your HTML, CSS and JavaScript with the starter code. This cannot be undone.'
            : 'This will restore the starter HTML, CSS and JavaScript.'
        }
        confirmLabel="Reset"
        danger
        onConfirm={confirmReset}
        onCancel={() => setResetDialogOpen(false)}
      />
    </div>
  );
}
