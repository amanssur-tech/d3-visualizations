import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext({
  theme: 'light',
  isManual: false,
  toggleTheme: () => {},
});

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem('preferred-theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const stored = getStoredTheme();
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const [manualMode, setManualMode] = useState(Boolean(stored));
  const [theme, setTheme] = useState(stored || systemTheme);

  // Keep track of system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const next = event.matches ? 'dark' : 'light';
      setSystemTheme(next);
      if (!manualMode) {
        setTheme(next);
      }
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [manualMode]);

  // Ensure theme follows system when manual mode is disabled
  useEffect(() => {
    if (manualMode) return undefined;
    setTheme(systemTheme);
    return undefined;
  }, [manualMode, systemTheme]);

  // Apply theme classes/data attributes
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
    root.style.setProperty('color-scheme', theme);
    return undefined;
  }, [theme]);

  // Persist manual preferences
  useEffect(() => {
    if (typeof window === 'undefined' || !manualMode) return undefined;
    window.localStorage.setItem('preferred-theme', theme);
    return undefined;
  }, [manualMode, theme]);

  const toggleTheme = () => {
    setManualMode(true);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({
      theme,
      isManual: manualMode,
      toggleTheme,
    }),
    [manualMode, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
