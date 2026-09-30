import type { Meta, StoryObj } from '@storybook/react-vite';

import { History } from './History';

const meta = {
  title: 'Widgets/History',
  component: History,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Page 5에 위치하는 History 위젯. 책 넘기기 UI로 회사 연혁을 탐색합니다.',
          '',
          '**구성 요소**',
          '- HistoryTitle: "HISTORY / 걸어온 길" 섹션 타이틀',
          '- HistoryCategory: List / Content / Timeline / Milestones 카테고리 탭',
          '- Book: `@gullabs/react-flipbook` 기반 책 (앞표지 · 페이지 · 뒤표지 하드커버)',
          '',
          '**내비게이션**',
          '- 페이지를 잡고 드래그하거나 클릭해서 넘기기 (모바일은 스와이프 + 하단 버튼)',
          '- 꾹 누르고 있으면 빠르게 연속 넘기기',
          '- 카테고리 탭 / List 항목 클릭 시 해당 페이지까지 여러 장 연속 넘기기',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof History>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'History 위젯',
  parameters: {
    docs: {
      description: {
        story:
          '앞 표지부터 시작. 표지를 드래그하거나 클릭하면 책이 열립니다. 카테고리 탭으로 섹션을 이동할 수 있습니다.',
      },
    },
  },
};
