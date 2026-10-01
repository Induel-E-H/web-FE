import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../styles/History.css';
import { BackCoverInner } from './BackCover';

const meta = {
  title: 'Widgets/History/Book/BackCover',
  component: BackCoverInner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '책의 마지막 장(하드커버)에 들어가는 뒤 표지 콘텐츠. EXHIBITION · ENVIRONMENTAL · INTERIOR 키워드를 표시합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <section
        className='history'
        style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
      >
        <div
          style={{ position: 'relative', width: '620px', height: '662.5px' }}
        >
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof BackCoverInner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
