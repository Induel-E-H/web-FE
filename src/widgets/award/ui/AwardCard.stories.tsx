import { AWARD_LIST } from '@entities/award';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AwardCard } from './AwardCard';

const meta = {
  title: 'Widgets/Award/Card',
  component: AwardCard,
  args: {
    award: AWARD_LIST[0],
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '개별 수상 항목을 나타내는 카드 컴포넌트. 아이콘, 제목, 발급기관을 가로형으로 표시하며 클릭 시 상세 팝업을 엽니다.',
      },
    },
  },
} satisfies Meta<typeof AwardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Award Card',
  parameters: {
    docs: {
      description: {
        story:
          '가로형 카드. 연도는 상위 그룹 헤더에 표시되고, 긴 제목과 발급기관은 줄바꿈됩니다.',
      },
    },
  },
};
