import react from '@vitejs/plugin-react';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { defineConfig, type UserConfig } from 'vite';
import sitemap from 'vite-plugin-sitemap';
import tsconfigPaths from 'vite-tsconfig-paths';

const isStorybook =
  process.env.STORYBOOK === 'true' || process.env.CHROMATIC === 'true';

export const baseConfig: UserConfig = {
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
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    },
  },
  build: {
    target: 'esnext',
    cssMinify: 'lightningcss',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'vendor-three';
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          )
            return 'vendor-react';
        },
      },
    },
  },
};

export default defineConfig(baseConfig);
