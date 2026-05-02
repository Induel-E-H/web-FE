import type { ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { TimelinePage } from './Timeline';

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
      <div
        style={{ position: 'relative', width: '581.5px', height: '640.812px' }}
      >
        <div className={`history__book-page-${side}`}>
          <div className='history__book-page-content'>{children}</div>
        </div>
      </div>
    </section>
  );
}

const meta = {
  title: 'Widgets/History/Book/ContentContainer/Timeline',
  component: TimelinePage,
  args: {
    side: 'left',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '타임라인 페이지. 회사 역사 이벤트를 좌/우 페이지에 절반씩 나눠 표시합니다. 좌측에만 "Timeline" 타이틀이 표시됩니다.',
      },
    },
  },
} satisfies Meta<typeof TimelinePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftPage: Story = {
  name: '좌측 페이지',
  render: () => (
    <BookPageWrapper side='left'>
      <TimelinePage side='left' />
    </BookPageWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: '좌측 페이지. "Timeline" 타이틀과 전반부 이벤트가 표시됩니다.',
      },
    },
  },
};

export const RightPage: Story = {
  name: '우측 페이지',
  render: () => (
    <BookPageWrapper side='right'>
      <TimelinePage side='right' />
    </BookPageWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: '우측은 타이틀이 숨겨지고(hidden) 나머지 항목을 표시합니다.',
      },
    },
  },
};
