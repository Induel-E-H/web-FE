import type { Meta, StoryObj } from '@storybook/react-vite';

import { UnsupportedBrowser } from './UnsupportedBrowser';

const meta = {
  title: 'Pages/UnsupportedBrowser',
  component: UnsupportedBrowser,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Chrome 79 이하 브라우저에서 표시되는 미지원 안내 페이지. Framer Motion 등 의존성 없이 단독 렌더링되며, Chrome 최신 버전 다운로드 링크를 제공한다.',
      },
    },
  },
} satisfies Meta<typeof UnsupportedBrowser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 (Chrome 79 이하)',
  parameters: {
    docs: {
      description: {
        story:
          'Chrome 버전이 80 미만일 때 앱 대신 렌더링된다. 지원 버전 안내표와 Chrome 다운로드 CTA 버튼이 포함된다.',
      },
    },
  },
};
