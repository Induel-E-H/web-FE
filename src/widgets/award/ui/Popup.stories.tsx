import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AwardPopup } from './Popup';

const meta = {
  title: 'Widgets/Award/Popup',
  component: AwardPopup,
  args: {
    onClose: fn(),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '수상 카드 클릭 시 열리는 팝업. 해당 수상 이미지를 전체화면 오버레이로 표시하며, 닫기 버튼 또는 배경 클릭으로 닫힙니다.',
      },
    },
  },
} satisfies Meta<typeof AwardPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  name: '팝업 열림 (id=0)',
  args: {
    awardId: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'awardId=0 이미지를 표시하는 팝업 열림 상태.',
      },
    },
  },
};

export const SecondAward: Story = {
  name: '팝업 열림 (id=5)',
  args: {
    awardId: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'awardId=5 이미지를 표시하는 팝업 열림 상태.',
      },
    },
  },
};
