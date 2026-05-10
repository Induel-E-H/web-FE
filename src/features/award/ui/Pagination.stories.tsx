import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAwardStore } from '../model/useAwardStore';
import { Pagination } from './Pagination';

const meta = {
  title: 'Features/Award/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Award 위젯의 페이지네이션 컴포넌트. Zustand 스토어에서 현재 페이지와 총 페이지 수를 계산하여 표시하며, 페이지 변경 시 스토어를 업데이트합니다.',
      },
      story: { inline: false },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  args: { totalPages: 3 },
  decorators: [
    (Story) => {
      useAwardStore.setState({ currentPage: 0, activeYear: '전체' });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '첫 번째 페이지 상태. 총 3페이지 중 1페이지.',
      },
    },
  },
};

export const MiddlePage: Story = {
  name: '중간 페이지',
  args: { totalPages: 3 },
  decorators: [
    (Story) => {
      useAwardStore.setState({ currentPage: 1, activeYear: '전체' });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '중간 페이지 상태. 총 3페이지 중 2페이지.',
      },
    },
  },
};

export const LastPage: Story = {
  name: '마지막 페이지',
  args: { totalPages: 3 },
  decorators: [
    (Story) => {
      useAwardStore.setState({ currentPage: 2, activeYear: '전체' });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '마지막 페이지 상태. 총 3페이지 중 3페이지.',
      },
    },
  },
};
