import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionTitle } from './SectionTitle';

const meta = {
  title: 'Shared/SectionTitle',
  component: SectionTitle,
  args: {
    subTitle: 'HISTORY',
    title: '걸어온 길',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '섹션 상단에 배치되는 타이틀 컴포넌트. 상단의 소제목(subTitle)과 하단의 대제목(title)으로 구성되며, 소제목 앞에 골드 라인이 표시됩니다.',
      },
    },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  args: {
    subTitle: 'HISTORY',
    title: '걸어온 길',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 섹션 타이틀. 소제목과 대제목이 수직 정렬로 표시됩니다.',
      },
    },
  },
};

export const Reverse: Story = {
  name: 'Reverse (밝은 배경)',
  args: {
    subTitle: 'AWARD',
    title: '수상 기록',
    variant: 'reverse',
  },
  parameters: {
    docs: {
      description: {
        story:
          'variant="reverse"를 사용하면 h2와 소제목 라인이 브라운 계열 색상으로 표시됩니다. 밝은 배경(Vision, Award, Map 섹션)에서 사용합니다.',
      },
    },
  },
};
