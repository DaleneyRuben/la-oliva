import classicLogo from '@/assets/logo.png';
import laOlivaLogo from '@/assets/la-oliva-logo.png';
import { THEMES, useTheme } from '@/features/theme/theme';

export function PageLoader() {
  const { theme } = useTheme();
  const logo = theme === THEMES.CLASSIC ? classicLogo : laOlivaLogo;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <img src={logo} alt="La Oliva" className="w-32 h-auto" />
      <span className="inline-block w-5 h-5 rounded-full border-2 border-olive-800 border-t-transparent animate-spin" />
      <p className="font-mono text-[11px] uppercase tracking-[.14em] text-muted">Cargando...</p>
    </div>
  );
}
