import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEARN_DATA } from '../../data/learnData.js';
import { getLearnProgress, markLessonCompleted } from '../../services/learnService.js';
import * as projectStorage from '../../services/projectStorage.js';
import {
  BookOpen,
  CheckCircle2,
  Play,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Layout,
  Code2,
  Terminal,
} from 'lucide-react';

const ICON_MAP = {
  Layout: Layout,
  Code2: Code2,
  Terminal: Terminal,
};

export default function Learn() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getLearnProgress());
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    setProgress(getLearnProgress());
  }, []);

  function handleOpenLesson(course, lesson) {
    setSelectedCourse(course);
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
  }

  function handleTryInPlayground(codeExample) {
    if (!codeExample) return;
    const created = projectStorage.createProject(`Lesson - ${activeLesson.title}`, codeExample);
    navigate(`/playground/${created.id}`);
  }

  function handleQuizSubmit() {
    setQuizSubmitted(true);
    if (selectedOption === activeLesson.quiz.correctIndex) {
      const updated = markLessonCompleted(activeLesson.id);
      setProgress(updated);
    }
  }

  // Lesson player view
  if (activeLesson) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <button
          onClick={() => setActiveLesson(null)}
          className="flex items-center gap-1.5 rounded-lg border border-cc-border bg-cc-panel px-3 py-1.5 text-xs font-semibold text-cc-text hover:bg-cc-panel2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Lessons</span>
        </button>

        <div className="rounded-2xl border border-cc-border bg-cc-panel p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-cc-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cc-accent2">
                {selectedCourse?.title}
              </span>
              <h1 className="mt-1 text-2xl font-extrabold text-cc-text">{activeLesson.title}</h1>
            </div>
            <span className="rounded bg-cc-panel2 px-3 py-1 text-xs font-medium text-cc-muted border border-cc-border">
              {activeLesson.duration}
            </span>
          </div>

          {/* Lesson Body Content */}
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
            <div className="whitespace-pre-line font-sans">{activeLesson.content}</div>
          </div>

          {/* Live Code Example Block */}
          {activeLesson.codeExample && (
            <div className="mt-8 rounded-xl border border-cc-border bg-cc-panel2 p-5">
              <div className="flex items-center justify-between border-b border-cc-border/60 pb-3">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cc-accent">
                  <Sparkles className="h-4 w-4" /> Interactive Code Example
                </span>
                <button
                  onClick={() => handleTryInPlayground(activeLesson.codeExample)}
                  className="flex items-center gap-1.5 rounded-lg bg-cc-accent px-3 py-1.5 text-xs font-bold text-black hover:brightness-110"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Try in Playground</span>
                </button>
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg bg-[#0b1120] p-4 font-mono text-xs text-slate-200">
                <pre>
                  {activeLesson.codeExample.html ||
                    activeLesson.codeExample.javascript ||
                    activeLesson.codeExample.code}
                </pre>
              </div>
            </div>
          )}

          {/* Interactive Knowledge Quiz */}
          {activeLesson.quiz && (
            <div className="mt-8 border-t border-cc-border pt-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-cc-text">
                <HelpCircle className="h-5 w-5 text-cc-accent2" />
                <span>Knowledge Check</span>
              </h3>
              <p className="mt-2 text-sm text-slate-300">{activeLesson.quiz.question}</p>

              <div className="mt-4 space-y-2">
                {activeLesson.quiz.options.map((opt, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === activeLesson.quiz.correctIndex;

                  let borderStyle = 'border-cc-border bg-cc-panel2';
                  if (quizSubmitted) {
                    if (isCorrect) borderStyle = 'border-cc-accent bg-cc-accent/10 text-cc-accent font-bold';
                    else if (isSelected && !isCorrect) borderStyle = 'border-red-500 bg-red-500/10 text-red-400';
                  } else if (isSelected) {
                    borderStyle = 'border-cc-accent2 bg-cc-accent2/10 text-cc-accent2';
                  }

                  return (
                    <button
                      key={index}
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(index)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs font-semibold transition ${borderStyle}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleQuizSubmit}
                  className="mt-4 rounded-lg bg-cc-accent px-5 py-2 text-xs font-bold text-black disabled:opacity-40"
                >
                  Check Answer
                </button>
              ) : (
                <div className="mt-4 rounded-lg bg-cc-panel2 p-3 text-xs text-cc-muted border border-cc-border">
                  💡 {activeLesson.quiz.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Courses Catalog View
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-cc-border bg-gradient-to-r from-cc-panel via-cc-panel2 to-cc-panel p-8 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-cc-accent2" />
            <h1 className="text-3xl font-extrabold text-cc-text">Structured Learning</h1>
          </div>
          <p className="mt-2 max-w-xl text-sm text-cc-muted">
            Guided lessons covering HTML, CSS, JavaScript and Python paired directly with live code playgrounds!
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-cc-border bg-cc-bg px-4 py-3">
          <CheckCircle2 className="h-8 w-8 text-cc-accent" />
          <div>
            <p className="text-xs font-semibold text-cc-muted">Lessons Finished</p>
            <p className="text-xl font-black text-cc-text">
              {progress.completedLessonIds.length} Lessons
            </p>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="mt-10 space-y-8">
        {LEARN_DATA.map((course) => {
          const CourseIcon = ICON_MAP[course.icon] || BookOpen;

          return (
            <div key={course.id} className="rounded-2xl border border-cc-border bg-cc-panel p-6 shadow-md">
              <div className="flex items-start justify-between border-b border-cc-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cc-accent/15 text-cc-accent border border-cc-accent/20">
                    <CourseIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-cc-text">{course.title}</h2>
                    <p className="text-xs text-cc-muted mt-0.5">{course.description}</p>
                  </div>
                </div>
                <span className="rounded-full bg-cc-panel2 px-3 py-1 text-xs font-bold text-cc-accent2 border border-cc-border">
                  {course.level}
                </span>
              </div>

              {/* Lessons Grid */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.lessons.map((lesson) => {
                  const isDone = progress.completedLessonIds.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleOpenLesson(course, lesson)}
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-cc-border bg-cc-panel2 p-4 transition hover:border-cc-accent/50 hover:bg-cc-border/40"
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-cc-accent shrink-0" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-cc-border shrink-0" />
                        )}
                        <div>
                          <h3 className="text-sm font-bold text-cc-text group-hover:text-cc-accent transition">
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-cc-muted mt-0.5">{lesson.duration}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-cc-muted group-hover:translate-x-1 transition" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
