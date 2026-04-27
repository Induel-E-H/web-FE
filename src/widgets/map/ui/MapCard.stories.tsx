import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapCard } from './MapCard';

const meta = {
  title: 'Widgets/Map/MapCard',
  component: MapCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Map 섹션의 교통편 안내 카드. 지하철·버스·자가용 노선 정보와 전화 문의 링크를 포함한 address 요소입니다.',
      },
    },
  },
} satisfies Meta<typeof MapCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '교통편 전체 목록과 전화 문의 링크가 표시된 기본 뷰.',
      },
    },
  },
};
