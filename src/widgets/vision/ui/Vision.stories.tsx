import type { Meta, StoryObj } from '@storybook/react-vite';

import { Vision } from './Vision';

const meta = {
  title: 'Widgets/Vision',
  component: Vision,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page 2–4에 위치하는 Vision 위젯. Param · Sculpt · Invest 세 개의 비전 아이템을 교차 레이아웃(이미지 좌우 반전)으로 렌더링합니다. 각 아이템은 IntersectionObserver 기반 진입 애니메이션을 포함합니다.',
      },
    },
  },
} satisfies Meta<typeof Vision>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Vision 뷰포트',
  parameters: {
    docs: {
      description: {
        story:
          '전체 Vision 섹션. 상단 타이틀과 세 개의 비전 아이템(Param → Sculpt → Invest)이 순서대로 나열됩니다.',
      },
    },
  },
};
