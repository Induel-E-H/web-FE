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

export const Desktop: Story = {
  name: 'Desktop (1920px)',
  args: {
    award: AWARD_LIST[0],
  },
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '1920px 데스크탑 해상도에서의 카드. 제목과 발급기관이 한 줄로 표시되고, 전체적으로 여유로운 레이아웃을 가집니다.',
      },
    },
  },
};

export const Tablet: Story = {
  name: 'Tablet (768px)',
  args: { award: AWARD_LIST[0] },
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '768px 태블릿 해상도에서의 카드. 제목과 발급기관이 한 줄로 표시되지만, 데스크탑보다 좁은 레이아웃으로 약간 더 컴팩트하게 보입니다.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile (375px)',
  args: { award: AWARD_LIST[0] },
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '375px 모바일 해상도에서의 카드. 제목과 발급기관이 두 줄로 표시되어 가독성을 유지하며, 전체적으로 컴팩트한 레이아웃을 가집니다.',
      },
    },
  },
};
