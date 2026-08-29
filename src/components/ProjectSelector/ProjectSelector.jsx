import { useEffect, useRef, useState } from 'react';

/**
 * Inline-editable project name shown in the Playground header.
 */
export default function ProjectSelector({ name, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(name);
  }, [name]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit() {
    const trimmed = draft.trim();
    setEditing(false);
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setDraft(name);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(name);
            setEditing(false);
          }
        }}
        aria-label="Project name"
        className="w-40 rounded-md bg-cc-panel2 px-2 py-1 text-sm font-medium text-cc-text focus:outline focus:outline-2 focus:outline-cc-accent2 sm:w-56"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to rename project"
      className="max-w-[10rem] truncate rounded-md px-2 py-1 text-sm font-medium text-cc-text hover:bg-cc-panel2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cc-accent2 sm:max-w-xs"
    >
      {name}
    </button>
  );
}
