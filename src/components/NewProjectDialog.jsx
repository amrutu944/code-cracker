import { useEffect, useRef, useState } from 'react';

export default function NewProjectDialog({ open, onCreate, onCancel }) {
  const [name, setName] = useState('My First Website');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName('My First Website');
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onCreate(name.trim() || 'Untitled Project');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-project-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-cc border border-cc-border bg-cc-panel p-5 shadow-2xl">
        <h2 id="new-project-title" className="text-base font-semibold text-cc-text">
          Create a new project
        </h2>
        <label htmlFor="project-name" className="mt-4 block text-xs font-medium text-cc-muted">
          Project name
        </label>
        <input
          id="project-name"
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-cc-border bg-cc-bg px-3 py-2 text-sm text-cc-text focus:outline focus:outline-2 focus:outline-cc-accent2"
          placeholder="My First Website"
          autoComplete="off"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-cc-muted hover:bg-cc-panel2 hover:text-cc-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-cc-accent px-3 py-1.5 text-sm font-semibold text-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}
