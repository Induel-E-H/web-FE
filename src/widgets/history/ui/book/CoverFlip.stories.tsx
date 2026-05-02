import type { Meta, StoryObj } from '@storybook/react-vite';

import { BackCoverInner } from './BackCover';
import { TimelinePage } from './content_container/Timeline';
import { BookCoverFlip } from './CoverFlip';
import { FrontCoverInner } from './FrontCover';

const meta = {
  title: 'Widgets/History/Book/CoverFlip',
  component: BookCoverFlip,
  args: {
    isFlipping: false,
    flipDirection: 'forward',
    flipDuration: 800,
    frontContent: null,
    backContent: null,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '표지 전환 애니메이션 컴포넌트. 앞/뒤 표지 ↔ 책 페이지 간 3D 플립 전환을 담당합니다. isFlipping=true 시 flipDirection에 따라 forward(앞 표지 열기) 또는 backward(뒤 표지 열기) 방향으로 회전합니다.',
      },
    },
  },
} satisfies Meta<typeof BookCoverFlip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpeningFront: Story = {
  name: '앞 표지 열기 (forward)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div style={{ position: 'relative', width: '260px', height: '380px' }}>
        <BookCoverFlip
          isFlipping={false}
          flipDirection='forward'
          flipDuration={800}
          frontContent={<FrontCoverInner />}
          backContent={
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff',
                padding: '1rem',
              }}
            >
              <TimelinePage side='left' />
            </div>
          }
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'isFlipping=false 기본 상태. Controls에서 isFlipping을 true로 변경하면 forward 플립 애니메이션이 재생됩니다.',
      },
    },
  },
};

export const OpeningBack: Story = {
  name: '뒤 표지 열기 (backward)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div style={{ position: 'relative', width: '260px', height: '380px' }}>
        <BookCoverFlip
          isFlipping={false}
          flipDirection='backward'
          flipDuration={800}
          frontContent={<BackCoverInner />}
          backContent={
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff',
                padding: '1rem',
              }}
            >
              <TimelinePage side='right' />
            </div>
          }
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story: 'backward 방향. 뒤 표지가 펼쳐지는 방향 설정입니다.',
      },
    },
  },
};
