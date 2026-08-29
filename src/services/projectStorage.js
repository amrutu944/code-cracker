// projectStorage.js
// Storage service for Code Cracker projects.
// Version 1 persists to browser localStorage. All localStorage access in the
// application must go through this module so the storage backend can be
// swapped for a database/API later without touching UI code.

const STORAGE_KEY = 'codecracker.projects';

const DEFAULT_HTML = `<h1>Hello, Code Cracker!</h1>
<p>Start learning web development.</p>`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  color: #2563eb;
}`;

const DEFAULT_JS = `console.log("Welcome to Code Cracker!");`;

export const STARTER_CODE = {
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  javascript: DEFAULT_JS,
};

function isStorageAvailable() {
  try {
    const testKey = '__codecracker_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readAll() {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(projects) {
  if (!isStorageAvailable()) {
    throw new Error('Your browser storage is unavailable, so projects cannot be saved right now.');
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    throw new Error('Could not save your project. Your browser storage might be full.');
  }
}

function generateId() {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getProjects() {
  return readAll().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getProject(id) {
  return readAll().find((p) => p.id === id) || null;
}

export function createProject(name, code = STARTER_CODE) {
  const trimmedName = (name || '').trim() || 'Untitled Project';
  const now = new Date().toISOString();
  const project = {
    id: generateId(),
    name: trimmedName,
    html: code.html ?? DEFAULT_HTML,
    css: code.css ?? DEFAULT_CSS,
    javascript: code.javascript ?? DEFAULT_JS,
    createdAt: now,
    updatedAt: now,
  };
  const all = readAll();
  all.push(project);
  writeAll(all);
  return project;
}

export function updateProject(id, updates) {
  const all = readAll();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('That project could not be found. It may have been deleted.');
  }
  const updated = {
    ...all[index],
    ...updates,
    id: all[index].id,
    createdAt: all[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function renameProject(id, newName) {
  const trimmedName = (newName || '').trim();
  if (!trimmedName) {
    throw new Error('Project name cannot be empty.');
  }
  return updateProject(id, { name: trimmedName });
}

export function deleteProject(id) {
  const all = readAll();
  const filtered = all.filter((p) => p.id !== id);
  writeAll(filtered);
  return filtered;
}

export function hasSeenOnboarding() {
  if (!isStorageAvailable()) return true;
  try {
    return window.localStorage.getItem('codecracker.onboarding_seen') === 'true';
  } catch {
    return true;
  }
}

export function markOnboardingSeen() {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem('codecracker.onboarding_seen', 'true');
  } catch {
    // Non-critical, ignore.
  }
}
