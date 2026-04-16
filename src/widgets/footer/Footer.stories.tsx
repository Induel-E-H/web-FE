import { MemoryRouter } from 'react-router-dom';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Footer } from './ui/Footer';

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

export const Desktop: Story = {
  name: 'Desktop (1920px)',
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: '1440px 이상 데스크탑 해상도에서의 Footer 레이아웃.',
      },
    },
  },
};

export const Tablet: Story = {
  name: 'Tablet (768px)',
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          '1024px 이하 태블릿 해상도에서의 Footer 레이아웃. vmin 단위로 전환됩니다.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile (375px)',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          '767px 이하 모바일 해상도에서의 Footer 레이아웃. footer__content가 column 방향으로 전환되고 footer__right가 좌측 정렬됩니다.',
      },
    },
  },
};
