import {
  createContext,
  createElement,
  useContext,
  useLayoutEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export const THEME_STORAGE_KEY = 'la-oliva-theme';

export const THEMES = {
  LA_OLIVA: 'la-oliva',
  CLASSIC: 'classic',
} as const;

export type ThemeId = (typeof THEMES)[keyof typeof THEMES];

export const DEFAULT_THEME: ThemeId = THEMES.LA_OLIVA;

const FAVICON_BY_THEME: Record<ThemeId, string> = {
  [THEMES.LA_OLIVA]: '/la-oliva-favicon.png',
  [THEMES.CLASSIC]: '/favicon.png',
};

export function isThemeId(value: string | null): value is ThemeId {
  return value === THEMES.LA_OLIVA || value === THEMES.CLASSIC;
}

export function readThemePreference(): ThemeId {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(savedTheme) ? savedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector<HTMLLinkElement>('[data-theme-favicon]')
    ?.setAttribute('href', FAVICON_BY_THEME[theme]);
}

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: Dispatch<SetStateAction<ThemeId>>;
}

const defaultThemeContext: ThemeContextValue = {
  theme: DEFAULT_THEME,
  setTheme: () => undefined,
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeId>(readThemePreference);

  useLayoutEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }, [theme]);

  return createElement(ThemeContext.Provider, { value: { theme, setTheme } }, children);
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
