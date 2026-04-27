import type { Meta, StoryObj } from '@storybook/react-vite';

import { VisionTitle } from './VisionTitle';

const meta = {
  title: 'Widgets/Vision/VisionTitle',
  component: VisionTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vision 섹션 상단 타이틀. 영문 서브타이틀 "CONCEPT"과 한글 메인 타이틀 "미래를 향한"을 SectionTitle 공유 컴포넌트로 렌더링합니다. IntersectionObserver 기반 페이드-업 애니메이션이 포함됩니다.',
      },
    },
  },
} satisfies Meta<typeof VisionTitle>;

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
