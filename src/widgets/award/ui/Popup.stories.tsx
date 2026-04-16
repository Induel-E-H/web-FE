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

export const Desktop: Story = {
  name: 'Desktop 팝업 열림',
  args: {
    awardId: 0,
  },
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '1920px 데스크탑 해상도에서 팝업이 열렸을 때의 모습. 전체화면 오버레이로 수상 이미지가 표시되고, 닫기 버튼이 우측 상단에 위치합니다.',
      },
    },
  },
};

export const Tablet: Story = {
  name: 'Tablet 팝업 열림',
  args: { awardId: 0 },
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '768px 태블릿 해상도에서 팝업이 열렸을 때의 모습. 전체화면 오버레이로 수상 이미지가 표시되고, 닫기 버튼이 우측 상단에 위치합니다.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile 팝업 열림',
  args: { awardId: 0 },
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '375px 모바일 해상도에서 팝업이 열렸을 때의 모습. 전체화면 오버레이로 수상 이미지가 표시되고, 닫기 버튼이 우측 상단에 위치합니다.',
      },
    },
  },
};
