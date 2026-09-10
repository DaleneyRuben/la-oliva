import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DEFAULT_THEME,
  readThemePreference,
  ThemeProvider,
  THEME_STORAGE_KEY,
  type ThemeId,
  useTheme,
} from './theme';

function ThemeProbe() {
  const { theme, setTheme } = useTheme();

  return createElement('button', { type: 'button', onClick: () => setTheme('classic') }, theme);
}

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

  it('applies and persists a selected theme', async () => {
    const user = userEvent.setup();
    render(createElement(ThemeProvider, null, createElement(ThemeProbe)));

    await user.click(screen.getByRole('button', { name: 'la-oliva' }));

    expect(screen.getByRole('button', { name: 'classic' })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('classic');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('classic');
  });
});
