import { buildLeaves } from '@features/history';
import type { FlipBookHandle } from '@gullabs/react-flipbook';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import '../../styles/History.css';
import { Book } from './Book';

const meta = {
  title: 'Widgets/History/Book',
  component: Book,
  args: {
    bookRef: { current: null as FlipBookHandle | null },
    leaves: buildLeaves('desktop'),
    landscape: true,
    renderPage: (leaf) => (
      <p style={{ margin: 'auto' }}>
        {leaf.item} {leaf.pageIndex + 1} ({leaf.side})
      </p>
    ),
    targetLeaf: null,
    onPageChange: fn(),
    onSettled: fn(),
    onHoldStart: fn(),
    onHoldEnd: fn(),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '`@gullabs/react-flipbook` 기반 책 컴포넌트.',
          '- 페이지를 잡고 드래그하거나 클릭해서 넘깁니다.',
          '- 꾹 누르고 있으면 누른 쪽 방향으로 빠르게 연속 넘김(onHoldStart/onHoldEnd).',
          '- 닫힌 상태에서는 표지가 가운데에 놓이고, 마우스를 올리면 살짝 떠오릅니다. 떠 있는 채로 열면 표지가 다 넘어간 뒤 내려옵니다 (가로 모드).',
          '- 세로 모드(태블릿/모바일)는 한 페이지씩 넘기고 아래에 이전/다음 버튼을 둡니다.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <section className='history' style={{ height: '100vh' }}>
        <div className='history__book'>
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof Book>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Landscape: Story = {
  name: '가로 (데스크톱)',
};

export const Portrait: Story = {
  name: '세로 (태블릿/모바일)',
  args: {
    bookRef: { current: null as FlipBookHandle | null },
    leaves: buildLeaves('mobile'),
    landscape: false,
  },
};
