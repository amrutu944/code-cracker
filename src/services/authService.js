const API_BASE_URL = 'http://localhost:4000';

const TOKEN_KEY = 'codecracker.auth_token';
const USER_KEY = 'codecracker.auth_user';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to store auth session:', err);
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

export function getAuthHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Registration failed.');
  }

  setAuthSession(data.token, data.user);
  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Login failed.');
  }

  setAuthSession(data.token, data.user);
  return data;
}

export async function fetchCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    if (!response.ok) {
      clearAuthSession();
      return null;
    }
    const data = await response.json();
    if (data.success && data.user) {
      setAuthSession(token, data.user);
      return data.user;
    }
  } catch {
    // Network or server error
  }
  return getStoredUser();
}
