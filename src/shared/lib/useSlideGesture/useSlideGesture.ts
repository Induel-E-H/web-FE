import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const TOUCH_THRESHOLD = 50;
const WHEEL_THRESHOLD = 30;
const COOLDOWN_MS = 400;

export function useSlideGesture(
  setPage: React.Dispatch<React.SetStateAction<number>>,
  totalPages: number,
) {
  const ref = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isCoolingDown = useRef(false);
  const totalPagesRef = useRef(totalPages);

  useLayoutEffect(() => {
    totalPagesRef.current = totalPages;
  });

  function slide(direction: 1 | -1): void {
    if (isCoolingDown.current) return;
    isCoolingDown.current = true;
    setPage((p) =>
      Math.min(Math.max(p + direction, 0), totalPagesRef.current - 1),
    );
    setTimeout(() => {
      isCoolingDown.current = false;
    }, COOLDOWN_MS);
  }

  const onTouchStart = useCallback((e: React.TouchEvent): void => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent): void => {
      if (touchStartX.current === null) return;
      const startX = touchStartX.current;
      touchStartX.current = null;
      const delta = startX - e.changedTouches[0].clientX;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      slide(delta > 0 ? 1 : -1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleWheel(e: WheelEvent): void {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (Math.abs(e.deltaX) < WHEEL_THRESHOLD) return;
      slide(e.deltaX > 0 ? 1 : -1);
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, onTouchStart, onTouchEnd };
}
