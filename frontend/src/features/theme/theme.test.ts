import { DEFAULT_THEME, readThemePreference, THEME_STORAGE_KEY, type ThemeId } from './theme';

describe('readThemePreference', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('uses La Oliva when no preference has been saved', () => {
    expect(readThemePreference()).toBe(DEFAULT_THEME);
  });

  it.each<ThemeId>(['la-oliva', 'classic'])('restores the saved %s preference', (theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    expect(readThemePreference()).toBe(theme);
  });

  it('falls back to La Oliva for an invalid saved preference', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'unexpected-theme');

    expect(readThemePreference()).toBe(DEFAULT_THEME);
  });
});
