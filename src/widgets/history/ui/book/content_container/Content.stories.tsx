import type { ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { ContentPage } from './Content';

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
  title: 'Widgets/History/Book/ContentContainer/Content',
  component: ContentPage,
  args: {
    side: 'left',
    pageIndex: 0,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '작품 상세 페이지. pageIndex와 side로 artworks 배열에서 작품을 특정합니다. 이미지가 있으면 클릭 시 ImageGalleryPopup을 열며, 공간이 부족하면 아이콘 모드로 전환됩니다.',
      },
    },
  },
} satisfies Meta<typeof ContentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftFirstItem: Story = {
  name: '첫 번째 작품 좌측',
  render: (args) => (
    <BookPageWrapper side='left'>
      <ContentPage side='left' pageIndex={args.pageIndex} />
    </BookPageWrapper>
  ),
  args: { side: 'left', pageIndex: 0 },
};

export const RightFirstItem: Story = {
  name: '첫 번째 작품 우측',
  render: (args) => (
    <BookPageWrapper side='right'>
      <ContentPage side='right' pageIndex={args.pageIndex} />
    </BookPageWrapper>
  ),
  args: { side: 'right', pageIndex: 0 },
  parameters: {
    docs: {
      description: {
        story:
          '같은 pageIndex에서 side가 다르면 다른 작품 인덱스를 표시합니다.',
      },
    },
  },
};

export const LaterPage: Story = {
  name: '후반 페이지',
  render: (args) => (
    <BookPageWrapper side='left'>
      <ContentPage side='left' pageIndex={args.pageIndex} />
    </BookPageWrapper>
  ),
  args: { side: 'left', pageIndex: 5 },
  parameters: {
    docs: {
      description: {
        story:
          '다양한 작품 데이터(subTitle, area, description 등)의 레이아웃을 확인합니다.',
      },
    },
  },
};

export const EmptyPage: Story = {
  name: '빈 페이지',
  render: (args) => (
    <BookPageWrapper side='right'>
      <ContentPage side='right' pageIndex={args.pageIndex} />
    </BookPageWrapper>
  ),
  args: { side: 'right', pageIndex: 999 },
  parameters: {
    docs: {
      description: {
        story:
          'artworks 범위를 벗어난 인덱스에서는 빈 div(.content__empty)를 렌더링합니다.',
      },
    },
  },
};
