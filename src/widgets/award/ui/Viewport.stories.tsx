import { AWARD_LIST } from '@entities/award';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Viewport } from './Viewport';

const meta = {
  title: 'Widgets/Award/Viewport',
  component: Viewport,
  args: {
    filteredList: AWARD_LIST,
    safePage: 0,
    onCardClick: fn(),
    setCurrentPage: fn(),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '수상 카드를 페이지 단위로 슬라이드하는 뷰포트 컴포넌트. itemsPerPage에 따라 2×2 / 3×2 / 5×2 그리드로 전환됩니다.',
      },
    },
  },
} satisfies Meta<typeof Viewport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '(5×2, 10개/페이지)',
  args: {
    itemsPerPage: 10,
    totalPages: Math.ceil(AWARD_LIST.length / 10),
  },
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
  globals: {
    viewport: { value: 'tablet' },
  },
  args: { itemsPerPage: 6, totalPages: Math.ceil(AWARD_LIST.length / 6) },
};

export const Mobile: Story = {
  name: '(2×2, 4개/페이지)',
  globals: {
    viewport: { value: 'mobile' },
  },
  args: { itemsPerPage: 4, totalPages: Math.ceil(AWARD_LIST.length / 4) },
};
