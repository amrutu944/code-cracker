import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
// A versioned key starts the refreshed theme experience in light mode, without
// carrying forward the earlier development default of dark mode.
const STORAGE_KEY = 'codecracker.theme.v2';

function getInitialTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme preference is optional when storage is unavailable.
    }
  }, [theme]);

  const value = { theme, setTheme, toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')) };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
