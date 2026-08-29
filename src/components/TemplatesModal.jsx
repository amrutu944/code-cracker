import { X, Code, Sparkles } from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    id: 'counter',
    name: 'Interactive Counter',
    category: 'Web App',
    description: 'A stylish click counter button with live state update.',
    code: {
      html: `<div class="card">\n  <h1>Counter App</h1>\n  <p class="count-display" id="count">0</p>\n  <div class="btn-group">\n    <button id="dec-btn">- Decrement</button>\n    <button id="inc-btn" class="primary">+ Increment</button>\n  </div>\n</div>`,
      css: `body {\n  background: #0f172a;\n  color: white;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: #1e293b;\n  padding: 32px;\n  border-radius: 16px;\n  text-align: center;\n  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);\n  width: 300px;\n}\n\n.count-display {\n  font-size: 48px;\n  font-weight: bold;\n  color: #38bdf8;\n  margin: 20px 0;\n}\n\n.btn-group {\n  display: flex;\n  gap: 12px;\n}\n\nbutton {\n  flex: 1;\n  padding: 10px;\n  border: none;\n  border-radius: 8px;\n  background: #334155;\n  color: white;\n  font-weight: 600;\n  cursor: pointer;\n}\n\nbutton.primary {\n  background: #2563eb;\n}`,
      javascript: `let count = 0;\nconst display = document.getElementById('count');\n\ndocument.getElementById('inc-btn').addEventListener('click', () => {\n  count++;\n  display.textContent = count;\n});\n\ndocument.getElementById('dec-btn').addEventListener('click', () => {\n  count--;\n  display.textContent = count;\n});`,
    },
  },
  {
    id: 'todo',
    name: 'Simple To-Do List',
    category: 'Web App',
    description: 'Add and remove task items dynamically.',
    code: {
      html: `<div class="todo-app">\n  <h2>My Tasks</h2>\n  <div class="input-group">\n    <input type="text" id="task-input" placeholder="Add a new task..." />\n    <button id="add-btn">Add</button>\n  </div>\n  <ul id="task-list"></ul>\n</div>`,
      css: `body { background: #090d16; color: #e2e8f0; font-family: sans-serif; padding: 40px; }\n.todo-app { max-width: 400px; margin: 0 auto; background: #111827; padding: 24px; border-radius: 12px; border: 1px solid #1f2937; }\n.input-group { display: flex; gap: 8px; margin-bottom: 16px; }\ninput { flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #374151; background: #1f2937; color: white; outline: none; }\nbutton { padding: 10px 16px; background: #22c55e; color: black; border: none; font-weight: bold; border-radius: 6px; cursor: pointer; }\nul { list-style: none; padding: 0; margin: 0; }\nli { padding: 10px; background: #1f2937; margin-bottom: 8px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }\n.del-btn { background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; }`,
      javascript: `const input = document.getElementById('task-input');\nconst addBtn = document.getElementById('add-btn');\nconst list = document.getElementById('task-list');\n\nfunction addTask() {\n  if (!input.value.trim()) return;\n  const li = document.createElement('li');\n  li.innerHTML = \`<span>\${input.value}</span><button class="del-btn">Delete</button>\`;\n  li.querySelector('.del-btn').addEventListener('click', () => li.remove());\n  list.appendChild(li);\n  input.value = '';\n}\n\naddBtn.addEventListener('click', addTask);`,
    },
  },
  {
    id: 'python-quiz',
    name: 'Python Logic Starter',
    category: 'Python',
    description: 'Python script calculating stats and formatted outputs.',
    code: {
      html: '',
      css: '',
      javascript: '',
      language: 'python3.10',
      programCode: `# Python Starter Script\n\ndef calculate_stats(scores):\n    avg = sum(scores) / len(scores)\n    highest = max(scores)\n    return avg, highest\n\nscores = [88, 92, 79, 95, 100]\naverage, top_score = calculate_stats(scores)\n\nprint(f"Total Student Exams: {len(scores)}")\nprint(f"Average Score: {average:.2f}")\nprint(f"Highest Score: {top_score}")`,
    },
  },
];

export default function TemplatesModal({ open, onClose, onSelectTemplate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-xl border border-cc-border bg-cc-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cc-border pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cc-accent" />
            <h2 className="text-lg font-bold text-cc-text">Preset Code Templates</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-cc-muted hover:bg-cc-panel2 hover:text-cc-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {PRESET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
              className="group flex cursor-pointer items-start justify-between rounded-lg border border-cc-border bg-cc-panel2 p-4 transition hover:border-cc-accent/50 hover:bg-cc-border/40"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-cc-accent2">
                  {tmpl.category}
                </span>
                <h3 className="text-base font-semibold text-cc-text group-hover:text-cc-accent">
                  {tmpl.name}
                </h3>
                <p className="mt-1 text-xs text-cc-muted">{tmpl.description}</p>
              </div>
              <Code className="h-5 w-5 shrink-0 text-cc-muted group-hover:text-cc-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
