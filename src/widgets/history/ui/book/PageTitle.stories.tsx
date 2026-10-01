import type { Meta, StoryObj } from '@storybook/react-vite';

import { BookPageTitle } from './PageTitle';

const meta = {
  title: 'Widgets/History/Book/PageTitle',
  component: BookPageTitle,
  args: {
    title: 'List',
    label: '목차',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지 제목 컴포넌트. 한글 제목(h3) 양옆에 금색 가는 줄과 ✦ 장식을 두고, 아래에 영문 제목을 작게 표시합니다. hidden prop으로 레이아웃 공간을 유지하면서 숨길 수 있습니다.',
      },
    },
  },
} satisfies Meta<typeof BookPageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'List 타이틀',
  args: { title: 'List', label: '목차' },
  parameters: {
    docs: {
      description: {
        story: '한글 제목 양옆에 장식 줄, 아래에 영문 제목이 있는 기본 형태.',
      },
    },
  },
};

export const Timeline: Story = {
  name: 'Timeline 타이틀',
  args: { title: 'Timeline', label: '연혁' },
  parameters: {
    docs: {
      description: {
        story: 'Timeline 페이지용 타이틀.',
      },
    },
  },
};

export const Achievements: Story = {
  name: 'Achievements 타이틀',
  args: { title: 'Achievements', label: '주요 성과' },
  parameters: {
    docs: {
      description: {
        story: '주요 성과(Milestones) 페이지용 타이틀.',
      },
    },
  },
};

export const Hidden: Story = {
  name: '숨긴 타이틀',
  args: { title: 'List', label: '목차', hidden: true },
  parameters: {
    docs: {
      description: {
        story:
          'hidden=true 시 visibility: hidden으로 공간은 유지합니다. 우측 페이지에서 타이틀 높이를 좌측과 맞추기 위해 사용됩니다.',
      },
    },
  },
};
