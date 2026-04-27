import { VISION_DATA, VISION_IMAGE_MAP } from '@entities/vision';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { VisionItem } from './VisionItem';

const [param, sculpt, invest] = VISION_DATA;

const meta = {
  title: 'Widgets/Vision/VisionItem',
  component: VisionItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Vision 섹션의 개별 아이템 컴포넌트. index가 홀수이면 이미지와 텍스트 순서가 반전되며 어두운 배경 테마가 적용됩니다. IntersectionObserver가 뷰포트 진입을 감지해 페이드-업 애니메이션을 트리거합니다.',
      },
    },
  },
  argTypes: {
    index: {
      control: { type: 'number' },
      description: '아이템 순서 (짝수: 기본 / 홀수: reverse 레이아웃)',
    },
    keyword: {
      control: 'text',
      description: '대형 영문 키워드 (h3)',
    },
    title: {
      control: 'text',
      description: '한글 부제목 (h4)',
    },
    description: {
      control: 'text',
      description: '설명 본문',
    },
    image: {
      control: false,
      description: '이미지 URL (VISION_IMAGE_MAP 에서 resolve된 값)',
    },
  },
} satisfies Meta<typeof VisionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Param: Story = {
  name: 'VISION 1 — Param (기본)',
  args: {
    index: 0,
    keyword: param.keyword,
    title: param.title,
    description: param.description,
    image: VISION_IMAGE_MAP[param.image],
  },
  parameters: {
    docs: {
      description: {
        story:
          '짝수 index(0). 이미지가 왼쪽, 텍스트가 오른쪽에 배치되며 크림 배경이 적용됩니다.',
      },
    },
  },
};

export const Sculpt: Story = {
  name: 'VISION 2 — Sculpt (reverse)',
  args: {
    index: 1,
    keyword: sculpt.keyword,
    title: sculpt.title,
    description: sculpt.description,
    image: VISION_IMAGE_MAP[sculpt.image],
  },
  parameters: {
    docs: {
      description: {
        story:
          '홀수 index(1). 이미지가 오른쪽, 텍스트가 왼쪽으로 반전되며 짙은 브라운 배경과 골드 키워드 색상이 적용됩니다.',
      },
    },
  },
};

export const Invest: Story = {
  name: 'VISION 3 — Invest (기본)',
  args: {
    index: 2,
    keyword: invest.keyword,
    title: invest.title,
    description: invest.description,
    image: VISION_IMAGE_MAP[invest.image],
  },
  parameters: {
    docs: {
      description: {
        story: '짝수 index(2). Param과 동일한 기본 레이아웃 · 배경 테마.',
      },
    },
  },
};
