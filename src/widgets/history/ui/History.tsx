import { Fragment, useEffect, useRef, useState } from 'react';

import { CONTENT_TOTAL_PAGES } from '../model/constants';
import type { PageSide } from '../model/types';
import '../style/History.css';
import '../style/HistoryBook.css';
import { AwardPage } from './Award';
import { ContentPage } from './Content';
import { HistoryPage } from './HistoryPage';
import { ListPage } from './List';

function BookPageOuterShadow({ side }: { side: PageSide }) {
  const levels = side === 'left' ? [3, 2, 1] : [1, 2, 3];
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

function BookPage({
  side,
  children,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  clickable,
  animClass,
}: {
  side: PageSide;
  children?: React.ReactNode;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  clickable?: boolean;
  animClass?: string;
}) {
  return (
    <div
      className={`history__book-page-${side}${clickable ? ` history__book-page-${side}--clickable` : ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {side === 'left' ? (
        <>
          <BookPageOuterShadow side='left' />
          <div
            className={`history__book-page-flip${animClass ? ` ${animClass}` : ''}`}
          >
            <div className='history__book-page-content'>{children}</div>
            <div className='history__book-page-inner-shadow' />
          </div>
        </>
      ) : (
        <>
          <div
            className={`history__book-page-flip${animClass ? ` ${animClass}` : ''}`}
          >
            <div className='history__book-page-inner-shadow' />
            <div className='history__book-page-content'>{children}</div>
          </div>
          <BookPageOuterShadow side='right' />
        </>
      )}
    </div>
  );
}

const INDEX_LIST = ['List', 'Content', 'History', 'Award'];

type FlipState = { side: 'left' | 'right' } | null;

function History() {
  const [activeItem, setActiveItem] = useState('List');
  const [contentPage, setContentPage] = useState(0);
  const [flipState, setFlipState] = useState<FlipState>(null);

  const activeIndex = INDEX_LIST.indexOf(activeItem);
  const canGoLeft =
    activeIndex > 0 || (activeItem === 'Content' && contentPage > 0);
  const canGoRight =
    activeIndex < INDEX_LIST.length - 1 ||
    (activeItem === 'Content' && contentPage < CONTENT_TOTAL_PAGES - 1);

  const isAnimatingRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftClickRef = useRef<() => void>(() => {});
  const rightClickRef = useRef<() => void>(() => {});

  function stopHold() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }

  function triggerFlip(side: 'left' | 'right', nav: () => void) {
    if (isAnimatingRef.current) return;
    stopHold();
    isAnimatingRef.current = true;
    setFlipState({ side });
    setTimeout(() => {
      nav();
      setFlipState(null);
      isAnimatingRef.current = false;
    }, 250);
  }

  function handleLeftClick() {
    if (!canGoLeft) return;
    triggerFlip('left', () => {
      if (activeItem === 'Content' && contentPage > 0) {
        setContentPage((p) => p - 1);
      } else if (activeIndex > 0) {
        const prev = INDEX_LIST[activeIndex - 1];
        if (prev === 'Content') setContentPage(CONTENT_TOTAL_PAGES - 1);
        setActiveItem(prev);
      }
    });
  }

  function handleRightClick() {
    if (!canGoRight) return;
    triggerFlip('right', () => {
      if (activeItem === 'Content' && contentPage < CONTENT_TOTAL_PAGES - 1) {
        setContentPage((p) => p + 1);
      } else if (activeIndex < INDEX_LIST.length - 1) {
        const next = INDEX_LIST[activeIndex + 1];
        if (next === 'Content') setContentPage(0);
        setActiveItem(next);
      }
    });
  }

  function handleListItemClick(index: number) {
    const page = Math.floor(index / 2);
    triggerFlip('right', () => {
      setContentPage(page);
      setActiveItem('Content');
    });
  }

  function handleCategoryClick(item: string) {
    const newIndex = INDEX_LIST.indexOf(item);
    if (newIndex === activeIndex) return;
    const side: 'left' | 'right' = newIndex > activeIndex ? 'right' : 'left';
    triggerFlip(side, () => {
      if (item === 'Content') setContentPage(0);
      setActiveItem(item);
    });
  }

  function startHold(clickRef: React.MutableRefObject<() => void>) {
    clickRef.current();
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => clickRef.current(), 150);
    }, 800);
  }

  useEffect(() => {
    leftClickRef.current = handleLeftClick;
    rightClickRef.current = handleRightClick;
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') leftClickRef.current();
      else if (e.key === 'ArrowRight') rightClickRef.current();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const isAnimating = flipState !== null;
  const leftAnimClass =
    flipState?.side === 'left' ? 'page-flip-out' : undefined;
  const rightAnimClass =
    flipState?.side === 'right' ? 'page-flip-out' : undefined;

  return (
    <>
      <section className='history'>
        <h2 className='history__title'>History</h2>
        <div className='history__category' role='tablist'>
          {INDEX_LIST.map((item, index) => (
            <Fragment key={item}>
              <button
                role='tab'
                aria-selected={activeItem === item}
                className={activeItem === item ? 'active' : ''}
                onClick={() => handleCategoryClick(item)}
              >
                {item}
              </button>
              {index < INDEX_LIST.length - 1 && (
                <span aria-hidden='true'>|</span>
              )}
            </Fragment>
          ))}
        </div>
        <div className='history__book'>
          <div className='history__book-page'>
            <BookPage
              side='left'
              clickable={canGoLeft && !isAnimating}
              onMouseDown={
                canGoLeft && !isAnimating
                  ? () => startHold(leftClickRef)
                  : undefined
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              animClass={leftAnimClass}
            >
              {activeItem === 'List' && (
                <ListPage side='left' onItemClick={handleListItemClick} />
              )}
              {activeItem === 'Content' && (
                <ContentPage side='left' pageIndex={contentPage} />
              )}
              {activeItem === 'History' && <HistoryPage side='left' />}
              {activeItem === 'Award' && <AwardPage side='left' />}
            </BookPage>
            <BookPage
              side='right'
              clickable={canGoRight && !isAnimating}
              onMouseDown={
                canGoRight && !isAnimating
                  ? () => startHold(rightClickRef)
                  : undefined
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              animClass={rightAnimClass}
            >
              {activeItem === 'List' && (
                <ListPage side='right' onItemClick={handleListItemClick} />
              )}
              {activeItem === 'Content' && (
                <ContentPage side='right' pageIndex={contentPage} />
              )}
              {activeItem === 'History' && <HistoryPage side='right' />}
              {activeItem === 'Award' && <AwardPage side='right' />}
            </BookPage>
          </div>
          <div className='history__book-cover'>
            <div className='history__book-cover-left'></div>
            <div className='history__book-cover-center'>
              <div className='history__book-cover-center-line'>
                <div className='history__book-cover-center-line-top'></div>
                <div className='history__book-cover-center-line-bottom'></div>
              </div>
              <div className='history__book-cover-center-spine'>
                <div className='history__book-cover-center-spine-left'></div>
                <div className='history__book-cover-center-spine-center'></div>
                <div className='history__book-cover-center-spine-right'></div>
              </div>
            </div>
            <div className='history__book-cover-right'></div>
          </div>
        </div>
        <div className='history__last'>
          <p>공간을 문화로 창조하는 기업</p>
        </div>
      </section>
    </>
  );
}

export default History;
