import { useEffect } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Map } from './Map';

type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

const meta = {
  title: 'Widgets/Map',
  component: Map,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Naver Maps SDK를 동적으로 주입해 지도를 렌더링하는 Map 위젯. SDK 미설정·인증 실패 시 OpenStreetMap iframe으로 자동 전환됩니다.',
      },
    },
  },
} satisfies Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'OpenStreetMap Fallback',
  decorators: [
    (Story) => {
      useEffect(() => {
        delete (window as NaverWindow).naver;
      }, []);
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          'VITE_NAVER_MAP_API_KEY 미설정 또는 window.naver 부재 시 OpenStreetMap iframe으로 대체됩니다.',
      },
    },
  },
};
