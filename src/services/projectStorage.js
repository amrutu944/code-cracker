import { getAuthHeaders, getStoredToken } from './authService.js';

const API_BASE_URL = 'http://localhost:4000';
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

// In-memory cache for immediate synchronous return
let cachedProjects = [];

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

function readLocalStorage() {
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

function writeLocalStorage(projects) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Local storage full
  }
}

// Background sync with Backend API when authenticated
export async function syncProjectsFromBackend() {
  const token = getStoredToken();
  if (!token) return readLocalStorage();

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: { ...getAuthHeaders() },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.projects)) {
        cachedProjects = data.projects;
        writeLocalStorage(data.projects);
        return data.projects;
      }
    }
  } catch (err) {
    console.warn('Backend projects sync fallback to local cache:', err.message);
  }

  cachedProjects = readLocalStorage();
  return cachedProjects;
}

export function getProjects() {
  const token = getStoredToken();
  if (token && cachedProjects.length > 0) {
    return [...cachedProjects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  const local = readLocalStorage();
  return local.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function getProject(id) {
  const all = getProjects();
  return all.find((p) => p.id === id) || null;
}

export function createProject(name, code = STARTER_CODE) {
  const trimmedName = (name || '').trim() || 'Untitled Project';
  const now = new Date().toISOString();

  const newProject = {
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: trimmedName,
    html: code.html ?? DEFAULT_HTML,
    css: code.css ?? DEFAULT_CSS,
    javascript: code.javascript ?? DEFAULT_JS,
    code: code.code ?? '',
    input: code.input ?? '',
    language: code.language ?? 'web',
    createdAt: now,
    updatedAt: now,
  };

  // Sync to Backend if logged in
  const token = getStoredToken();
  if (token) {
    fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(newProject),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.project) {
          syncProjectsFromBackend();
        }
      })
      .catch((err) => console.error('Error saving project to server:', err));
  }

  const all = readLocalStorage();
  all.push(newProject);
  writeLocalStorage(all);
  cachedProjects = all;
  return newProject;
}

export function updateProject(id, updates) {
  const all = readLocalStorage();
  const index = all.findIndex((p) => p.id === id);

  const updated = {
    ...(index !== -1 ? all[index] : {}),
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  if (index !== -1) {
    all[index] = updated;
  } else {
    all.push(updated);
  }

  writeLocalStorage(all);
  cachedProjects = all;

  // Sync to backend if logged in
  const token = getStoredToken();
  if (token) {
    fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          // If project didn't exist on server yet, create it
          fetch(`${API_BASE_URL}/api/projects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            body: JSON.stringify(updated),
          });
        }
      })
      .catch((err) => console.error('Error updating project on server:', err));
  }

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
  const all = readLocalStorage();
  const filtered = all.filter((p) => p.id !== id);
  writeLocalStorage(filtered);
  cachedProjects = filtered;

  const token = getStoredToken();
  if (token) {
    fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }).catch((err) => console.error('Error deleting project on server:', err));
  }

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
    // Ignored
  }
}
