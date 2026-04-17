import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';

import '../../styles/book/PageFlip.css';
import { BookPageOuterShadow } from './BookPageSide';

export function PageFlip({
  isFlipping,
  flipDirection,
  flipDuration,
  flipFrontContent,
  flipBackContent,
  isRapidFlipping,
  isHoldChaining,
}: {
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward';
  flipDuration: number;
  flipFrontContent: ReactNode;
  flipBackContent: ReactNode;
  isRapidFlipping: boolean;
  isHoldChaining: boolean;
}) {
  const flipPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = flipPanelRef.current;
    if (!panel) return;

    if (!isFlipping) {
      panel.style.transition = 'none';
      panel.classList.remove('flipping');
      panel.classList.remove('history__book-page-flip-panel--animating');
      panel.classList.add('history__book-page-flip-panel--hidden');

      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.style.transition = '';
        }
      });
    } else {
      panel.style.transition = 'none';
      panel.classList.remove('history__book-page-flip-panel--hidden');
      panel.classList.remove('flipping');
      panel.classList.add('history__book-page-flip-panel--animating');

      panel.getBoundingClientRect();

      panel.style.transition = `transform ${flipDuration / 1000}s ease-in-out`;

      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.classList.add('flipping');
        }
      });
    }
  }, [isFlipping, flipDuration]);

  const shouldApplyRapidClass = isRapidFlipping || isHoldChaining;

  return (
    <div
      ref={flipPanelRef}
      className={`history__book-page-flip-panel history__book-page-flip-panel--${flipDirection} history__book-page-flip-panel--hidden${shouldApplyRapidClass ? ' history__book-page--rapid' : ''}`}
    >
      <div
        className={`history__book-page-flip-front ${flipDirection === 'forward' ? 'history__book-page-right' : 'history__book-page-left'}`}
      >
        {flipDirection !== 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
        <div className='history__book-page-content'>{flipFrontContent}</div>
        {flipDirection === 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
      </div>
      <div
        className={`history__book-page-flip-back ${flipDirection === 'forward' ? 'history__book-page-left' : 'history__book-page-right'}`}
      >
        {flipDirection === 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
        <div className='history__book-page-content'>{flipBackContent}</div>
        {flipDirection !== 'forward' && (
          <BookPageOuterShadow side={'left'} count={0} />
        )}
      </div>
    </div>
  );
}
