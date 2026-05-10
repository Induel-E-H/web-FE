import { useEffect, useState } from 'react';

import { getAllContentImages } from '@entities/history';
import { ImageSlider } from '@shared/ui/ImageSlider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Popup } from './Popup';

const meta = {
  title: 'Shared/Popup',
  component: Popup,
  args: {
    ariaLabel: '팝업',
    onClose: fn(),
    children: (
      <p style={{ padding: '1rem', color: '#333' }}>팝업 본문 영역입니다.</p>
    ),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '오버레이 기반 모달 팝업. 닫기 버튼, 배경 클릭, Escape 키, popstate 이벤트로 닫힙니다. variant="gallery"를 사용하면 가로 비율이 넓은 갤러리 크기로 표시됩니다.',
      },
    },
  },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '제목 없음',
  parameters: {
    docs: {
      description: {
        story: '제목 없이 닫기 버튼만 있는 기본 팝업.',
      },
    },
  },
};

export const WithTitle: Story = {
  name: '제목 있음',
  args: {
    title: '팝업 제목',
    ariaLabel: '제목 있는 팝업',
  },
  parameters: {
    docs: {
      description: {
        story: 'title prop을 전달하면 헤더 좌측에 h3 제목이 표시됩니다.',
      },
    },
  },
};

export const Gallery: Story = {
  name: '갤러리 variant',
  render: (args) => {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      void getAllContentImages(6).then(setImages);
    }, []);

    function goToPrev() {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }

    function goToNext() {
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }

    return (
      <Popup {...args} variant='gallery' ariaLabel='갤러리 팝업'>
        <ImageSlider
          images={images}
          currentIndex={currentIndex}
          alt='히스토리 이미지'
          onPrev={goToPrev}
          onNext={goToNext}
          onRelease={() => {}}
        />
      </Popup>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'variant="gallery"는 가로 폭이 넓은 갤러리 전용 크기로 표시됩니다. ImageSlider와 함께 사용됩니다.',
      },
    },
  },
};
