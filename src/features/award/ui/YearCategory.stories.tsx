import type { Meta, StoryObj } from '@storybook/react-vite';

import { YEAR_LIST } from '../model/constant';
import { YearCategory } from './YearCategory';

const meta = {
  title: 'Features/Award/YearCategory',
  component: YearCategory,
  args: {
    yearList: YEAR_LIST,
    activeYear: '전체',
    onYearChange: () => {},
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Award 위젯의 연도 카테고리 컴포넌트. 연도별로 수상 기록을 필터링하는 역할을 합니다.',
      },
    },
  },
} satisfies Meta<typeof YearCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
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
  args: {
    activeYear: YEAR_LIST[1],
  },
  parameters: {
    docs: {
      description: {
        story:
          '2020년이 선택된 상태를 시뮬레이션하여 해당 연도의 수상 기록이 필터링됩니다.',
      },
    },
  },
};
