import { AWARD_LIST } from '@entities/award';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AwardCount } from './Count';

const meta = {
  title: 'Widgets/Award/Count',
  component: AwardCount,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '총 수상 건수를 아이콘과 함께 표시하는 컴포넌트.',
      },
    },
  },
} satisfies Meta<typeof AwardCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  name: '기본 (10건)',
  args: {
    awardList: AWARD_LIST,
  },
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '1920px 데스크탑 해상도에서 총 수상 건수 10건이 아이콘과 함께 표시되는 모습.',
      },
    },
  },
};

export const Few: Story = {
  name: '소수 (2건)',
  args: {
    awardList: AWARD_LIST.slice(0, 2),
  },
  globals: {
    viewport: { value: 'desktop' },
  },
  parameters: {
    docs: {
      description: {
        story: '2건만 전달하여 숫자가 동적으로 반영되는지 검증.',
      },
    },
  },
};

export const Tablet: Story = {
  name: '태블릿 뷰포트',
  args: {
    awardList: AWARD_LIST,
  },
  globals: {
    viewport: { value: 'tablet' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '768px 태블릿 해상도에서 총 수상 건수 10건이 아이콘과 함께 표시되는 모습.',
      },
    },
  },
};

export const Mobile: Story = {
  name: '모바일 뷰포트',
  args: {
    awardList: AWARD_LIST,
  },
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '모바일 뷰포트에서도 동일한 컴포넌트가 정상적으로 렌더링되는지 확인.',
      },
    },
  },
};
