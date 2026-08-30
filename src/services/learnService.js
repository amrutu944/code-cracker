// learnService.js
// Persistence and state management for tutorial lessons progress.

const LEARN_STORAGE_KEY = 'codecracker.learn.progress';

function isStorageAvailable() {
  try {
    const testKey = '__cc_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getLearnProgress() {
  if (!isStorageAvailable()) return { completedLessonIds: [] };
  try {
    const raw = window.localStorage.getItem(LEARN_STORAGE_KEY);
    if (!raw) return { completedLessonIds: [] };
    const parsed = JSON.parse(raw);
    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
    };
  } catch {
    return { completedLessonIds: [] };
  }
}

export function markLessonCompleted(lessonId) {
  if (!isStorageAvailable()) return { completedLessonIds: [lessonId] };
  const current = getLearnProgress();
  if (!current.completedLessonIds.includes(lessonId)) {
    current.completedLessonIds.push(lessonId);
    try {
      window.localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Storage error ignored
    }
  }
  return current;
}
