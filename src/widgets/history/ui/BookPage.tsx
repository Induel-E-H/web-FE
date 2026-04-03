import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';

import { PAGE_SIDE } from '../model/constants';
import type { PageSide } from '../model/types';
import '../styles/HistoryBook.css';

function BookPageOuterShadow({ side }: { side: PageSide }) {
  const levels = side === PAGE_SIDE.LEFT ? [3, 2, 1] : [1, 2, 3];
  return (
    <div className='history__book-page-outer-shadow'>
      {levels.map((level) => (
        <div
          key={level}
          className={`history__book-page-outer-shadow-${level}`}
        />
      ))}
    </div>
  );
}

export function BookPage({
  staticLeftContent,
  staticRightContent,
  flipFrontContent,
  flipBackContent,
  isFlipping,
  flipDirection,
  canGoLeft,
  canGoRight,
  onLeftMouseDown,
  onRightMouseDown,
}: {
  staticLeftContent: ReactNode;
  staticRightContent: ReactNode;
  flipFrontContent: ReactNode;
  flipBackContent: ReactNode;
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward' | null;
  canGoLeft: boolean;
  canGoRight: boolean;
  onLeftMouseDown?: () => void;
  onRightMouseDown?: () => void;
}) {
  const flipPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = flipPanelRef.current;
    if (!panel) return;

    if (!isFlipping) {
      panel.style.transition = 'none';
      panel.classList.remove('flipping');
      panel.classList.remove('history__book-flip-panel--animating');
      panel.classList.add('history__book-flip-panel--hidden');

      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.style.transition = '';
        }
      });
    } else {
      panel.style.transition = 'none';
      panel.classList.remove('history__book-flip-panel--hidden');
      panel.classList.remove('flipping');
      panel.classList.add('history__book-flip-panel--animating');

      panel.getBoundingClientRect();

      panel.style.transition = '';

      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.classList.add('flipping');
        }
      });
    }
  }, [isFlipping]);

  const panelDirection = flipDirection ?? 'forward';

  return (
    <>
      {/* Static Left (z:1) */}
      <div
        className={`history__book-static-left history__book-page-left${canGoLeft ? ' history__book-page-left--clickable' : ''}`}
        onMouseDown={canGoLeft ? onLeftMouseDown : undefined}
      >
        <BookPageOuterShadow side={PAGE_SIDE.LEFT} />
        <div className='history__book-page-content'>{staticLeftContent}</div>
        <div className='history__book-page-inner-shadow' />
      </div>

      {/* Static Right (z:1) */}
      <div
        className={`history__book-static-right history__book-page-right${canGoRight ? ' history__book-page-right--clickable' : ''}`}
        onMouseDown={canGoRight ? onRightMouseDown : undefined}
      >
        <div className='history__book-page-inner-shadow' />
        <div className='history__book-page-content'>{staticRightContent}</div>
        <BookPageOuterShadow side={PAGE_SIDE.RIGHT} />
      </div>

      {/* Flip Panel (z:10) */}
      <div
        ref={flipPanelRef}
        className={`history__book-flip-panel history__book-flip-panel--${panelDirection}`}
      >
        <div
          className={`history__book-flip-front ${panelDirection === 'forward' ? 'history__book-page-right' : 'history__book-page-left'}`}
        >
          {panelDirection === 'forward' ? (
            <>
              <div className='history__book-page-inner-shadow' />
              <div className='history__book-page-content'>
                {flipFrontContent}
              </div>
            </>
          ) : (
            <>
              <div className='history__book-page-content'>
                {flipFrontContent}
              </div>
              <div className='history__book-page-inner-shadow' />
            </>
          )}
        </div>
        <div
          className={`history__book-flip-back ${panelDirection === 'forward' ? 'history__book-page-left' : 'history__book-page-right'}`}
        >
          {panelDirection === 'forward' ? (
            <>
              <div className='history__book-page-content'>
                {flipBackContent}
              </div>
              <div className='history__book-page-inner-shadow' />
            </>
          ) : (
            <>
              <div className='history__book-page-inner-shadow' />
              <div className='history__book-page-content'>
                {flipBackContent}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
