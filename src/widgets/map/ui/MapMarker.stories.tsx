import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapMarker } from './MapMarker';

const meta = {
  title: 'Widgets/Map/MapMarker',
  component: MapMarker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '지도 위 위치를 표시하는 SVG 마커. 회사 로고 아이콘이 내장된 핀 형태이며 하단에 그림자 효과가 포함됩니다.',
      },
    },
  },
} satisfies Meta<typeof MapMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '회사 로고가 내장된 지도 핀 마커.',
      },
    },
  },
};
