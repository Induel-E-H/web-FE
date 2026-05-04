import { useHistoryStore } from '@features/history';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HistoryCategory } from './Category';

const meta = {
  title: 'Widgets/History/Category',
  component: HistoryCategory,
  args: {
    navigateToCategory: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'History 섹션의 카테고리 탭 네비게이션. Zustand 스토어의 tabActiveItem에 따라 활성 탭이 결정됩니다.',
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
  decorators: [
    (Story) => {
      useHistoryStore.setState({ tabActiveItem: 'List' });
      return <Story />;
    },
  ],
};

export const ContentActive: Story = {
  name: 'Content 탭 활성',
  decorators: [
    (Story) => {
      useHistoryStore.setState({ tabActiveItem: 'Content' });
      return <Story />;
    },
  ],
};

export const TimelineActive: Story = {
  name: 'Timeline 탭 활성',
  decorators: [
    (Story) => {
      useHistoryStore.setState({ tabActiveItem: 'Timeline' });
      return <Story />;
    },
  ],
};

export const MilestonesActive: Story = {
  name: 'Milestones 탭 활성',
  decorators: [
    (Story) => {
      useHistoryStore.setState({ tabActiveItem: 'Milestones' });
      return <Story />;
    },
  ],
};
