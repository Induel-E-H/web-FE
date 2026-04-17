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

export const Default: Story = {
  name: 'Award 뷰포트',
  parameters: {
    docs: {
      description: {
        story: '카드 5×2 레이아웃, 슬라이드 방식 페이지 전환.',
      },
    },
  },
};
