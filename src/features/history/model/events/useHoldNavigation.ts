import { useEffect, useRef, useState } from 'react';

export function useHoldNavigation() {
  const holdDirectionRef = useRef<'left' | 'right' | null>(null);
  const chainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHoldChaining, setIsHoldChaining] = useState(false);

  const navigateLeftRef = useRef<() => void>(() => {});
  const navigateRightRef = useRef<() => void>(() => {});
  const navigateLeftRapidRef = useRef<() => void>(() => {});
  const navigateRightRapidRef = useRef<() => void>(() => {});

  function beginContinuousFlip(direction: 'left' | 'right') {
    holdDirectionRef.current = direction;
    if (direction === 'left') navigateLeftRef.current();
    else navigateRightRef.current();
  }

  function clearHoldDirection(): void {
    holdDirectionRef.current = null;
  }

  function endContinuousFlip() {
    holdDirectionRef.current = null;
    setIsHoldChaining(false);
    if (chainTimerRef.current) {
      clearTimeout(chainTimerRef.current);
      chainTimerRef.current = null;
    }
  }

  function chainHoldFlip(): boolean {
    if (!holdDirectionRef.current) return false;

    setIsHoldChaining(true);
    chainTimerRef.current = setTimeout(() => {
      if (holdDirectionRef.current === 'left') navigateLeftRapidRef.current();
      else if (holdDirectionRef.current === 'right')
        navigateRightRapidRef.current();
    }, 0);

    return true;
  }

  function syncCallbacks(
    navigateLeft: () => void,
    navigateRight: () => void,
    navigateLeftRapid?: () => void,
    navigateRightRapid?: () => void,
  ) {
    navigateLeftRef.current = navigateLeft;
    navigateRightRef.current = navigateRight;
    navigateLeftRapidRef.current = navigateLeftRapid ?? navigateLeft;
    navigateRightRapidRef.current = navigateRightRapid ?? navigateRight;
  }

  useEffect(() => {
    window.addEventListener('mouseup', endContinuousFlip);
    return () => window.removeEventListener('mouseup', endContinuousFlip);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') {
        holdDirectionRef.current = 'left';
        navigateLeftRef.current();
      } else if (e.key === 'ArrowRight') {
        holdDirectionRef.current = 'right';
        navigateRightRef.current();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && holdDirectionRef.current === 'left')
        endContinuousFlip();
      else if (e.key === 'ArrowRight' && holdDirectionRef.current === 'right')
        endContinuousFlip();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (chainTimerRef.current) clearTimeout(chainTimerRef.current);
    };
  }, []);

  return {
    isHoldChaining,
    clearHoldDirection,
    beginContinuousFlip,
    endContinuousFlip,
    chainHoldFlip,
    syncCallbacks,
  };
}
