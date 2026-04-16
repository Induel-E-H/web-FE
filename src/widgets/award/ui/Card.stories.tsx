import { AWARD_LIST } from '@entities/award';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Card } from './Card';

const meta = {
  title: 'Widgets/Award/Card',
  component: Card,
  args: {
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '개별 수상 항목을 나타내는 카드 컴포넌트. 연도, 제목, 발급기관을 표시하며 클릭 시 상세 팝업을 엽니다.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  args: {
    award: AWARD_LIST[0],
  },
  parameters: {
    docs: {
      description: {
        story: '일련번호(serialNumber)가 포함된 카드.',
      },
    },
  },
};
