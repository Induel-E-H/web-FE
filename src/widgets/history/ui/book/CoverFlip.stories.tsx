import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../styles/History.css';
import { BackCoverInner } from './BackCover';
import { BookPageSlot } from './BookPageSlot';
import { ListPage } from './content_container/List';
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
  name: '앞 표지 열기 (opening-front)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div style={{ position: 'relative', width: '620px', height: '662.5px' }}>
        <BookCoverFlip
          isFlipping={true}
          flipDirection='forward'
          flipDuration={800}
          frontContent={<FrontCoverInner />}
          backContent={
            <BookPageSlot side='left' shadowCount={0}>
              <TimelinePage side='left' />
            </BookPageSlot>
          }
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="opening-front". 앞 표지(front)를 forward 방향으로 열어 왼쪽 페이지(back)를 드러냅니다.',
      },
    },
  },
};

export const ClosingFront: Story = {
  name: '앞 표지 닫기 (closing-front)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div style={{ position: 'relative', width: '620px', height: '662.5px' }}>
        <BookCoverFlip
          isFlipping={true}
          flipDirection='backward'
          flipDuration={800}
          frontContent={
            <BookPageSlot side='left' shadowCount={0}>
              <TimelinePage side='left' />
            </BookPageSlot>
          }
          backContent={<FrontCoverInner />}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="closing-front". 왼쪽 페이지(front)를 backward 방향으로 닫아 앞 표지(back)를 드러냅니다.',
      },
    },
  },
};

export const OpeningBack: Story = {
  name: '뒤 표지 열기 (opening-back)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div style={{ position: 'relative', width: '620px', height: '662.5px' }}>
        <BookCoverFlip
          isFlipping={true}
          flipDirection='backward'
          flipDuration={800}
          frontContent={<BackCoverInner />}
          backContent={
            <BookPageSlot side='right' shadowCount={0}>
              <ListPage side='right' />
            </BookPageSlot>
          }
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="opening-back". 뒤 표지(front)를 backward 방향으로 열어 오른쪽 페이지(back)를 드러냅니다.',
      },
    },
  },
};

export const ClosingBack: Story = {
  name: '뒤 표지 닫기 (closing-back)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
    >
      <div style={{ position: 'relative', width: '620px', height: '662.5px' }}>
        <BookCoverFlip
          isFlipping={true}
          flipDirection='forward'
          flipDuration={800}
          frontContent={
            <BookPageSlot side='right' shadowCount={0}>
              <ListPage side='right' />
            </BookPageSlot>
          }
          backContent={<BackCoverInner />}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="closing-back". 오른쪽 페이지(front)를 forward 방향으로 닫아 뒤 표지(back)를 드러냅니다.',
      },
    },
  },
};
