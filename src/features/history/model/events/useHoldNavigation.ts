import { useEffect, useRef } from 'react';

import { FLIP_DURATION, RAPID_FLIP_DURATION } from '../constants';
import { useHistoryStore } from '../useHistoryStore';

export function useHoldNavigation() {
  const holdDirectionRef = useRef<'left' | 'right' | null>(null);
  const chainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHoldChaining = useHistoryStore((s) => s.isHoldChaining);

  const navigateLeftRef = useRef<() => void>(() => {});
  const navigateRightRef = useRef<() => void>(() => {});
  const navigateLeftRapidRef = useRef<() => void>(() => {});
  const navigateRightRapidRef = useRef<() => void>(() => {});
  const leftBoundaryCallbackRef = useRef<((duration?: number) => void) | null>(
    null,
  );
  const rightBoundaryCallbackRef = useRef<((duration?: number) => void) | null>(
    null,
  );
  const isCoverFrontRef = useRef(false);
  const isCoverBackRef = useRef(false);
  const openFrontCoverCallbackRef = useRef<((duration: number) => void) | null>(
    null,
  );
  const openBackCoverCallbackRef = useRef<((duration: number) => void) | null>(
    null,
  );

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
    useHistoryStore.setState({ isHoldChaining: false });
    if (chainTimerRef.current) {
      clearTimeout(chainTimerRef.current);
      chainTimerRef.current = null;
    }
  }

  function chainHoldFlip(): boolean {
    if (!holdDirectionRef.current) return false;

    useHistoryStore.setState({ isHoldChaining: true });
    chainTimerRef.current = setTimeout(() => {
      if (holdDirectionRef.current === 'left') {
        navigateLeftRapidRef.current();
        if (holdDirectionRef.current === null) {
          useHistoryStore.setState({ isHoldChaining: false });
          leftBoundaryCallbackRef.current?.(RAPID_FLIP_DURATION);
        }
      } else if (holdDirectionRef.current === 'right') {
        navigateRightRapidRef.current();
        if (holdDirectionRef.current === null) {
          useHistoryStore.setState({ isHoldChaining: false });
          rightBoundaryCallbackRef.current?.(RAPID_FLIP_DURATION);
        }
      }
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

  function syncBoundaryCallbacks(
    onLeftBoundary: (duration?: number) => void,
    onRightBoundary: (duration?: number) => void,
  ) {
    leftBoundaryCallbackRef.current = onLeftBoundary;
    rightBoundaryCallbackRef.current = onRightBoundary;
  }

  function syncCoverCallbacks(
    isCoverFront: boolean,
    isCoverBack: boolean,
    openFront: (duration: number) => void,
    openBack: (duration: number) => void,
  ) {
    isCoverFrontRef.current = isCoverFront;
    isCoverBackRef.current = isCoverBack;
    openFrontCoverCallbackRef.current = openFront;
    openBackCoverCallbackRef.current = openBack;
  }

  useEffect(() => {
    window.addEventListener('mouseup', endContinuousFlip);
    return () => window.removeEventListener('mouseup', endContinuousFlip);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft') {
        if (isCoverBackRef.current) {
          holdDirectionRef.current = 'left';
          openBackCoverCallbackRef.current?.(FLIP_DURATION);
          return;
        }
        holdDirectionRef.current = 'left';
        navigateLeftRef.current();
        if (holdDirectionRef.current === null) {
          leftBoundaryCallbackRef.current?.(FLIP_DURATION);
        }
      } else if (e.key === 'ArrowRight') {
        if (isCoverFrontRef.current) {
          holdDirectionRef.current = 'right';
          openFrontCoverCallbackRef.current?.(FLIP_DURATION);
          return;
        }
        holdDirectionRef.current = 'right';
        navigateRightRef.current();
        if (holdDirectionRef.current === null) {
          rightBoundaryCallbackRef.current?.(FLIP_DURATION);
        }
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && holdDirectionRef.current === 'left')
        endContinuousFlip();
      else if (e.key === 'ArrowRight' && holdDirectionRef.current === 'right')
        endContinuousFlip();
      else if (e.key === ' ' || e.key === 'Enter') endContinuousFlip();
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
    syncBoundaryCallbacks,
    syncCoverCallbacks,
  };
}
