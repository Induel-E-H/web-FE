import type { ReactNode, TransitionEvent } from 'react';
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
  onTransitionEnd,
  onLeftMouseDown,
  onRightMouseDown,
  onMouseUp,
  onMouseLeave,
}: {
  staticLeftContent: ReactNode;
  staticRightContent: ReactNode;
  flipFrontContent: ReactNode;
  flipBackContent: ReactNode;
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward' | null;
  canGoLeft: boolean;
  canGoRight: boolean;
  onTransitionEnd: () => void;
  onLeftMouseDown?: () => void;
  onRightMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
}) {
  const flipPanelRef = useRef<HTMLDivElement>(null);
  const noTransitionRef = useRef(false);

  useLayoutEffect(() => {
    const panel = flipPanelRef.current;
    if (!panel) return;

    if (!isFlipping) {
      // 플립 완료: 패널을 즉시 리셋하고 숨김 (콘텐츠 교체 시 깜빡임 방지)
      panel.classList.add('history__book-flip-panel--no-transition');
      panel.classList.remove('flipping');
      panel.classList.remove('history__book-flip-panel--animating');
      panel.classList.add('history__book-flip-panel--hidden');
      noTransitionRef.current = true;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (noTransitionRef.current && flipPanelRef.current) {
            flipPanelRef.current.classList.remove(
              'history__book-flip-panel--no-transition',
            );
            noTransitionRef.current = false;
          }
        });
      });
    } else {
      // 새 플립 시작: 패널을 보이게 하고 애니메이션 시작
      panel.classList.remove('history__book-flip-panel--hidden');
      panel.classList.add('history__book-flip-panel--animating');
      requestAnimationFrame(() => {
        if (flipPanelRef.current) {
          flipPanelRef.current.classList.add('flipping');
        }
      });
    }
  }, [isFlipping]);

  function handleTransitionEnd(e: TransitionEvent) {
    if (e.propertyName === 'transform') {
      onTransitionEnd();
    }
  }

  const panelDirection = flipDirection ?? 'forward';

  return (
    <>
      {/* Static Left (z:1) */}
      <div
        className={`history__book-static-left history__book-page-left${canGoLeft ? ' history__book-page-left--clickable' : ''}`}
        onMouseDown={canGoLeft ? onLeftMouseDown : undefined}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <BookPageOuterShadow side={PAGE_SIDE.LEFT} />
        <div className='history__book-page-content'>{staticLeftContent}</div>
        <div className='history__book-page-inner-shadow' />
      </div>

      {/* Static Right (z:1) */}
      <div
        className={`history__book-static-right history__book-page-right${canGoRight ? ' history__book-page-right--clickable' : ''}`}
        onMouseDown={canGoRight ? onRightMouseDown : undefined}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className='history__book-page-inner-shadow' />
        <div className='history__book-page-content'>{staticRightContent}</div>
        <BookPageOuterShadow side={PAGE_SIDE.RIGHT} />
      </div>

      {/* Flip Panel (z:10) */}
      <div
        ref={flipPanelRef}
        className={`history__book-flip-panel history__book-flip-panel--${panelDirection}`}
        onTransitionEnd={handleTransitionEnd}
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
