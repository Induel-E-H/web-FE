import { useEffect, useState } from 'react';

import { getAllContentImages } from '@entities/history';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ImageGalleryPopup } from './ImageGalleryPopup';

const meta = {
  title: 'Widgets/History/ImageGalleryPopup',
  component: ImageGalleryPopup,
  args: {
    title: '서울 도시 재생 프로젝트',
    images: [],
    onClose: fn(),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ImageSlider + Popup 조합의 작품 이미지 갤러리. ← → 화살표 키로 슬라이드, Escape로 닫기를 지원합니다.',
      },
    },
  },
} satisfies Meta<typeof ImageGalleryPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '이미지 갤러리',
  render: (args) => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
      void getAllContentImages(0).then(setImages);
    }, []);

    return <ImageGalleryPopup {...args} images={images} />;
  },
  parameters: {
    docs: {
      description: {
        story: '첫 번째 작품의 이미지를 비동기 로드하여 표시합니다.',
      },
    },
  },
};

export const MultipleImages: Story = {
  name: '다중 이미지 (인덱스 6)',
  render: (args) => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
      void getAllContentImages(6).then(setImages);
    }, []);

    return (
      <ImageGalleryPopup {...args} title='다중 이미지 갤러리' images={images} />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '이미지가 여러 장인 경우. 좌우 버튼으로 슬라이드를 넘깁니다.',
      },
    },
  },
};
