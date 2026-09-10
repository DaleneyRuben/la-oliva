import { THEMES, useTheme, type ThemeId } from './theme';

interface ThemeOption {
  id: ThemeId;
  label: string;
}

const OPTIONS: ThemeOption[] = [
  { id: THEMES.LA_OLIVA, label: 'La Oliva' },
  { id: THEMES.CLASSIC, label: 'Clásica' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="flex rounded-md border border-white/20 p-0.5" aria-label="Tema visual">
      <legend className="sr-only">Tema visual</legend>
      {OPTIONS.map(({ id, label }) => (
        <label
          key={id}
          htmlFor={`theme-${id}`}
          className={[
            'cursor-pointer rounded px-2 py-1 text-[10px] font-medium transition-colors',
            theme === id ? 'bg-white/15 text-olive-50' : 'text-olive-50/60 hover:text-olive-50',
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
