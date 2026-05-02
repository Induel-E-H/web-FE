import type { Meta, StoryObj } from '@storybook/react-vite';

import { HistoryTitle } from './HistoryTitle';

const meta = {
  title: 'Widgets/History/HistoryTitle',
  component: HistoryTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'History 섹션의 타이틀 컴포넌트. SectionTitle을 래핑하여 "HISTORY / 걸어온 길"을 표시합니다.',
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
} satisfies Meta<typeof HistoryTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'History 타이틀',
  parameters: {
    docs: {
      description: {
        story: 'HISTORY / 걸어온 길 섹션 타이틀이 렌더링되는 모습.',
      },
    },
  },
};
