import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../styles/History.css';
import { FrontCoverInner } from './FrontCover';

const meta = {
  title: 'Widgets/History/Book/FrontCover',
  component: FrontCoverInner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '책의 첫 장(하드커버)에 들어가는 앞 표지 콘텐츠. 회사명과 설립 연수를 표시합니다.',
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
} satisfies Meta<typeof FrontCoverInner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
