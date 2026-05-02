import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HistoryCategory } from './Category';

const meta = {
  title: 'Widgets/History/Category',
  component: HistoryCategory,
  args: {
    tabActiveItem: 'List',
    navigateToCategory: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'History 섹션의 카테고리 탭 네비게이션. List / Content / Timeline / Milestones 4개 탭을 제공하며 활성 탭에 aria-current와 active 클래스를 적용합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <section
        className='history'
        style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
      >
        <Story />
      </section>
    ),
  ],
} satisfies Meta<typeof HistoryCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListActive: Story = {
  name: 'List 탭 활성',
  args: { tabActiveItem: 'List' },
  parameters: {
    docs: {
      description: {
        story:
          'List 탭이 활성화된 상태. aria-current와 active 클래스가 적용됩니다.',
      },
    },
  },
};

export const ContentActive: Story = {
  name: 'Content 탭 활성',
  args: { tabActiveItem: 'Content' },
  parameters: {
    docs: {
      description: {
        story: 'Content 탭이 활성화된 상태.',
      },
    },
  },
};

export const TimelineActive: Story = {
  name: 'Timeline 탭 활성',
  args: { tabActiveItem: 'Timeline' },
  parameters: {
    docs: {
      description: {
        story: 'Timeline 탭이 활성화된 상태.',
      },
    },
  },
};

export const MilestonesActive: Story = {
  name: 'Milestones 탭 활성',
  args: { tabActiveItem: 'Milestones' },
  parameters: {
    docs: {
      description: {
        story: 'Milestones 탭이 활성화된 상태.',
      },
    },
  },
};
