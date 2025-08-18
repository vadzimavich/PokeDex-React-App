import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/app/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '*.config.js',
        '*.config.ts',
        '*.config.mjs',
        'next-env.d.ts',
        'i18n.ts',
        'src/app/setupTests.ts',
        'src/app/types.ts',
        'src/app/queryClient.ts',
        'src/app/providers.tsx',
        'src/middleware.ts',
        'src/navigation.ts',
        'src/app/**/layout.tsx',
        'src/app/**/not-found.tsx',
      ],
    },
  },
});
