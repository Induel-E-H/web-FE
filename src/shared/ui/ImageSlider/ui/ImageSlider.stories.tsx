import { useEffect, useState } from 'react';

import { getAllContentImages } from '@entities/history';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImageSlider } from './ImageSlider';

const meta = {
  title: 'Shared/ImageSlider',
  component: ImageSlider,
  args: {
    images: [],
    currentIndex: 0,
    alt: '히스토리 이미지',
    onPrev: () => {},
    onNext: () => {},
    onRelease: () => {},
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '이미지 슬라이더 컴포넌트. 터치·마우스 드래그 스와이프와 좌우 버튼 네비게이션을 지원합니다. currentIndex, onPrev, onNext, onRelease는 부모에서 useSliderNavigation 훅으로 관리합니다.',
      },
    },
  },
} satisfies Meta<typeof ImageSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: '인터랙티브',
  render: () => {
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
      <div style={{ width: '400px', height: '560px' }}>
        <ImageSlider
          images={images}
          currentIndex={currentIndex}
          alt='히스토리 이미지'
          onPrev={goToPrev}
          onNext={goToNext}
          onRelease={() => {}}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '좌우 버튼 클릭 또는 드래그로 이미지를 전환할 수 있습니다. 버튼은 호버 시 나타납니다.',
      },
    },
  },
};

export const SingleImage: Story = {
  name: '이미지 1장',
  render: () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
      void getAllContentImages(1).then((imgs) => setImages(imgs.slice(0, 1)));
    }, []);

    return (
      <div style={{ width: '400px', height: '560px' }}>
        <ImageSlider
          images={images}
          currentIndex={0}
          alt='단일 이미지'
          onPrev={() => {}}
          onNext={() => {}}
          onRelease={() => {}}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '이미지가 1장일 때의 표시 형태.',
      },
    },
  },
};
