import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolveApiUrl } from './vite/resolveApiUrl';
import { resolveFrontendEntry } from './vite/resolveFrontendEntry';

const apiUrl = resolveApiUrl();

export default defineConfig(({ mode }) => {
  const frontendEntry = resolveFrontendEntry(mode);

  return {
    plugins: [
      {
        name: 'frontend-entry',
        transformIndexHtml: {
          order: 'pre',
          handler: (html) => html.replace('/src/main.tsx', frontendEntry),
        },
      },
      react(),
      tailwindcss(),
    ],
    // undefined locally — vite's own .env loading applies
    define: apiUrl ? { 'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl) } : undefined,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@ui': path.resolve(__dirname, './src/components/ui'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
