import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { BookPageOuterShadow } from './BookPageOuterShadow';

const shadowVars = {
  '--book-shadow-dark': '#b9b9b9',
  '--book-shadow-dark-line': '#828282',
  '--book-shadow-mid': '#cdcdcd',
  '--book-shadow-mid-line': '#969696',
  '--book-shadow-light': '#e1e1e1',
  '--book-shadow-light-line': '#b4b4b4',
} as CSSProperties;

const meta = {
  title: 'Widgets/History/Book/BookPageOuterShadow',
  component: BookPageOuterShadow,
  args: {
    side: 'left',
    count: 3,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '책 페이지 외부 그림자. count에 따라 1~3단계 레이어를 쌓아 페이지 두께감을 표현합니다. 좌측은 내림차순(3→1), 우측은 오름차순(1→3)으로 배치됩니다.',
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const side = (ctx.args.side as 'left' | 'right') ?? 'left';
      return (
        <div
          className={`history__book-page-${side}`}
          style={{
            ...shadowVars,
            position: 'static',
            height: '200px',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof BookPageOuterShadow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftCount3: Story = {
  name: '좌측 3단계',
  args: { side: 'left', count: 3 },
  parameters: {
    docs: {
      description: {
        story:
          '좌측 페이지. 3→2→1 내림차순으로 레이어를 쌓아 두께감을 표현합니다.',
      },
    },
  },
};

export const RightCount3: Story = {
  name: '우측 3단계',
  args: { side: 'right', count: 3 },
  parameters: {
    docs: {
      description: {
        story: '우측 페이지. 1→2→3 오름차순으로 레이어를 쌓습니다.',
      },
    },
  },
};
