import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],

  test: {
    passWithNoTests: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/main.tsx',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/*.webp',
        '**/*.css',
        '**/*.svg',
        '**/*.stories.{ts,tsx}',
      ],
    },

    projects: [
      {
        plugins: [
          tsconfigPaths({
            projects: ['./tsconfig.json'],
          }),
        ],
        test: {
          name: 'unit',
          environment: 'happy-dom',
          environmentOptions: {
            happyDOM: {
              settings: {
                disableJavaScriptFileLoading: true,
              },
            },
          },
          pool: 'forks',
          clearMocks: true,
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },

      {
        plugins: [
          tsconfigPaths({
            projects: ['./tsconfig.json'],
          }),
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/vitest.setup.ts'],

          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
