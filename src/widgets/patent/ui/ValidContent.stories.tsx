import type { Meta, StoryObj } from '@storybook/react-vite';

import { PatentValidContent } from './ValidContent';

const meta = {
  title: 'Widgets/Patent/ValidContent',
  component: PatentValidContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '유효 특허증 목록 컴포넌트. PATENT_VALID_LIST(5건)를 PatentCard 그리드로 렌더링합니다. 카드 클릭 시 해당 특허증 이미지를 Popup 오버레이로 표시하며, 팝업 외부 클릭 또는 닫기 버튼으로 닫힙니다.',
      },
    },
  },
} satisfies Meta<typeof PatentValidContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '유효 특허 목록',
  parameters: {
    docs: {
      description: {
        story:
          '팝업이 닫힌 초기 상태. 유효 특허증 5건이 카드 그리드로 나열됩니다. 카드를 클릭하면 특허증 이미지 팝업이 열립니다.',
      },
    },
  },
};
