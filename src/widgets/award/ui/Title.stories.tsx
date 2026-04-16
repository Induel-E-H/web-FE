import type { Meta, StoryObj } from '@storybook/react-vite';

import { AwardTitle } from './Title';

const meta = {
  title: 'Widgets/Award/Title',
  component: AwardTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Award 섹션 상단의 타이틀 컴포넌트. 영문 서브타이틀 "Award"와 한글 제목 "수상 기록"을 hgroup으로 묶어 표시합니다.',
      },
    },
  },
} satisfies Meta<typeof AwardTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: 'props 없이 정적으로 렌더링되는 타이틀.',
      },
    },
  },
};
