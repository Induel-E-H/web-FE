import { PATENT_VALID_LIST } from '@entities/patent';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { PatentCard } from './PatentCard';

const meta = {
  title: 'Widgets/Patent/PatentCard',
  component: PatentCard,
  args: {
    onClick: fn(),
    patent: PATENT_VALID_LIST[0],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '유효 특허증 한 건을 나타내는 카드 컴포넌트. 출원 연도, 특허 제목, 등록번호를 InfoCard 공유 컴포넌트로 표시하며 클릭 시 특허증 이미지 팝업을 엽니다.',
      },
    },
  },
} satisfies Meta<typeof PatentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 카드',
  parameters: {
    docs: {
      description: {
        story: `유효 특허증 첫 번째 항목 — "${PATENT_VALID_LIST[0].title}". 출원 연도와 등록번호가 함께 표시됩니다.`,
      },
    },
  },
};
