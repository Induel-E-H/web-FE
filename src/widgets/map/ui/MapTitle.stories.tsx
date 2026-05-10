import type { Meta, StoryObj } from '@storybook/react-vite';

import { MapTitle } from './MapTitle';

const meta = {
  title: 'Widgets/Map/MapTitle',
  component: MapTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Map 섹션의 타이틀 컴포넌트. 영문 서브타이틀 "LOCATION"과 한글 메인 타이틀 "찾아오시는 길"을 SectionTitle 공유 컴포넌트로 렌더링합니다.',
      },
    },
  },
} satisfies Meta<typeof MapTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '뷰포트 진입 시 is-visible 클래스가 부착되어 나타나는 타이틀.',
      },
    },
  },
};
