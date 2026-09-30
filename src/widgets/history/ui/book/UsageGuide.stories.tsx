import type { Meta, StoryObj } from '@storybook/react-vite';

import '../../styles/History.css';
import { UsageGuide } from './UsageGuide';

const meta = {
  title: 'Widgets/History/Book/UsageGuide',
  component: UsageGuide,
  args: { landscape: true },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '앞표지 안쪽 면지에 적힌 책 넘기는 방법. 가로(PC)는 클릭·드래그·꾹 누르기·키보드, 반쪽 보기(태블릿/모바일)는 스와이프·버튼·꾹 누르기를 안내합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <section
        className='history'
        style={{ height: 'auto', minHeight: 'auto', padding: '2rem' }}
      >
        <div
          style={{
            width: '452px',
            height: '667px',
            backgroundColor: 'var(--mauve-700)',
          }}
        >
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof UsageGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spread: Story = { name: '가로 (PC)' };

export const Half: Story = {
  name: '반쪽 보기 (태블릿/모바일)',
  args: { landscape: false },
};
