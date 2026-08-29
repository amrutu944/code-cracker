import { useState, useEffect } from 'react';
import { CHALLENGES_DATA } from '../../data/challengesData.js';
import { getChallengeProgress, markChallengeCompleted } from '../../services/challengeService.js';
import CodeEditor from '../../components/CodeEditor/CodeEditor.jsx';
import Console from '../../components/Console/Console.jsx';
import Preview from '../../components/Preview/Preview.jsx';
import { executeCode } from '../../services/codeExecutionService.js';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  Play,
  Lightbulb,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Code2,
} from 'lucide-react';

export default function Challenges() {
  const [progress, setProgress] = useState(getChallengeProgress());
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Challenge workspace code state
  const [code, setCode] = useState({ html: '', css: '', javascript: '' });
  const [programCode, setProgramCode] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState([]);

  useEffect(() => {
    setProgress(getChallengeProgress());
  }, []);

  function handleSelectChallenge(challenge) {
    setActiveChallenge(challenge);
    setTestResults([]);
    setShowHint(false);
    setConsoleEntries([]);
    if (challenge.language === 'web') {
      setCode({
        html: challenge.starterCode.html || '',
        css: challenge.starterCode.css || '',
        javascript: challenge.starterCode.javascript || '',
      });
      setActiveTab('html');
    } else {
      setProgramCode(challenge.starterCode.code || '');
    }
  }

  const filteredChallenges = CHALLENGES_DATA.filter((c) => {
    if (filterDifficulty === 'All') return true;
    return c.difficulty === filterDifficulty;
  });

  // Run test cases against current code
  async function runChallengeTests() {
    if (!activeChallenge) return;
    setIsRunningTests(true);

    const results = [];
    let allPassed = true;

    if (activeChallenge.language === 'web') {
      // Create off-screen sandbox iframe to execute HTML/CSS/JS
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const combinedHTML = `
        <!DOCTYPE html>
        <html>
          <head><style>${code.css}</style></head>
          <body>
            ${code.html}
            <script>
              ${code.javascript}
            </script>
          </body>
        </html>
      `;

      iframe.srcdoc = combinedHTML;

      await new Promise((res) => {
        iframe.onload = res;
        setTimeout(res, 400);
      });

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const win = iframe.contentWindow;

      for (const test of activeChallenge.tests) {
        try {
          const passed = test.checkWeb ? test.checkWeb(doc, win) : false;
          results.push({ description: test.description, passed });
          if (!passed) allPassed = false;
        } catch (err) {
          results.push({ description: test.description, passed: false });
          allPassed = false;
        }
      }

      document.body.removeChild(iframe);
    } else {
      // Non-web Python/C/C++/Java execution test check
      const execRes = await executeCode({
        language: activeChallenge.language,
        code: programCode,
      });

      const output = execRes.output || '';
      for (const test of activeChallenge.tests) {
        const passed = test.checkOutput ? test.checkOutput(output) : false;
        results.push({ description: test.description, passed });
        if (!passed) allPassed = false;
      }
    }

    setTestResults(results);
    setIsRunningTests(false);

    if (allPassed && results.length > 0) {
      const updated = markChallengeCompleted(activeChallenge.id, activeChallenge.xp);
      setProgress(updated);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }

  // Challenge workspace view
  if (activeChallenge) {
    return (
      <div className="flex h-[calc(100vh-56px)] flex-col bg-cc-bg">
        {/* Top Header */}
        <div className="flex h-14 items-center justify-between border-b border-cc-border bg-cc-panel px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChallenge(null)}
              className="flex items-center gap-1.5 rounded-lg border border-cc-border bg-cc-panel2 px-3 py-1.5 text-xs font-semibold text-cc-text hover:bg-cc-border"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Challenges</span>
            </button>
            <h2 className="text-base font-bold text-cc-text">{activeChallenge.title}</h2>
            <span className="rounded bg-cc-accent/20 px-2 py-0.5 text-xs font-bold text-cc-accent">
              +{activeChallenge.xp} XP
            </span>
          </div>

          <button
            onClick={runChallengeTests}
            disabled={isRunningTests}
            className="flex items-center gap-2 rounded-lg bg-cc-accent px-5 py-2 text-xs font-bold text-black shadow-lg shadow-cc-accent/20 hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-black" />
            <span>{isRunningTests ? 'Evaluating...' : 'Submit & Check Tests'}</span>
          </button>
        </div>

        {/* Challenge Split Screen */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[400px_1fr]">
          {/* Left Instructions & Test Panel */}
          <div className="flex flex-col overflow-y-auto border-r border-cc-border bg-cc-panel p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cc-accent2">
                {activeChallenge.difficulty} • {activeChallenge.category}
              </span>
              {progress.completedIds.includes(activeChallenge.id) && (
                <span className="flex items-center gap-1 text-xs font-bold text-cc-accent">
                  <CheckCircle2 className="h-4 w-4" /> Completed
                </span>
              )}
            </div>

            <h1 className="mt-2 text-xl font-extrabold text-cc-text">{activeChallenge.title}</h1>
            <p className="mt-2 text-sm text-cc-muted">{activeChallenge.summary}</p>

            <div className="mt-5 rounded-xl border border-cc-border bg-cc-panel2 p-4 text-sm leading-relaxed text-slate-300">
              <h3 className="font-bold text-cc-text mb-2">Instructions</h3>
              <div className="whitespace-pre-line text-xs font-sans">{activeChallenge.instructions}</div>
            </div>

            {/* Hints */}
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>
              {showHint && (
                <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  {activeChallenge.hints.map((h, i) => (
                    <p key={i}>• {h}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Test Results Section */}
            <div className="mt-6 border-t border-cc-border pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cc-muted">
                Validation Tests
              </h3>

              {testResults.length === 0 ? (
                <p className="mt-3 text-xs text-cc-muted">
                  Click "Submit & Check Tests" to test your solution.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {testResults.map((res, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-xs font-medium ${
                        res.passed
                          ? 'border-cc-accent/40 bg-cc-accent/10 text-cc-accent'
                          : 'border-red-500/40 bg-red-500/10 text-red-400'
                      }`}
                    >
                      {res.passed ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0" />
                      )}
                      <span>{res.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Editor Workspace */}
          <div className="flex min-h-0 flex-col bg-[#0b1120]">
            {activeChallenge.language === 'web' ? (
              <div className="flex h-full flex-col">
                <div className="flex h-10 shrink-0 items-center border-b border-slate-800 bg-[#111827] px-2">
                  {['html', 'css', 'javascript'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-bold uppercase ${
                        activeTab === tab
                          ? 'border-b-2 border-cc-accent text-white bg-[#0b1120]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    language={activeTab}
                    value={code[activeTab]}
                    onChange={(val) => setCode((prev) => ({ ...prev, [activeTab]: val }))}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="h-10 shrink-0 border-b border-slate-800 bg-[#111827] px-4 flex items-center text-xs font-bold text-slate-300">
                  {activeChallenge.language.toUpperCase()}
                </div>
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    language={activeChallenge.language}
                    value={programCode}
                    onChange={setProgramCode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Challenge Catalog list view
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-cc-border bg-gradient-to-r from-cc-panel via-cc-panel2 to-cc-panel p-8 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-cc-accent" />
            <h1 className="text-3xl font-extrabold text-cc-text">Coding Challenges</h1>
          </div>
          <p className="mt-2 max-w-xl text-sm text-cc-muted">
            Solve bite-sized coding challenges, test your skills, get instant feedback, and earn XP badges!
          </p>
        </div>

        {/* User Stats Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-cc-border bg-cc-bg px-4 py-3">
            <Award className="h-8 w-8 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-cc-muted">Total Score</p>
              <p className="text-xl font-black text-cc-text">{progress.xp} XP</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-cc-border bg-cc-bg px-4 py-3">
            <Flame className="h-8 w-8 text-cc-accent" />
            <div>
              <p className="text-xs font-semibold text-cc-muted">Completed</p>
              <p className="text-xl font-black text-cc-text">
                {progress.completedIds.length} / {CHALLENGES_DATA.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex items-center justify-between border-b border-cc-border pb-4">
        <div className="flex items-center gap-2">
          {['All', 'Beginner', 'Intermediate'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                filterDifficulty === diff
                  ? 'bg-cc-accent text-black'
                  : 'bg-cc-panel text-cc-muted hover:bg-cc-panel2 hover:text-cc-text'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-cc-muted">
          Showing {filteredChallenges.length} challenges
        </span>
      </div>

      {/* Challenge Cards Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => {
          const isDone = progress.completedIds.includes(challenge.id);

          return (
            <div
              key={challenge.id}
              onClick={() => handleSelectChallenge(challenge)}
              className={`group flex cursor-pointer flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                isDone
                  ? 'border-cc-accent/30 bg-cc-accent/5'
                  : 'border-cc-border bg-cc-panel hover:border-cc-accent2/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-cc-panel2 px-2.5 py-1 text-[11px] font-bold text-cc-accent2 border border-cc-border">
                    {challenge.category.toUpperCase()}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-cc-accent">
                      <CheckCircle2 className="h-4 w-4" /> Solved
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400">+{challenge.xp} XP</span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-cc-text group-hover:text-cc-accent transition">
                  {challenge.title}
                </h3>
                <p className="mt-2 text-xs text-cc-muted leading-relaxed line-clamp-2">
                  {challenge.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-cc-border/60 pt-4">
                <span className="text-xs font-semibold text-cc-muted">
                  Difficulty: <strong className="text-cc-text">{challenge.difficulty}</strong>
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-cc-accent group-hover:translate-x-1 transition">
                  Solve <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
