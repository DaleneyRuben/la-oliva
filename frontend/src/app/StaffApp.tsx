import { ThemeProvider } from '@/features/theme/theme';
import { StaffRouter } from '@/router';

export function StaffApp() {
  return (
    <ThemeProvider>
      <StaffRouter />
    </ThemeProvider>
  );
}
