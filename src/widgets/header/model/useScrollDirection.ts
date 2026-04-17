import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 5;

export function useScrollDirection(): 'up' | 'down' {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setDirection('up');
        prevScrollY.current = 0;
        return;
      }

      const diff = currentScrollY - prevScrollY.current;

      if (Math.abs(diff) < THRESHOLD) return;

      setDirection(diff > 0 ? 'down' : 'up');
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}
