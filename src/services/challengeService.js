// challengeService.js
// Persistence and state management for user challenges progress.

const CHALLENGES_STORAGE_KEY = 'codecracker.challenges.progress';

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

export function getChallengeProgress() {
  if (!isStorageAvailable()) return { completedIds: [], xp: 0, streak: 1 };
  try {
    const raw = window.localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!raw) return { completedIds: [], xp: 0, streak: 1 };
    const parsed = JSON.parse(raw);
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 1,
    };
  } catch {
    return { completedIds: [], xp: 0, streak: 1 };
  }
}

export function markChallengeCompleted(challengeId, xpEarned = 50) {
  if (!isStorageAvailable()) return { completedIds: [challengeId], xp: xpEarned, streak: 1 };
  const current = getChallengeProgress();
  if (!current.completedIds.includes(challengeId)) {
    current.completedIds.push(challengeId);
    current.xp += xpEarned;
    try {
      window.localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Storage error ignored
    }
  }
  return current;
}
