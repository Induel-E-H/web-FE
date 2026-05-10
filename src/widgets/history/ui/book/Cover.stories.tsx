import type { Meta, StoryObj } from '@storybook/react-vite';

import { BookCover } from './Cover';

const meta = {
  title: 'Widgets/History/Book/Cover',
  component: BookCover,
  args: {
    side: 'left',
    isHidden: false,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '책 표지 배경 컴포넌트. 좌/우 표지 각각의 배경색, 모서리 반경, 척추(spine) 디테일을 렌더링합니다. position: absolute로 부모를 채웁니다.',
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
            position: 'relative',
            width: '620.078px',
            height: '662.5px',
          }}
        >
          <Story />
        </div>
      </section>
    ),
  ],
} satisfies Meta<typeof BookCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  name: '좌측 표지',
  args: { side: 'left' },
  parameters: {
    docs: {
      description: {
        story: '좌측 표지. 우측 모서리가 직각으로 책 중앙 척추와 맞닿습니다.',
      },
    },
  },
};

export const Right: Story = {
  name: '우측 표지',
  args: { side: 'right' },
  parameters: {
    docs: {
      description: {
        story:
          '우측 표지. 좌측 모서리가 직각이며 우측에 둥근 모서리와 척추 디테일이 표시됩니다.',
      },
    },
  },
};

export const Hidden: Story = {
  name: '숨김 상태',
  args: { side: 'left', isHidden: true },
  parameters: {
    docs: {
      description: {
        story:
          'isHidden=true 시 visibility: hidden으로 공간은 유지하면서 숨깁니다. 표지 전환 애니메이션 중 상대편 면에 적용됩니다.',
      },
    },
  },
};
