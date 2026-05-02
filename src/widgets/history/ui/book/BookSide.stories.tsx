import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { BookSide } from './BookSide';
import { ListPage } from './content_container/List';
import { TimelinePage } from './content_container/Timeline';

const meta = {
  title: 'Widgets/History/Book/BookSide',
  component: BookSide,
  args: {
    side: 'left',
    bookState: 'open',
    isBookOpen: true,
    isCoverFlip: false,
    isFlipping: false,
    isRapidFlipping: false,
    isHoldChaining: false,
    flipDirection: null,
    currentFlipDuration: 800,
    staticPageContent: null,
    flipFrontPageContent: null,
    flipBackPageContent: null,
    shadowCount: 0,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '책의 좌/우 한 면 전체를 담당하는 컴포넌트. bookState에 따라 앞/뒤 표지, 표지 플립 애니메이션, 페이지 콘텐츠를 조건부 렌더링합니다.',
      },
    },
  },
} satisfies Meta<typeof BookSide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FrontCoverState: Story = {
  name: '앞 표지 상태 (우측)',
  render: () => (
    <section className='history'>
      <div className='history__book'>
        <div style={{ flex: 1, position: 'relative', height: '100%' }} />
        <BookSide
          side='right'
          bookState='cover-front'
          isBookOpen={false}
          isCoverFlip={false}
          isFlipping={false}
          isRapidFlipping={false}
          isHoldChaining={false}
          flipDirection={null}
          currentFlipDuration={800}
          staticPageContent={null}
          flipFrontPageContent={null}
          flipBackPageContent={null}
          shadowCount={0}
          onFrontCoverClick={fn()}
        />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="cover-front"일 때 우측에 앞 표지(BookFrontCover)가 표시됩니다. 클릭하면 책이 열립니다.',
      },
    },
  },
};

export const OpenStateLeft: Story = {
  name: '열린 상태 (좌측)',
  render: () => (
    <section className='history'>
      <div className='history__book'>
        <BookSide
          side='left'
          bookState='open'
          isBookOpen={true}
          isCoverFlip={false}
          isFlipping={false}
          isRapidFlipping={false}
          isHoldChaining={false}
          flipDirection={null}
          currentFlipDuration={800}
          staticPageContent={<ListPage side='left' />}
          flipFrontPageContent={<ListPage side='left' />}
          flipBackPageContent={<TimelinePage side='right' />}
          shadowCount={2}
          onMouseDown={fn()}
        />
        <div style={{ flex: 1, position: 'relative', height: '100%' }} />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="open"일 때 좌측에 BookCover 배경과 BookPageSide(페이지 콘텐츠)가 함께 표시됩니다.',
      },
    },
  },
};

export const OpenStateRight: Story = {
  name: '열린 상태 (우측)',
  render: () => (
    <section className='history'>
      <div className='history__book'>
        <div style={{ flex: 1, position: 'relative', height: '100%' }} />
        <BookSide
          side='right'
          bookState='open'
          isBookOpen={true}
          isCoverFlip={false}
          isFlipping={false}
          isRapidFlipping={false}
          isHoldChaining={false}
          flipDirection={null}
          currentFlipDuration={800}
          staticPageContent={<TimelinePage side='right' />}
          flipFrontPageContent={<TimelinePage side='right' />}
          flipBackPageContent={<ListPage side='left' />}
          shadowCount={2}
          onMouseDown={fn()}
        />
      </div>
    </section>
  ),
};

export const BackCoverState: Story = {
  name: '뒤 표지 상태 (좌측)',
  render: () => (
    <section className='history'>
      <div className='history__book'>
        <BookSide
          side='left'
          bookState='cover-back'
          isBookOpen={false}
          isCoverFlip={false}
          isFlipping={false}
          isRapidFlipping={false}
          isHoldChaining={false}
          flipDirection={null}
          currentFlipDuration={800}
          staticPageContent={null}
          flipFrontPageContent={null}
          flipBackPageContent={null}
          shadowCount={0}
          onBackCoverClick={fn()}
        />
        <div style={{ flex: 1, position: 'relative', height: '100%' }} />
      </div>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'bookState="cover-back"일 때 좌측에 뒤 표지(BookBackCover)가 표시됩니다.',
      },
    },
  },
};
