import { useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import '../styles/ImageSlider.css';

const SWIPE_THRESHOLD = 50;

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
  const touchStartXRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return;
    const delta = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) onNext();
      else onPrev();
      onRelease();
    }
    touchStartXRef.current = null;
  }

  function handleMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('.image-slider__nav')) return;
    mouseStartXRef.current = e.clientX;
    setIsDragging(true);
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (mouseStartXRef.current === null) return;
    const delta = mouseStartXRef.current - e.clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) onNext();
      else onPrev();
      onRelease();
    }
    mouseStartXRef.current = null;
    setIsDragging(false);
  }

  function handleMouseLeave() {
    mouseStartXRef.current = null;
    setIsDragging(false);
  }

  return (
    <div className='image-slider' role='region' aria-label='이미지 슬라이더'>
      <div
        className={`image-slider__frame${isDragging ? ' image-slider__frame--dragging' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
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
                loading='lazy'
                draggable={false}
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
          <IoIosArrowBack size='1.25vmax' aria-hidden='true' />
        </button>
        <button
          className='image-slider__nav image-slider__nav--next'
          onMouseDown={onNext}
          onMouseUp={onRelease}
          onMouseLeave={onRelease}
          aria-label='다음 이미지'
        >
          <IoIosArrowForward size='1.25vmax' aria-hidden='true' />
        </button>
        <div
          className='image-slider__indicator'
          aria-live='polite'
          aria-atomic='true'
        >
          <span className='sr-only'>이미지</span>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
