import { MemoryRouter } from 'react-router-dom';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Footer } from './Footer';

const meta = {
  title: 'Widgets/Footer',
  component: Footer,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page 7 하단에 위치하는 Footer 위젯. 회사 로고, 회사명, 개인정보처리방침 링크, 사업자 정보, 연락처, 저작권 표기를 포함합니다.',
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: 'Footer 레이아웃.',
      },
    },
  },
};
