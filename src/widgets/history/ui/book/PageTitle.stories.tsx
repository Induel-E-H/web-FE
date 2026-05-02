import type { Meta, StoryObj } from '@storybook/react-vite';

import { BookPageTitle } from './PageTitle';

const meta = {
  title: 'Widgets/History/Book/PageTitle',
  component: BookPageTitle,
  args: {
    title: 'List',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지 제목 컴포넌트. h3 타이틀 양쪽에 hr 선을 배치하여 책 페이지 스타일을 표현합니다. hidden prop으로 레이아웃 공간을 유지하면서 숨길 수 있습니다.',
      },
    },
  },
} satisfies Meta<typeof BookPageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'List' },
};

export const Timeline: Story = {
  name: 'Timeline 타이틀',
  args: { title: 'Timeline' },
};

export const Milestones: Story = {
  name: 'Milestones 타이틀',
  args: { title: 'Milestones' },
};

export const Hidden: Story = {
  name: '숨긴 타이틀',
  args: { title: 'List', hidden: true },
  parameters: {
    docs: {
      description: {
        story:
          'hidden=true 시 visibility: hidden으로 공간은 유지합니다. 우측 페이지에서 타이틀 높이를 좌측과 맞추기 위해 사용됩니다.',
      },
    },
  },
};
