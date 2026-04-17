import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Pagination } from './Pagination';

const meta = {
  title: 'Features/Award/Pagination',
  component: Pagination,
  args: {
    currentPage: 0,
    totalPages: 5,
    onPageChange: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Award 위젯의 페이지네이션 컴포넌트. 현재 페이지와 총 페이지 수를 표시하며, 페이지 변경 시 onPageChange 콜백을 호출합니다.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '현재 페이지 0, 총 페이지 5인 기본 상태.',
      },
    },
  },
};

export const MiddlePage: Story = {
  name: '중간 페이지',
  args: {
    currentPage: 2,
  },
  parameters: {
    docs: {
      description: {
        story: '현재 페이지 2로 설정하여 중간 페이지 상태를 시뮬레이션.',
      },
    },
  },
};

export const LastPage: Story = {
  name: '마지막 페이지',
  args: {
    currentPage: 4,
  },
  parameters: {
    docs: {
      description: {
        story: '현재 페이지 4로 설정하여 마지막 페이지 상태를 시뮬레이션.',
      },
    },
  },
};
