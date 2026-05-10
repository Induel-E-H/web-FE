import type { Meta, StoryObj } from '@storybook/react-vite';

import { PatentTitle } from './PatentTitle';

const meta = {
  title: 'Widgets/Patent/PatentTitle',
  component: PatentTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Patent 섹션 상단 타이틀. 영문 서브타이틀 "PATENTS"와 한글 메인 타이틀 "특허 취득 기록"을 SectionTitle 공유 컴포넌트로 렌더링합니다.',
      },
    },
  },
} satisfies Meta<typeof PatentTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: 'Patent 섹션 타이틀 렌더링.',
      },
    },
  },
};
