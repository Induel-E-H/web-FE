import { useEffect, useRef } from 'react';

const VISIBLE_CLASS = 'is-visible';
const DEFAULT_THRESHOLD = 0.15;

export function useIntersectionAnimation<T extends HTMLElement>(
  threshold = DEFAULT_THRESHOLD,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(VISIBLE_CLASS);
        } else if (entry.boundingClientRect.top > 0) {
          el.classList.remove(VISIBLE_CLASS);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
