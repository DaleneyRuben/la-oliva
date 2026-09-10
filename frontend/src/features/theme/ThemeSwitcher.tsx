import { THEMES, useTheme, type ThemeId } from './theme';

interface ThemeOption {
  id: ThemeId;
  label: string;
}

interface ThemeSwitcherProps {
  tone?: 'dark' | 'light';
}

const OPTIONS: ThemeOption[] = [
  { id: THEMES.LA_OLIVA, label: 'La Oliva' },
  { id: THEMES.CLASSIC, label: 'Clásica' },
];

function optionClassName(theme: ThemeId, option: ThemeId, isLight: boolean): string {
  if (theme === option)
    return isLight ? 'bg-olive-100 text-olive-800' : 'bg-white/15 text-olive-50';
  return isLight ? 'text-muted hover:text-ink' : 'text-olive-50/60 hover:text-olive-50';
}

export function ThemeSwitcher({ tone = 'dark' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const isLight = tone === 'light';

  return (
    <fieldset
      className={`flex rounded-md border p-0.5 ${
        isLight ? 'border-rule bg-paper' : 'border-white/20'
      }`}
      aria-label="Tema visual"
    >
      <legend className="sr-only">Tema visual</legend>
      {OPTIONS.map(({ id, label }) => (
        <label
          key={id}
          htmlFor={`theme-${id}`}
          className={[
            'cursor-pointer rounded px-2 py-1 text-[10px] font-medium transition-colors',
            optionClassName(theme, id, isLight),
          ].join(' ')}
        >
          <input
            type="radio"
            id={`theme-${id}`}
            name="theme"
            value={id}
            checked={theme === id}
            onChange={() => setTheme(id)}
            className="sr-only"
          />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
