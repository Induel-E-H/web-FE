import { useCallback, useRef, useState } from 'react';

const HOLD_INTERVAL = 400;

export function useSliderNavigation(totalSlides: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const continuousSlideTimerRef = useRef<ReturnType<typeof setInterval>>(null);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  function startContinuousSlide(fn: () => void) {
    fn();
    continuousSlideTimerRef.current = setInterval(fn, HOLD_INTERVAL);
  }

  function stopContinuousSlide() {
    if (continuousSlideTimerRef.current) {
      clearInterval(continuousSlideTimerRef.current);
      continuousSlideTimerRef.current = null;
    }
  }

  return {
    currentIndex,
    goToPrevSlide,
    goToNextSlide,
    startContinuousSlide,
    stopContinuousSlide,
  };
}
