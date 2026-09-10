export const THEME_STORAGE_KEY = 'la-oliva-theme';

export const THEMES = {
  LA_OLIVA: 'la-oliva',
  CLASSIC: 'classic',
} as const;

export type ThemeId = (typeof THEMES)[keyof typeof THEMES];

export const DEFAULT_THEME: ThemeId = THEMES.LA_OLIVA;

export function isThemeId(value: string | null): value is ThemeId {
  return value === THEMES.LA_OLIVA || value === THEMES.CLASSIC;
}

export function readThemePreference(): ThemeId {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeId(savedTheme) ? savedTheme : DEFAULT_THEME;
}
