import { type RefObject, useEffect } from 'react';

import { preloadImages } from './preloadImages';

export function usePreloadOnVisible(
  ref: RefObject<HTMLElement | null>,
  urls: string[],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || urls.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadImages(urls);
        observer.disconnect();
      },
      { rootMargin: '400px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
