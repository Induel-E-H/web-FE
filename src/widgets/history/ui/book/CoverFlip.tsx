import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';

import '../../styles/book/CoverFlip.css';

export function BookCoverFlip({
  isFlipping,
  flipDirection,
  flipDuration,
  frontContent,
  backContent,
}: {
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward';
  flipDuration: number;
  frontContent: ReactNode;
  backContent: ReactNode;
}) {
  const flipPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = flipPanelRef.current;
    if (!panel) return;

    if (!isFlipping) {
      panel.style.transition = 'none';
      panel.classList.remove('flipping');
      panel.classList.remove('history__book-cover-flip-panel--animating');
      panel.classList.add('history__book-cover-flip-panel--hidden');

      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.style.transition = '';
        }
      });
    } else {
      panel.style.transition = 'none';
      panel.classList.remove('history__book-cover-flip-panel--hidden');
      panel.classList.remove('flipping');
      panel.classList.add('history__book-cover-flip-panel--animating');

      panel.getBoundingClientRect();

      panel.style.transition = `transform ${flipDuration / 1000}s ease-in-out`;

      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.classList.add('flipping');
        }
      });
    }
  }, [isFlipping, flipDuration]);

  return (
    <div className='history__book-cover-flip'>
      <div
        ref={flipPanelRef}
        className={`history__book-cover-flip-panel history__book-cover-flip-panel--${flipDirection} history__book-cover-flip-panel--hidden`}
      >
        <div className='history__book-cover-flip-front'>{frontContent}</div>
        <div className='history__book-cover-flip-back'>{backContent}</div>
      </div>
    </div>
  );
}
