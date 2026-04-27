import { useEffect } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Map } from './Map';

type NaverWindow = {
  naver?: { maps?: { Map?: unknown } };
  navermap_authFailure?: () => void;
};

function mockNaverMaps(el: HTMLElement) {
  el.innerHTML = '<div>Mock Naver Map</div>';
}

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
  name: 'Naver 지도 (정상)',
  decorators: [
    (Story) => {
      useEffect(() => {
        (window as NaverWindow).naver = { maps: { Map: mockNaverMaps } };
        return () => {
          delete (window as NaverWindow).naver;
        };
      }, []);
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          'window.naver.maps.Map이 존재할 때 Naver 지도가 마운트되는 정상 상태.',
      },
    },
  },
};

export const Fallback: Story = {
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

export const AuthFailure: Story = {
  name: 'Naver 인증 실패 → Fallback',
  decorators: [
    (Story) => {
      useEffect(() => {
        (window as NaverWindow).naver = { maps: { Map: mockNaverMaps } };
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
  parameters: {
    docs: {
      description: {
        story:
          '인증 실패(401 등) 시 navermap_authFailure 콜백이 호출되어 500ms 후 OpenStreetMap으로 전환됩니다.',
      },
    },
  },
};
