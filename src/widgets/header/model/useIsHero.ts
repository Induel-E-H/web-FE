import { useEffect, useState } from 'react';

const DEV_WIDGET: string | undefined = import.meta.env.VITE_DEV_WIDGET;

export function useIsHero(): boolean {
  const [isHero, setIsHero] = useState(
    DEV_WIDGET === undefined || DEV_WIDGET === 'hero',
  );

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHero(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return isHero;
}
