import { FiAward } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { InfoCard } from './InfoCard';

const meta = {
  title: 'Shared/InfoCard',
  component: InfoCard,
  args: {
    icon: <FiAward />,
    year: { text: '2023년', dateTime: '2023' },
    title: '우수 기업 대상',
    secondary: '산업통상자원부',
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '아이콘·연도·제목·발급기관을 표시하는 클릭형 카드 컴포넌트. 수상 목록, 특허 목록 등 항목 선택 UI에 활용됩니다.',
      },
    },
  },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '수상 카드',
  parameters: {
    docs: {
      description: {
        story: '수상 항목 카드 기본 형태.',
      },
    },
  },
};

export const Patent: Story = {
  name: '특허 카드',
  args: {
    icon: <IoDocumentTextOutline />,
    year: { text: '2021년', dateTime: '2021' },
    title: '친환경 도시 경관 설계 공법',
    secondary: '특허청',
  },
  parameters: {
    docs: {
      description: {
        story: '특허 항목 카드 형태.',
      },
    },
  },
};

export const LongTitle: Story = {
  name: '긴 제목 (말줄임)',
  args: {
    title: '도시 경관 및 외장 설계 분야 최우수 혁신 기업 대상 수상',
    secondary: '한국산업기술진흥원',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '160px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '제목이 2줄을 초과하면 말줄임 처리됩니다.',
      },
    },
  },
};
