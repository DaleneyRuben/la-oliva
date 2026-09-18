import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/features/theme/theme';
import { PublicRegistrationPage } from '@/pages/PublicRegistrationPage';

export function PublicApp() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/registro" element={<PublicRegistrationPage />} />
        <Route path="*" element={<Navigate to="/registro" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
