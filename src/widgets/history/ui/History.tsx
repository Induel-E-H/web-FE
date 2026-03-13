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
}: {
  side: PageSide;
  children?: React.ReactNode;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  clickable?: boolean;
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
          <div className='history__book-page-content'>{children}</div>
          <div className='history__book-page-inner-shadow' />
        </>
      ) : (
        <>
          <div className='history__book-page-inner-shadow' />
          <div className='history__book-page-content'>{children}</div>
          <BookPageOuterShadow side='right' />
        </>
      )}
    </div>
  );
}

const INDEX_LIST = ['List', 'Content', 'History', 'Award'];

function History() {
  const [activeItem, setActiveItem] = useState('List');
  const [contentPage, setContentPage] = useState(0);

  const activeIndex = INDEX_LIST.indexOf(activeItem);

  const leftClickRef = useRef<() => void>(() => {});
  const rightClickRef = useRef<() => void>(() => {});

  useEffect(() => {
    leftClickRef.current = () => {
      if (activeItem === 'Content' && contentPage > 0) {
        setContentPage((p) => p - 1);
      } else if (activeIndex > 0) {
        const prev = INDEX_LIST[activeIndex - 1];
        if (prev === 'Content') setContentPage(CONTENT_TOTAL_PAGES - 1);
        setActiveItem(prev);
      }
    };

    rightClickRef.current = () => {
      if (activeItem === 'Content' && contentPage < CONTENT_TOTAL_PAGES - 1) {
        setContentPage((p) => p + 1);
      } else if (activeIndex < INDEX_LIST.length - 1) {
        const next = INDEX_LIST[activeIndex + 1];
        if (next === 'Content') setContentPage(0);
        setActiveItem(next);
      }
    };
  }, [activeItem, contentPage, activeIndex]);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startHold(fnRef: React.MutableRefObject<() => void>) {
    fnRef.current();
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => fnRef.current(), 150);
    }, 500);
  }

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

  useEffect(() => stopHold, []);

  const canGoLeft =
    activeIndex > 0 || (activeItem === 'Content' && contentPage > 0);
  const canGoRight =
    activeIndex < INDEX_LIST.length - 1 ||
    (activeItem === 'Content' && contentPage < CONTENT_TOTAL_PAGES - 1);

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
                onClick={() => setActiveItem(item)}
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
              clickable={canGoLeft}
              onMouseDown={
                canGoLeft ? () => startHold(leftClickRef) : undefined
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              {activeItem === 'List' && <ListPage side='left' />}
              {activeItem === 'Content' && (
                <ContentPage side='left' pageIndex={contentPage} />
              )}
              {activeItem === 'History' && <HistoryPage side='left' />}
              {activeItem === 'Award' && <AwardPage side='left' />}
            </BookPage>
            <BookPage
              side='right'
              clickable={canGoRight}
              onMouseDown={
                canGoRight ? () => startHold(rightClickRef) : undefined
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              {activeItem === 'List' && <ListPage side='right' />}
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
