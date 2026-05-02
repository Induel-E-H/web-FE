import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import '../../styles/History.css';
import { BackCoverInner, BookBackCover } from './BackCover';

const meta = {
  title: 'Widgets/History/Book/BackCover',
  component: BookBackCover,
  args: {
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '뒤 표지 컴포넌트. 앞 표지와 대칭 구조로 EXHIBITION · ENVIRONMENTAL · INTERIOR 키워드를 표시합니다. 클릭 시 책이 역방향으로 닫힙니다.',
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
} satisfies Meta<typeof BookBackCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '뒤 표지',
};

export const Inner: Story = {
  name: '뒤 표지 내부 콘텐츠',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div
        style={{
          position: 'relative',
          width: '620px',
          height: '662.5px',
          backgroundColor: 'var(--mauve-700)',
        }}
      >
        <BackCoverInner />
      </div>
    </section>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'CoverFlip 애니메이션에서 독립적으로 사용되는 뒤 표지 내부 콘텐츠.',
      },
    },
  },
};
