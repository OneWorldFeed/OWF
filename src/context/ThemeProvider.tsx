'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, THEMES, THEME_ORDER } from '@/lib/theme';
import type { ThemeId, OWFTheme } from '@/lib/theme';

export type { ThemeId };

interface ThemeContextType {
  themeId: ThemeId;
  theme: OWFTheme;
  setTheme: (id: ThemeId) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'chalk',
  theme: THEMES['chalk'],
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('chalk');

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeId(stored);
    applyTheme(stored);
  }, []);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    applyTheme(id);
    // Update cursor glow color when theme changes
    const el = document.getElementById('owf-cursor-glow');
    if (el) {
      const t = THEMES[id];
      el.style.background = `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`;
    }
  };

  const theme = THEMES[themeId] ?? THEMES['chalk'];

  return (
    <ThemeContext.Provider value={{
      themeId,
      theme,
      setTheme,
      isDark: theme.isDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { THEMES, THEME_ORDER };
