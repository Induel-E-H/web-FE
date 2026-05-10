import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapInfoCard } from './MapInfoCard';

const meta = {
  title: 'Widgets/Map/MapInfoCard',
  component: MapInfoCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '지도 위에 표시되는 회사 정보 말풍선 카드. 로고, 회사명, 전화번호, 주소를 포함하며 하단 말풍선 꼬리가 마커를 가리킵니다.',
      },
    },
  },
} satisfies Meta<typeof MapInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '회사 로고, 전화번호, 주소가 포함된 지도 정보 카드.',
      },
    },
  },
};
