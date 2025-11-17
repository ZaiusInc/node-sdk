import {defineConfig} from 'vitest/config';

process.env.ZAIUS_ENV = 'test';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules/**', 'dist/**', 'example*/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
      exclude: ['src/test/**/*', 'src/**/index.ts', '**/*.test.ts', '**/*.test.tsx', '**/*.d.ts'],
      thresholds: {
        branches: 85,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
  },
});
