import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './theme';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('selects Clásica with an accessible radio option', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const classic = screen.getByRole('radio', { name: 'Clásica' });
    expect(screen.getByRole('radio', { name: 'La Oliva' })).toBeChecked();

    await user.click(classic);

    expect(classic).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('classic');
  });
});
