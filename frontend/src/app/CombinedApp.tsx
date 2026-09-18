import { StaffRouter } from '@/router';
import { ThemeProvider } from '@/features/theme/theme';
import { PublicRegistrationPage } from '@/pages/PublicRegistrationPage';

export function CombinedApp() {
  return (
    <ThemeProvider>
      <StaffRouter publicRegistrationElement={<PublicRegistrationPage />} />
    </ThemeProvider>
  );
}
