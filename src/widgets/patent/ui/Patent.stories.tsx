import type { Meta, StoryObj } from '@storybook/react-vite';

import { Patent } from './Patent';

const meta = {
  title: 'Widgets/Patent',
  component: Patent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page 6에 위치하는 Patent 위젯. 섹션 타이틀, 유효 특허증 목록(카드 그리드 + 팝업), 만료 특허 이력(순번 리스트)으로 구성됩니다.',
      },
    },
  },
} satisfies Meta<typeof Patent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Patent 뷰포트',
  parameters: {
    docs: {
      description: {
        story:
          '전체 Patent 섹션. 상단 타이틀, 유효 특허증 5건(카드), 만료 특허 이력 10건(리스트)이 순서대로 렌더링됩니다.',
      },
    },
  },
};
