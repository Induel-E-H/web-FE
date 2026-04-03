import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import '../styles/ImageSlider.css';

interface ImageSliderProps {
  images: string[];
  currentIndex: number;
  alt?: string;
  imageRadius?: string;
  onPrev: () => void;
  onNext: () => void;
  onRelease: () => void;
}

export function ImageSlider({
  images,
  currentIndex,
  alt = '',
  imageRadius = '10px',
  onPrev,
  onNext,
  onRelease,
}: ImageSliderProps) {
  return (
    <div className='image-slider'>
      <div className='image-slider__frame'>
        <div
          className='image-slider__track'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src) => (
            <div key={src} className='image-slider__slide'>
              <img
                src={src}
                alt={alt ? `${alt} - ${images.indexOf(src) + 1}` : ''}
                style={{ borderRadius: imageRadius }}
              />
            </div>
          ))}
        </div>
        <button
          className='image-slider__nav image-slider__nav--prev'
          onMouseDown={onPrev}
          onMouseUp={onRelease}
          onMouseLeave={onRelease}
          aria-label='이전 이미지'
        >
          <IoIosArrowBack size='1.25vmax' />
        </button>
        <button
          className='image-slider__nav image-slider__nav--next'
          onMouseDown={onNext}
          onMouseUp={onRelease}
          onMouseLeave={onRelease}
          aria-label='다음 이미지'
        >
          <IoIosArrowForward size='1.25vmax' />
        </button>
        <div className='image-slider__indicator'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
