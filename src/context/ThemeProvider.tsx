'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId =
  | 'light'
  | 'midnight'
  | 'predawn'
  | 'firstlight'
  | 'dawn'
  | 'goldenhour'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'bluehour'
  | 'dusk'
  | 'sunset'
  | 'twilight';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  preview: string[]; // 3 colors for preview swatch
}

export const THEMES: Theme[] = [
  {
    id: 'light',
    name: 'Daylight',
    description: 'Clean white — the default',
    preview: ['#F2F5F8', '#00D2BE', '#0F1924'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Near-black, deep indigo, star silver',
    preview: ['#08080F', '#6366f1', '#c7d2fe'],
  },
  {
    id: 'predawn',
    name: 'Pre-Dawn',
    description: 'Dark navy, cold violet, barely-there blue',
    preview: ['#080C18', '#4f46e5', '#818cf8'],
  },
  {
    id: 'firstlight',
    name: 'First Light',
    description: 'Dark teal, muted rose, soft horizon pink',
    preview: ['#090F12', '#2dd4bf', '#fda4af'],
  },
  {
    id: 'dawn',
    name: 'Dawn',
    description: 'Warm charcoal, blush rose, peach glow',
    preview: ['#110D0C', '#fb7185', '#fdba74'],
  },
  {
    id: 'goldenhour',
    name: 'Golden Hour',
    description: 'Deep brown-black, amber, soft gold',
    preview: ['#100D08', '#f59e0b', '#fde68a'],
  },
  {
    id: 'morning',
    name: 'Morning',
    description: 'Cool dark, bright cyan, crisp white',
    preview: ['#080F12', '#06b6d4', '#e0f2fe'],
  },
  {
    id: 'noon',
    name: 'Noon',
    description: 'Pure dark, electric sky blue, bright white',
    preview: ['#080C12', '#3b82f6', '#dbeafe'],
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    description: 'Deep gray, muted cornflower, silver',
    preview: ['#0C0C10', '#818cf8', '#e2e8f0'],
  },
  {
    id: 'bluehour',
    name: 'Blue Hour',
    description: 'Dark slate, periwinkle, lavender mist',
    preview: ['#090B14', '#a5b4fc', '#ede9fe'],
  },
  {
    id: 'dusk',
    name: 'Dusk',
    description: 'Near-black, burnt orange, coral fade',
    preview: ['#0F0A08', '#f97316', '#fca5a5'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Deep charcoal, deep purple, violet fire',
    preview: ['#0D0810', '#a855f7', '#f0abfc'],
  },
  {
    id: 'twilight',
    name: 'Twilight',
    description: 'True black, deep magenta, faint indigo',
    preview: ['#08050F', '#ec4899', '#c084fc'],
  },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('light');

  useEffect(() => {
    const saved = localStorage.getItem('owf-theme') as ThemeId | null;
    if (saved) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const setTheme = (id: ThemeId) => {
    setThemeState(id);
    localStorage.setItem('owf-theme', id);
    document.documentElement.setAttribute('data-theme', id);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
