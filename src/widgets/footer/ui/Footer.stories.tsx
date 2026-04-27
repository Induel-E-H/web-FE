import { MemoryRouter } from 'react-router-dom';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Footer } from './Footer';

const meta = {
  title: 'Widgets/Footer',
  component: Footer,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Page 7 하단에 위치하는 Footer 위젯.',
          '',
          '**구성 영역**',
          '- 좌측 상단: 회사 로고 아이콘 + 한글/영문 회사명',
          '- 우측 상단: 개인정보처리방침 버튼 (`/privacy_policy` 라우트로 이동)',
          '- 구분선(hr)',
          '- 좌측 하단: 대표이사명 · 사업자등록번호 · 주소',
          '- 우측 하단: TEL · FAX · EMAIL',
          '- 하단: 저작권 표기 (설립 연도 ~ 현재 연도)',
          '',
          '`useNavigate` 의존성이 있어 MemoryRouter 데코레이터가 적용됩니다.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story:
          '실제 서비스와 동일한 Footer 레이아웃. 회사 정보(대표이사, 사업자등록번호, 주소, 연락처)와 저작권 표기가 렌더링됩니다.',
      },
    },
  },
};
