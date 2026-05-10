import type { Meta, StoryObj } from '@storybook/react-vite';

import { PatentExpireContent } from './ExpireContent';

const meta = {
  title: 'Widgets/Patent/ExpireContent',
  component: PatentExpireContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '만료 특허 이력 컴포넌트. PATENT_EXPIRE_LIST(10건)를 순번 리스트로 렌더링합니다. 각 항목은 순번, 특허 제목, 등록번호로 구성되며 팝업 등 별도 인터랙션은 없습니다.',
      },
    },
  },
} satisfies Meta<typeof PatentExpireContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '만료 특허 이력',
  parameters: {
    docs: {
      description: {
        story: '만료 특허 10건이 순번 리스트로 나열됩니다.',
      },
    },
  },
};
