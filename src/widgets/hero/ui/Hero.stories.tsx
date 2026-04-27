import type { Meta, StoryObj } from '@storybook/react-vite';

import { Hero } from './Hero';

const meta = {
  title: 'Widgets/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '페이지 최상단에 위치하는 Hero 위젯. 배경 이미지와 텍스트, 스크롤 화살표로 구성된 섹션입니다.',
      },
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Prod Hero 뷰포트',
  args: {
    showScrollArrow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '스크롤 화살표가 표시된 상태의 Hero 뷰포트. 배경 이미지와 텍스트가 함께 렌더링되고, 스크롤 화살표가 하단 중앙에 위치합니다.',
      },
    },
  },
};

export const Developing: Story = {
  name: '개발중인 Hero 뷰포트',
  args: {
    showScrollArrow: false,
  },
  parameters: {
    docs: {
      description: {
        story: '개발중인 Hero 뷰포트. 스크롤 화살표는 숨김 처리.',
      },
    },
  },
};
