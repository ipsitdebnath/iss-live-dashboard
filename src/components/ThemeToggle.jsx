/**
 * ThemeToggle Component
 * "Switch to Dark" / "Switch to Light" button style (matching reference)
 */
import { useEffect, useState } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';
import { THEME_STORAGE_KEY } from '../utils/constants';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const saved = loadFromStorage(THEME_STORAGE_KEY);
    if (saved !== null) {
      setIsDark(saved);
      document.documentElement.setAttribute('data-theme', saved ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    saveToStorage(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200
                 border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]
                 hover:bg-[var(--accent-light)] hover:border-[var(--accent)] active:scale-95"
    >
      {isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
    </button>
  );
}
