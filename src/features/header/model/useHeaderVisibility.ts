import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 5;

export function useHeaderVisibility() {
  const [hidden, setHidden] = useState(false);
  const prevScrollY = useRef(0);
  const navScrollActiveRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navScrollActiveRef.current) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setHidden(false);
        prevScrollY.current = 0;
        return;
      }

      const diff = currentScrollY - prevScrollY.current;
      if (Math.abs(diff) < THRESHOLD) return;

      setHidden(diff > 0);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onNavScrollStart = () => {
    navScrollActiveRef.current = true;
    setHidden(true);
  };

  const onNavScrollEnd = () => {
    navScrollActiveRef.current = false;
  };

  return { hidden, onNavScrollStart, onNavScrollEnd };
}
