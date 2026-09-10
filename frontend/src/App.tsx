import { AppRouter } from '@/router';
import { ThemeProvider } from '@/features/theme/theme';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
