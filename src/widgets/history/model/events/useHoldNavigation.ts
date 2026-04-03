import { useEffect, useRef, useState } from 'react';

export function useHoldNavigation() {
  const holdDirectionRef = useRef<'left' | 'right' | null>(null);
  const chainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHoldChaining, setIsHoldChaining] = useState(false);

  const navigateLeftRef = useRef<() => void>(() => {});
  const navigateRightRef = useRef<() => void>(() => {});
  const navigateLeftRapidRef = useRef<() => void>(() => {});
  const navigateRightRapidRef = useRef<() => void>(() => {});
  const endContinuousFlipRef = useRef<() => void>(() => {});

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
    endFlip: () => void,
    navigateLeftRapid?: () => void,
    navigateRightRapid?: () => void,
  ) {
    navigateLeftRef.current = navigateLeft;
    navigateRightRef.current = navigateRight;
    navigateLeftRapidRef.current = navigateLeftRapid ?? navigateLeft;
    navigateRightRapidRef.current = navigateRightRapid ?? navigateRight;
    endContinuousFlipRef.current = endFlip;
  }

  // 마우스: window-level mouseup
  useEffect(() => {
    function handleMouseUp() {
      endContinuousFlipRef.current();
    }
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // 키보드
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
        endContinuousFlipRef.current();
      else if (e.key === 'ArrowRight' && holdDirectionRef.current === 'right')
        endContinuousFlipRef.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 클린업
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
