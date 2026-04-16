import type { Meta, StoryObj } from '@storybook/react-vite';

import { AwardTitle } from './Title';

const meta = {
  title: 'Widgets/Award/Title',
  component: AwardTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Award 섹션 상단의 타이틀 컴포넌트. 영문 서브타이틀 "Award"와 한글 제목 "수상 기록"을 hgroup으로 묶어 표시합니다.',
      },
    },
  },
} satisfies Meta<typeof AwardTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  name: '기본',
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story: '1920px 데스크탑 해상도에서 타이틀이 렌더링되는 모습.',
      },
    },
  },
};

export const Tablet: Story = {
  name: '태블릿 뷰포트',
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story: '768px 태블릿 해상도에서 타이틀이 렌더링되는 모습.',
      },
    },
  },
};

export const Mobile: Story = {
  name: '모바일 뷰포트',
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story: '768px 모바일 해상도에서 타이틀이 렌더링되는 모습.',
      },
    },
  },
};
