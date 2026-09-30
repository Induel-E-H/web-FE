import { useAwardStore } from '@features/award';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Viewport } from './Viewport';

const meta = {
  title: 'Widgets/Award/Viewport',
  component: Viewport,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '수상 카드를 연도별 그룹으로 묶어 보여주는 목록 컴포넌트. Zustand 스토어의 activeYear로 필터링하며, 그리드는 화면 폭에 따라 자동으로 열 수가 바뀝니다.',
      },
    },
  },
} satisfies Meta<typeof Viewport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '전체',
  decorators: [
    (Story) => {
      useAwardStore.setState({ activeYear: '전체' });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '모든 연도의 수상 기록이 최신 연도부터 그룹으로 표시됩니다.',
      },
    },
  },
};

export const SingleYear: Story = {
  name: '연도 필터 (2008)',
  decorators: [
    (Story) => {
      useAwardStore.setState({ activeYear: 2008 });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '선택한 연도의 그룹 하나만 표시됩니다.',
      },
    },
  },
};
