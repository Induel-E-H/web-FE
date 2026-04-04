import { useEffect, useState } from 'react';

export function useIsHero(): boolean {
  const [isHero, setIsHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero');
      if (hero) {
        setIsHero(hero.getBoundingClientRect().bottom > 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isHero;
}
