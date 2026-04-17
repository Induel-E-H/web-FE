import type { Meta, StoryObj } from '@storybook/react-vite';

import HeroBackground from './HeroBackground';

const meta = {
  title: 'Widgets/Hero/HeroBackground',
  component: HeroBackground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page 1에 위치하는 HeroBackground 위젯. 배경 이미지를 포함하는 섹션입니다.',
      },
    },
  },
} satisfies Meta<typeof HeroBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'HeroBackground 뷰포트',
  parameters: {
    docs: {
      description: {
        story: 'Canvas 요소를 활용한 웨이브 배경 애니메이션.',
      },
    },
  },
};
