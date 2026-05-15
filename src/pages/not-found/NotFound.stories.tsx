import { MemoryRouter } from 'react-router-dom';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { NotFound } from './NotFound';

const meta = {
  title: 'Pages/NotFound',
  component: NotFound,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/unknown']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '404 Not Found 페이지. 존재하지 않는 경로 접근 시 렌더링되며, 홈으로 돌아가기 버튼을 포함한다.',
      },
    },
  },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '미매칭 경로 접근 시 표시되는 404 전체 페이지 레이아웃.',
      },
    },
  },
};
