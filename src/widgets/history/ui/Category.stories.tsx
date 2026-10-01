import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HistoryCategory } from './Category';

const meta = {
  title: 'Widgets/History/Category',
  component: HistoryCategory,
  args: {
    activeItem: 'List',
    navigateToCategory: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'History 섹션의 카테고리 탭 네비게이션. 현재 펼친 페이지의 카테고리(activeItem)가 활성 탭으로 표시되며, 클릭하면 책이 해당 카테고리까지 여러 장 넘어갑니다.',
      },
      story: { inline: false },
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
  args: { activeItem: 'List' },
};

export const ContentActive: Story = {
  name: 'Content 탭 활성',
  args: { activeItem: 'Content' },
};

export const TimelineActive: Story = {
  name: 'Timeline 탭 활성',
  args: { activeItem: 'Timeline' },
};

export const MilestonesActive: Story = {
  name: 'Milestones 탭 활성',
  args: { activeItem: 'Milestones' },
};
