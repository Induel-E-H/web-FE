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
          '- BookSide(left) + BookSide(right): 책 좌/우 면 렌더링',
          '',
          '**상태 흐름**',
          '- `cover-front`: 앞 표지 표시. 우측 표지 클릭 시 opening-front',
          '- `opening-front`: 앞 표지 열리는 flip',
          '- `closing-front`: 앞 표지 닫히는 flip',
          '- `open`: 책 펼쳐진 상태. 좌/우 클릭으로 페이지 전환',
          '- `opening-back`: 뒷 표지 열리는 flip',
          '- `closing-back`: 뒷 표지 닫히는 flip',
          '- `cover-back`: 뒤 표지 표시. 좌측 표지 클릭 시 opening-back',
          '',
          '**내비게이션**',
          '- 마우스 클릭/터치 홀드로 연속 페이지 넘기기 지원',
          '- 카테고리 탭으로 섹션 간 즉시 이동',
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
          '앞 표지부터 시작. 표지를 클릭하면 책이 열립니다. 좌/우 클릭으로 페이지를 넘기고 카테고리 탭으로 섹션을 이동할 수 있습니다.',
      },
    },
  },
};
