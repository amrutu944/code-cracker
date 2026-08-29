import { useEffect, useRef, useState } from 'react';

// Save statuses shown to the user.
export const SAVE_STATUS = {
  IDLE: 'idle',
  UNSAVED: 'unsaved',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
};

/**
 * Debounced autosave hook. Calls onSave(value) after `delay` ms of no
 * changes to `value`, and exposes a status for UI feedback. Skips the
 * initial mount so opening a project doesn't immediately mark it dirty.
 */
export function useAutosave(value, onSave, delay = 800) {
  const [status, setStatus] = useState(SAVE_STATUS.IDLE);
  const timeoutRef = useRef(null);
  const isFirstRun = useRef(true);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus(SAVE_STATUS.UNSAVED);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setStatus(SAVE_STATUS.SAVING);
      try {
        onSave(valueRef.current);
        setStatus(SAVE_STATUS.SAVED);
      } catch {
        setStatus(SAVE_STATUS.ERROR);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  const saveNow = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus(SAVE_STATUS.SAVING);
    try {
      onSave(valueRef.current);
      setStatus(SAVE_STATUS.SAVED);
    } catch {
      setStatus(SAVE_STATUS.ERROR);
    }
  };

  return { status, saveNow };
}
