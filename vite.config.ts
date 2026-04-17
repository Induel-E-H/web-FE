import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import sitemap from 'vite-plugin-sitemap';
import tsconfigPaths from 'vite-tsconfig-paths';

const isStorybook =
  process.env.STORYBOOK === 'true' || process.env.CHROMATIC === 'true';

export const baseConfig = {
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tsconfigPaths(),
    !isStorybook && sitemap({ hostname: 'https://induel.co.kr' }),
  ].filter(Boolean),
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 500,
  },
};

export default defineConfig(baseConfig);
