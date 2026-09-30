import type { MouseEvent, PointerEvent, ReactNode, RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import { FLIP_DURATION } from '@features/history';
import type { ChainDirection, Leaf, PageLeaf } from '@features/history';
import HTMLFlipBook, {
  type BookSnapshot,
  type FlipBookHandle,
} from '@gullabs/react-flipbook';

import '../../styles/book/Book.css';
import { BackCoverInner } from './BackCover';
import { ColophonPage } from './ColophonPage';
import { FrontCoverInner } from './FrontCover';
import { TitlePage } from './TitlePage';

const HOLD_DELAY = 400;
const HOLD_MOVE_TOLERANCE = 8;

interface BookProps {
  bookRef: RefObject<FlipBookHandle | null>;
  leaves: readonly Leaf[];
  landscape: boolean;
  renderPage: (leaf: PageLeaf) => ReactNode;
  onPageChange: (snapshot: BookSnapshot) => void;
  onSettled: () => void;
  onHoldStart: (direction: ChainDirection) => void;
  onHoldEnd: () => void;
}

type Hold = { x: number; y: number; timer: number; active: boolean };

const LEAF_LABEL: Record<Exclude<Leaf['kind'], 'page'>, string> = {
  'cover-front': '앞표지',
  'inside-front': '앞표지 안쪽',
  title: '속지',
  colophon: '판권면',
  blank: '',
  'inside-back': '뒤표지 안쪽',
  'cover-back': '뒤표지',
};

function leafKey(leaf: Leaf, index: number) {
  return leaf.kind === 'page'
    ? `${leaf.item}-${leaf.pageIndex}-${leaf.side}`
    : `${leaf.kind}-${index}`;
}

function describeLeaf(leaf: Leaf | undefined) {
  if (!leaf) return '';
  if (leaf.kind === 'page') return `${leaf.item} ${leaf.pageIndex + 1}페이지`;
  return LEAF_LABEL[leaf.kind];
}

function isHardLeaf(leaf: Leaf) {
  return leaf.kind === 'inside-front' || leaf.kind === 'inside-back';
}

export function Book({
  bookRef,
  leaves,
  landscape,
  renderPage,
  onPageChange,
  onSettled,
  onHoldStart,
  onHoldEnd,
}: BookProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef<Hold | null>(null);
  const suppressClickRef = useRef(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // lazyRadius 로 멀리 있던 장은 자리표시자로 먼저 로드되어, 엔진이 표지 안쪽의
  // data-density='hard' 를 놓친다. 실제 장으로 바뀐 뒤 쉬고 있을 때 한 번 다시 읽힌다.
  function syncHardLeaves() {
    const engine = bookRef.current?.pageFlip();
    if (!engine?.isReady() || engine.isAnimating()) return;
    const elements = Array.from({ length: engine.getPageCount() }, (_, i) =>
      engine.getPageElement(i),
    ).filter((el): el is HTMLElement => el !== null);
    const stale = elements.some(
      (el) => el.dataset.density === 'hard' && !el.classList.contains('--hard'),
    );
    if (stale) engine.updateFromHtml(elements);
  }

  useEffect(syncHardLeaves);

  const lastLeaf = leaves.length - 1;
  const closed = page === 0 ? 'front' : page >= lastLeaf ? 'back' : null;
  // 가로(PC)는 펼침면 전체, 태블릿/모바일은 펼침면의 왼쪽 장만 화면에 보이고 오른쪽 장은 화면 밖에 둔다.
  const pageWidth = landscape ? Math.floor(size.width / 2) : size.width;

  function sync(snapshot: BookSnapshot) {
    pageRef.current = snapshot.page;
    setPage(snapshot.page);
  }

  function handlePageChange(snapshot: BookSnapshot) {
    sync(snapshot);
    onPageChange(snapshot);
  }

  // 넘기는 중 HTMLFlipBook 이 재렌더되면 애니메이션이 끊기므로 상태 표시는 DOM 클래스로만 한다.
  function setBodyFlag(
    flag: 'turning' | 'closing-front' | 'closing-back' | 'hover' | 'lifted',
    on: boolean,
  ) {
    bodyRef.current?.classList.toggle(`history__book-body--${flag}`, on);
  }

  // hover 판정은 translate 영향이 없는 레이아웃 박스 기준 (책이 떠오르며 hover 가 풀렸다 잡히는 깜빡임 방지).
  // 닫힌 책은 가운데로 옮겨져 있으므로 본체 폭의 가운데 절반이 표지 영역이다.
  function updateHover(e: PointerEvent<HTMLDivElement>) {
    const body = bodyRef.current;
    if (!body || !landscape || e.pointerType !== 'mouse') return;
    const stage = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - stage.left - body.offsetLeft;
    const y = e.clientY - stage.top - body.offsetTop;
    const w = body.offsetWidth;
    setBodyFlag(
      'hover',
      x >= w / 4 && x <= (w * 3) / 4 && y >= 0 && y <= body.offsetHeight,
    );
  }

  function clearHold() {
    const hold = holdRef.current;
    holdRef.current = null;
    if (hold) window.clearTimeout(hold.timer);
    return hold;
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    suppressClickRef.current = false;
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const direction: ChainDirection =
      e.clientX < rect.left + rect.width / 2 ? 'prev' : 'next';
    const hold: Hold = { x: e.clientX, y: e.clientY, timer: 0, active: false };
    hold.timer = window.setTimeout(() => {
      hold.active = true;
      bookRef.current?.cancelTurn();
      onHoldStart(direction);
    }, HOLD_DELAY);
    clearHold();
    holdRef.current = hold;
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    updateHover(e);
    const hold = holdRef.current;
    if (!hold || hold.active) return;
    const moved = Math.hypot(e.clientX - hold.x, e.clientY - hold.y);
    if (moved > HOLD_MOVE_TOLERANCE) clearHold();
  }

  // 꾹 누르기가 끝난 pointerup/click 은 엔진과 페이지 콘텐츠에 전달하지 않는다.
  function handlePointerEnd(e: PointerEvent<HTMLDivElement>) {
    const hold = clearHold();
    if (!hold?.active) return;
    e.stopPropagation();
    suppressClickRef.current = true;
    onHoldEnd();
  }

  function handleClickCapture(e: MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.stopPropagation();
    e.preventDefault();
  }

  const bodyClassName = [
    'history__book-body',
    landscape ? 'history__book-body--landscape' : 'history__book-body--half',
    closed ? `history__book-body--closed-${closed}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        ref={stageRef}
        className='history__book-stage'
        onPointerDownCapture={handlePointerDown}
        onPointerMoveCapture={handlePointerMove}
        onPointerUpCapture={handlePointerEnd}
        onPointerCancelCapture={handlePointerEnd}
        onClickCapture={handleClickCapture}
        onPointerLeave={() => setBodyFlag('hover', false)}
      >
        {pageWidth > 0 && size.height > 0 && (
          <div
            ref={bodyRef}
            className={bodyClassName}
            style={{
              width: pageWidth * 2,
              height: size.height,
            }}
          >
            <HTMLFlipBook
              key={landscape ? 'landscape' : 'half'}
              ref={bookRef}
              className='history__flipbook'
              width={pageWidth}
              height={size.height}
              hardCovers
              usePortrait={false}
              respectReducedMotion={false}
              flippingTime={FLIP_DURATION}
              maxShadowOpacity={0.5}
              lazyRadius={2}
              controls={landscape ? 'auto' : 'none'}
              controlLabels={{ previous: '이전 페이지', next: '다음 페이지' }}
              aria-label='회사 연혁'
              roleDescription='책'
              liveRegionText={(_, __, info) =>
                info.pages
                  .map((i) => describeLeaf(leaves[i]))
                  .filter(Boolean)
                  .join(', ')
              }
              onLoaded={sync}
              onPagesChanged={sync}
              onPageChange={handlePageChange}
              onChangeState={({ state }) => {
                const moving = state === 'flipping' || state === 'user_fold';
                // 떠 있는 닫힌 책을 열면, 표지가 다 넘어갈 때까지 떠 있다가 내려온다.
                const head = pageRef.current;
                const isClosed = head === 0 || head === lastLeaf;
                if (
                  moving &&
                  isClosed &&
                  bodyRef.current?.classList.contains(
                    'history__book-body--hover',
                  )
                ) {
                  setBodyFlag('lifted', true);
                }
                setBodyFlag('turning', moving);
                if (state === 'read') {
                  setBodyFlag('lifted', false);
                  setBodyFlag('closing-front', false);
                  setBodyFlag('closing-back', false);
                  syncHardLeaves();
                  onSettled();
                }
              }}
              // 표지로 닫히는 동안에는 넘어가는 쪽 커버 판만 미리 숨긴다.
              onTurnProgress={({ direction }) => {
                const head = pageRef.current;
                setBodyFlag(
                  'closing-front',
                  direction === 'prev' && head === 1,
                );
                setBodyFlag(
                  'closing-back',
                  direction === 'next' && head === lastLeaf - 2,
                );
              }}
            >
              {leaves.map((leaf, i) => (
                <div
                  key={leafKey(leaf, i)}
                  data-density={isHardLeaf(leaf) ? 'hard' : undefined}
                >
                  <div className={`history__leaf history__leaf--${leaf.kind}`}>
                    {leaf.kind === 'cover-front' && <FrontCoverInner />}
                    {leaf.kind === 'cover-back' && <BackCoverInner />}
                    {leaf.kind === 'title' && <TitlePage />}
                    {leaf.kind === 'colophon' && <ColophonPage />}
                    {leaf.kind === 'page' && renderPage(leaf)}
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}
      </div>
      {!landscape && (
        <div className='history__book-controls'>
          <button
            type='button'
            aria-label='이전 페이지'
            disabled={page === 0}
            onClick={() => bookRef.current?.flipPrev()}
          >
            <MdChevronLeft aria-hidden='true' />
          </button>
          <button
            type='button'
            aria-label='다음 페이지'
            disabled={page >= lastLeaf}
            onClick={() => bookRef.current?.flipNext()}
          >
            <MdChevronRight aria-hidden='true' />
          </button>
        </div>
      )}
    </>
  );
}
