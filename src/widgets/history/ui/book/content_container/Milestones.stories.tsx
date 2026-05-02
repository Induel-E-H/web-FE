import type { ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { MilestonesPage } from './Milestones';

function BookPageWrapper({
  side,
  children,
}: {
  side: 'left' | 'right';
  children: ReactNode;
}) {
  return (
    <section
      className='history'
      style={{ height: 'auto', minHeight: 'auto', padding: 0 }}
    >
      <div style={{ position: 'relative', width: '300px', height: '450px' }}>
        <div className={`history__book-page-${side}`}>
          <div className='history__book-page-content'>{children}</div>
        </div>
      </div>
    </section>
  );
}

const meta = {
  title: 'Widgets/History/Book/ContentContainer/Milestones',
  component: MilestonesPage,
  args: {
    side: 'left',
    pageIndex: 0,
    breakpoint: 'desktop',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '연도별 이정표 페이지. breakpoint에 따라 연도 범위가 달라지며, pageIndex로 표시할 페이지를 지정합니다. 첫 번째 페이지(index 0 좌측)에만 "Milestones" 타이틀이 표시됩니다.',
      },
    },
  },
} satisfies Meta<typeof MilestonesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstSpread: Story = {
  name: '1페이지 좌측 (2003-2006)',
  render: (args) => (
    <BookPageWrapper side='left'>
      <MilestonesPage
        side='left'
        pageIndex={args.pageIndex}
        breakpoint={args.breakpoint}
      />
    </BookPageWrapper>
  ),
  args: { side: 'left', pageIndex: 0, breakpoint: 'desktop' },
  parameters: {
    docs: {
      description: {
        story:
          '첫 번째 펼침면 좌측. "Milestones" 타이틀과 2003~2006년 이정표가 표시됩니다.',
      },
    },
  },
};

export const FirstSpreadRight: Story = {
  name: '1페이지 우측 (2007-2009)',
  render: (args) => (
    <BookPageWrapper side='right'>
      <MilestonesPage
        side='right'
        pageIndex={args.pageIndex}
        breakpoint={args.breakpoint}
      />
    </BookPageWrapper>
  ),
  args: { side: 'right', pageIndex: 0, breakpoint: 'desktop' },
  parameters: {
    docs: {
      description: {
        story:
          '좌/우 페이지가 하나의 펼침면을 구성합니다. 좌측 데이터 인덱스 0, 우측 인덱스 1.',
      },
    },
  },
};

export const SecondSpread: Story = {
  name: '2페이지 좌측 (2010-2012)',
  render: (args) => (
    <BookPageWrapper side='left'>
      <MilestonesPage
        side='left'
        pageIndex={args.pageIndex}
        breakpoint={args.breakpoint}
      />
    </BookPageWrapper>
  ),
  args: { side: 'left', pageIndex: 1, breakpoint: 'desktop' },
  parameters: {
    docs: {
      description: {
        story: '두 번째 펼침면 좌측. 2010~2012년 이정표가 표시됩니다.',
      },
    },
  },
};

export const MobileBreakpoint: Story = {
  name: '모바일 breakpoint',
  render: (args) => (
    <BookPageWrapper side='left'>
      <MilestonesPage
        side='left'
        pageIndex={args.pageIndex}
        breakpoint={args.breakpoint}
      />
    </BookPageWrapper>
  ),
  args: { side: 'left', pageIndex: 0, breakpoint: 'mobile' },
  parameters: {
    docs: {
      description: {
        story:
          '모바일에서는 페이지당 연도 범위가 좁아져 더 많은 페이지로 분할됩니다.',
      },
    },
  },
};
