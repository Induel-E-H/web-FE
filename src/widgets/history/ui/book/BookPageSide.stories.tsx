import type { Meta, StoryObj } from '@storybook/react-vite';

import { BookPageSide } from './BookPageSide';
import { ListPage } from './content_container/List';
import { TimelinePage } from './content_container/Timeline';

const meta = {
  title: 'Widgets/History/Book/BookPageSide',
  component: BookPageSide,
  args: {
    side: 'left',
    staticContent: null,
    flipFrontContent: null,
    flipBackContent: null,
    isFlipping: false,
    flipDirection: null,
    flipDuration: 800,
    shadowCount: 3,
    isHidden: false,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '단일 페이지 면의 정적 콘텐츠와 PageFlip 애니메이션을 조합하는 컴포넌트. side와 flipDirection의 조합에 따라 플립 패널을 조건부 렌더링합니다.',
      },
    },
  },
} satisfies Meta<typeof BookPageSide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftPage: Story = {
  name: '좌측 페이지 (정적)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div style={{ position: 'relative', width: '300px', height: '450px' }}>
        <BookPageSide
          side='left'
          staticContent={<ListPage side='left' />}
          flipFrontContent={<ListPage side='left' />}
          flipBackContent={<TimelinePage side='right' />}
          isFlipping={false}
          flipDirection={null}
          flipDuration={800}
          shadowCount={3}
          isHidden={false}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '플립 없는 정적 좌측 페이지. ListPage 콘텐츠와 3단계 외부 그림자가 표시됩니다.',
      },
    },
  },
};

export const RightPage: Story = {
  name: '우측 페이지 (정적)',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div style={{ position: 'relative', width: '300px', height: '450px' }}>
        <BookPageSide
          side='right'
          staticContent={<TimelinePage side='right' />}
          flipFrontContent={<TimelinePage side='right' />}
          flipBackContent={<ListPage side='left' />}
          isFlipping={false}
          flipDirection={null}
          flipDuration={800}
          shadowCount={2}
          isHidden={false}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '플립 없는 정적 우측 페이지. TimelinePage 콘텐츠와 2단계 외부 그림자가 표시됩니다.',
      },
    },
  },
};

export const NoShadow: Story = {
  name: '그림자 없음',
  render: () => (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div style={{ position: 'relative', width: '300px', height: '450px' }}>
        <BookPageSide
          side='left'
          staticContent={<TimelinePage side='left' />}
          flipFrontContent={null}
          flipBackContent={null}
          isFlipping={false}
          flipDirection={null}
          flipDuration={800}
          shadowCount={0}
          isHidden={false}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'shadowCount=0이면 외부 그림자 레이어가 없습니다. 첫/마지막 페이지에서 사용됩니다.',
      },
    },
  },
};
