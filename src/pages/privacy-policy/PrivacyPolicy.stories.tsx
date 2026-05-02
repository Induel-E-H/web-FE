import { MemoryRouter } from 'react-router-dom';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { PrivacyPolicy } from './PrivacyPolicy';

const meta = {
  title: 'Pages/PrivacyPolicy',
  component: PrivacyPolicy,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/privacy']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '개인정보처리방침 페이지. Header, Footer 포함 전체 레이아웃 구조를 가지며 목차 기반 앵커 스크롤 구조를 포함한다.',
      },
    },
  },
} satisfies Meta<typeof PrivacyPolicy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '실제 서비스와 동일한 개인정보처리방침 전체 페이지 레이아웃.',
      },
    },
  },
};
