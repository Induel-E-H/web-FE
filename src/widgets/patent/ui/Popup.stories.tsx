import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PatentPopup } from './Popup';

const meta = {
  title: 'Widgets/Patent/Popup',
  component: PatentPopup,
  args: {
    onClose: fn(),
    patentId: 0,
    patentTitle: '특허증 이미지',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '특허증 카드 클릭 시 열리는 팝업. 해당 특허증 이미지를 전체화면 오버레이로 표시하며, 닫기 버튼 또는 배경 클릭으로 닫힙니다.',
      },
    },
  },
} satisfies Meta<typeof PatentPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '팝업 열림',
  parameters: {
    docs: {
      description: {
        story:
          '팝업이 열렸을 때의 모습. 전체화면 오버레이로 특허증 이미지가 표시되고, 닫기 버튼이 우측 상단에 위치합니다.',
      },
    },
  },
};
