import { useEffect, useState } from 'react';

export function useIsHero(): boolean {
  const [isHero, setIsHero] = useState(true);

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
