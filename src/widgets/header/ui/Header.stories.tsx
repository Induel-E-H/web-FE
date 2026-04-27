import { MemoryRouter } from 'react-router-dom';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Header } from './Header';

const meta = {
  title: 'Widgets/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '전체 페이지 상단에 고정(fixed)되는 Header 위젯.',
          '',
          '**구성 요소**',
          '- 좌측: 회사 로고 아이콘 + 한글 회사명 (클릭 시 Hero 섹션 또는 홈으로 이동)',
          '- 중앙-우측: 데스크탑 네비게이션 버튼 (VISION · HISTORY · AWARDS · PATENTS · LOCATION)',
          '- 모바일: 햄버거 버튼 → 하단 드롭다운 모바일 메뉴',
          '',
          '**상태 변형**',
          '- `header--hero`: `.hero` 섹션이 뷰포트에 있을 때 배경 투명 + 텍스트 흰색',
          '- `header--hidden`: 아래로 스크롤 시 translateY(-100%) 로 숨겨짐 (5px 임계값)',
          '- `header--menu-open`: Hero 위에서 모바일 메뉴 열릴 때 검정 배경',
          '',
          '`useLocation` · `useNavigate` 의존성이 있어 MemoryRouter 데코레이터가 적용됩니다.',
        ].join('\n'),
      },
    },
  },
  args: {
    onNavClick: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '일반 페이지 헤더',
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/privacy_policy']}>
        <div style={{ minHeight: '100px', background: '#fff' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Hero 섹션 외 일반 페이지에서의 헤더. 흰 배경 + 갈색 텍스트 + 박스 그림자가 표시됩니다.',
      },
    },
  },
};

export const HeroVariant: Story = {
  name: 'Hero 오버레이 헤더',
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div style={{ minHeight: '100px', background: '#111' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Hero 섹션 위에 위치할 때의 헤더. 배경 투명 + 텍스트 흰색 + 박스 그림자 없음. 어두운 배경에서 실제 서비스와 동일하게 확인할 수 있습니다.',
      },
    },
  },
};

export const Mobile: Story = {
  name: '모바일 헤더',
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <div style={{ minHeight: '100px', background: '#111' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  globals: {
    viewport: { value: 'mobile' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '767px 이하 모바일 뷰포트. 데스크탑 nav가 숨겨지고 우측에 햄버거 버튼이 표시됩니다. 버튼을 클릭하면 하단 드롭다운 모바일 메뉴가 열립니다.',
      },
    },
  },
};
