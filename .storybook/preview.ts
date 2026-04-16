import type { Preview } from '@storybook/react-vite';

import '../src/app/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        desktop: {
          name: 'Desktop (1920px)',
          styles: { width: '1920px', height: '920px' },
          type: 'desktop',
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '900px' },
          type: 'tablet',
        },
        mobile: {
          name: 'Mobile (375px)',
          styles: { width: '375px', height: '600px' },
          type: 'mobile',
        },
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
