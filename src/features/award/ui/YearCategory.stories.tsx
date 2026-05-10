import type { Meta, StoryObj } from '@storybook/react-vite';

import { YEAR_LIST } from '../model/constant';
import { useAwardStore } from '../model/useAwardStore';
import { YearCategory } from './YearCategory';

const meta = {
  title: 'Features/Award/YearCategory',
  component: YearCategory,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Award 위젯의 연도 카테고리 컴포넌트. Zustand 스토어의 activeYear에 따라 활성 연도가 결정됩니다.',
      },
      story: { inline: false },
    },
  },
} satisfies Meta<typeof YearCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  decorators: [
    (Story) => {
      useAwardStore.setState({ activeYear: '전체' });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          '전체 연도가 선택된 상태를 시뮬레이션하여 모든 수상 기록이 표시됩니다.',
      },
    },
  },
};

export const SelectedYear: Story = {
  name: '선택된 연도',
  decorators: [
    (Story) => {
      useAwardStore.setState({ activeYear: YEAR_LIST[1] });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          '특정 연도가 선택된 상태를 시뮬레이션하여 해당 연도의 수상 기록이 필터링됩니다.',
      },
    },
  },
};
