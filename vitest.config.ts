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

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tsconfigPaths(),
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
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
