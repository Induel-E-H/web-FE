import { AWARD_LIST } from '@entities/award';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AwardCount } from './Count';

const meta = {
  title: 'Widgets/Award/Count',
  component: AwardCount,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '총 수상 건수를 아이콘과 함께 표시하는 컴포넌트.',
      },
    },
  },
} satisfies Meta<typeof AwardCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (10건)',
  args: {
    awardList: AWARD_LIST,
  },
  parameters: {
    docs: {
      description: {
        story: '총 수상 건수 10건이 아이콘과 함께 표시되는 모습.',
      },
    },
  },
};

export const Few: Story = {
  name: '소수 (2건)',
  args: {
    awardList: AWARD_LIST.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: '2건만 전달하여 숫자가 동적으로 반영되는지 검증.',
      },
    },
  },
};
