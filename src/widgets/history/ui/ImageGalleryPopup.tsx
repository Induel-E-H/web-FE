import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

import { ImageSlider, useSliderNavigation } from '@shared/ui/ImageSlider';

import '../styles/ImageGalleryPopup.css';

interface ImageGalleryPopupProps {
  title: string;
  images: string[];
  onClose: () => void;
}

export function ImageGalleryPopup({
  title,
  images,
  onClose,
}: ImageGalleryPopupProps) {
  const {
    currentIndex,
    goToPrevSlide,
    goToNextSlide,
    startContinuousSlide,
    stopContinuousSlide,
  } = useSliderNavigation(images.length);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      e.stopImmediatePropagation();
      if (e.key === 'Escape') onClose();
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') startContinuousSlide(goToPrevSlide);
      if (e.key === 'ArrowRight') startContinuousSlide(goToNextSlide);
    }

    function handleKeyUp(e: KeyboardEvent) {
      e.stopImmediatePropagation();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
        stopContinuousSlide();
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [
    onClose,
    goToPrevSlide,
    goToNextSlide,
    startContinuousSlide,
    stopContinuousSlide,
  ]);

  return (
    <div
      className='image-gallery-overlay'
      onMouseDown={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='image-gallery-popup'>
        <div className='image-gallery-popup__header'>
          <h3 className='image-gallery-popup__title'>{title}</h3>
          <button
            className='image-gallery-popup__close'
            onClick={onClose}
            aria-label='닫기'
          >
            <IoMdClose size='1.6vmax' />
          </button>
        </div>
        <hr />
        <ImageSlider
          images={images}
          currentIndex={currentIndex}
          alt={title}
          onPrev={() => startContinuousSlide(goToPrevSlide)}
          onNext={() => startContinuousSlide(goToNextSlide)}
          onRelease={stopContinuousSlide}
        />
      </div>
    </div>
  );
}
