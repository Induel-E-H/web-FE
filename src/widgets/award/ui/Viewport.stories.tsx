import { useAwardStore } from '@features/award';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Viewport } from './Viewport';

const meta = {
  title: 'Widgets/Award/Viewport',
  component: Viewport,
  decorators: [
    (Story) => {
      useAwardStore.setState({ activeYear: '전체', currentPage: 0 });
      return <Story />;
    },
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '수상 카드를 페이지 단위로 슬라이드하는 뷰포트 컴포넌트. itemsPerPage에 따라 2×2 / 3×2 / 5×2 그리드로 전환됩니다. Zustand 스토어의 activeYear와 currentPage를 사용합니다.',
      },
    },
  },
} satisfies Meta<typeof Viewport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '(5×2, 10개/페이지)',
  args: { itemsPerPage: 10 },
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story: '10개 카드가 한 페이지에 5×2로 표시됩니다.',
      },
    },
  },
};

export const Tablet: Story = {
  name: '(3×2, 6개/페이지)',
  args: { itemsPerPage: 6 },
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story: '6개 카드가 한 페이지에 3×2로 표시됩니다.',
      },
    },
  },
};

export const Mobile: Story = {
  name: '(2×2, 4개/페이지)',
  args: { itemsPerPage: 4 },
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story: '4개 카드가 한 페이지에 2×2로 표시됩니다.',
      },
    },
  },
};
