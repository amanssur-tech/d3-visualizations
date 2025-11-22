import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  isManual: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem('preferred-theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const stored = getStoredTheme();
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme);
  const [manualMode, setManualMode] = useState(Boolean(stored));
  const [theme, setTheme] = useState<ThemeMode>(stored ?? systemTheme);

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

  const toggleTheme = useCallback(() => {
    setManualMode(true);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isManual: manualMode,
      toggleTheme,
    }),
    [manualMode, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
