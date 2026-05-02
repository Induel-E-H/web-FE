import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import '../../styles/History.css';
import { BookFrontCover, FrontCoverInner } from './FrontCover';

const meta = {
  title: 'Widgets/History/Book/FrontCover',
  component: BookFrontCover,
  args: {
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '앞 표지 컴포넌트. 마운트 후 requestAnimationFrame으로 중앙 정렬 애니메이션이 재생됩니다. 클릭 시 onClick 콜백을 400ms 딜레이 후 호출하여 닫기 애니메이션을 허용합니다.',
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
} satisfies Meta<typeof BookFrontCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '앞 표지',
  parameters: {
    docs: {
      description: {
        story: '앞 표지 전체. 마운트 후 중앙 정렬 애니메이션이 재생됩니다.',
      },
    },
  },
};

export const Inner: Story = {
  name: '앞 표지 내부 콘텐츠',
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
        <FrontCoverInner />
      </div>
    </section>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'CoverFlip 애니메이션에서 독립적으로 사용되는 앞 표지 내부 콘텐츠. 회사명과 설립 연수를 표시합니다.',
      },
    },
  },
};
