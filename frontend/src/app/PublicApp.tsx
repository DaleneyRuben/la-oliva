import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/theme';
import { PublicInfoPage } from '@/pages/PublicInfoPage';
import { PublicRegistrationPage } from '@/pages/PublicRegistrationPage';

export function PublicApp() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<PublicInfoPage />} />
        <Route path="/registro" element={<PublicRegistrationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
