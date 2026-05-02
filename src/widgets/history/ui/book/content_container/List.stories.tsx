import type { ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ListPage } from './List';

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
  title: 'Widgets/History/Book/ContentContainer/List',
  component: ListPage,
  args: {
    side: 'left',
    onItemClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '작품 목록 페이지. 전체 작품을 좌/우 절반으로 나눠 표시합니다. 좌측에만 "List" 타이틀이 표시되며, 각 항목 클릭 시 Content 페이지로 이동합니다.',
      },
    },
  },
} satisfies Meta<typeof ListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftPage: Story = {
  name: '좌측 목록',
  render: (args) => (
    <BookPageWrapper side='left'>
      <ListPage side='left' onItemClick={args.onItemClick} />
    </BookPageWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '좌측 페이지. "List" 타이틀과 전체 작품 목록의 전반부 항목을 표시합니다.',
      },
    },
  },
};

export const RightPage: Story = {
  name: '우측 목록',
  render: (args) => (
    <BookPageWrapper side='right'>
      <ListPage side='right' onItemClick={args.onItemClick} />
    </BookPageWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: '우측 페이지. 타이틀이 숨겨지고 목록 후반부 항목을 표시합니다.',
      },
    },
  },
};
