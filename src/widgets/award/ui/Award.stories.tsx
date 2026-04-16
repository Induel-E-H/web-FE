import type { Meta, StoryObj } from '@storybook/react-vite';

import Award from './Award';

const meta = {
  title: 'Widgets/Award',
  component: Award,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page 6에 위치하는 Award 위젯. 연도 필터, 카드 그리드, 페이지네이션, 팝업을 포함하는 수상 기록 섹션입니다.',
      },
    },
  },
} satisfies Meta<typeof Award>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  name: 'Desktop (1920px)',
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '1920px 데스크탑 해상도. 카드 5×2 레이아웃, 슬라이드 방식 페이지 전환.',
      },
    },
  },
};

export const Tablet: Story = {
  name: 'Tablet (768px)',
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story: '768px 태블릿 해상도. 카드 3×2 레이아웃.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile (375px)',
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '375px 모바일 해상도. 카드 2×2 레이아웃, 하단 dot 페이지네이션 표시.',
      },
    },
  },
};
