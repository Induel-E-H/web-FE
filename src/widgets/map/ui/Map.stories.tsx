import { useEffect } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import Map from './Map';

const meta: Meta<typeof Map> = {
  title: 'Widgets/Map',
  component: Map,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Map>;

type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

export const Default: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        (window as NaverWindow).naver = {
          maps: {
            Map: function (el: HTMLElement) {
              el.innerHTML = '<div>Mock Naver Map</div>';
            },
          },
        };

        return () => {
          delete (window as NaverWindow).naver;
        };
      }, []);

      return <Story />;
    },
  ],
};

export const Fallback: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        delete (window as NaverWindow).naver;

        return () => {};
      }, []);

      return <Story />;
    },
  ],
};

export const AuthFailure: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        (window as NaverWindow).naver = {
          maps: {
            Map: function (el: HTMLElement) {
              el.innerHTML = '<div>Mock Naver Map</div>';
            },
          },
        };

        setTimeout(() => {
          (window as NaverWindow).navermap_authFailure?.();
        }, 500);

        return () => {
          delete (window as NaverWindow).naver;
          delete (window as NaverWindow).navermap_authFailure;
        };
      }, []);

      return <Story />;
    },
  ],
};
