import { useEffect } from 'react';

import { ImageSlider, useSliderNavigation } from '@shared/ui/ImageSlider';
import { Popup } from '@shared/ui/Popup';

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
    const len = images.length;
    if (len <= 1) return;
    const next = images[(currentIndex + 1) % len];
    const prev = images[(currentIndex - 1 + len) % len];
    [next, prev].forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [currentIndex, images]);

  useEffect(() => {
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
    <Popup ariaLabel={title} title={title} variant='gallery' onClose={onClose}>
      <hr className='image-gallery-popup__divider' />
      <ImageSlider
        images={images}
        currentIndex={currentIndex}
        alt={title}
        onPrev={() => startContinuousSlide(goToPrevSlide)}
        onNext={() => startContinuousSlide(goToNextSlide)}
        onRelease={stopContinuousSlide}
      />
    </Popup>
  );
}
