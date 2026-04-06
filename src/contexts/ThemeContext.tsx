import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserSettings } from '../types';

interface ThemeContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  accentColor: 'navy',
  timezone: 'Asia/Kolkata',
  dailyRefreshTime: '06:00',
  morningNotification: true,
  eveningNotification: false,
  eveningNotificationTime: '20:00',
  sectionsEnabled: {
    quote: true,
    geopolitical_news: true,
    finance_news: true,
    markets: true,
    gita: true,
    psychology: true,
    finance_terms: true,
    vocabulary: true,
    books: true,
    laws: true,
    case_studies: true,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem('daily_settings');
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const theme = settings.theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : settings.theme;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.classList.remove('accent-navy', 'accent-amber');
    root.classList.add(`accent-${settings.accentColor}`);
  }, [settings.theme, settings.accentColor]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('daily_settings', JSON.stringify(newSettings));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
