import type { CSSProperties, PointerEvent, ReactNode, RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineSwipeLeft,
} from 'react-icons/md';

import {
  describeLeaf,
  FLIP_DURATION,
  getAdjacentHead,
  getClosingSide,
  getLeafKey,
  getPaperStack,
  isHardLeaf,
  shouldRenderLeaf,
  useBookGestures,
} from '@features/history';
import type { ChainDirection, Leaf, PageLeaf } from '@features/history';
import HTMLFlipBook, {
  type BookSnapshot,
  type FlipbookEventMap,
  type FlipBookHandle,
} from '@gullabs/react-flipbook';

import '../../styles/book/Book.css';
import { BackCoverInner } from './BackCover';
import { ColophonPage } from './ColophonPage';
import { FrontCoverInner } from './FrontCover';
import { TitlePage } from './TitlePage';
import { UsageGuide } from './UsageGuide';

// 반쪽 보기(태블릿/모바일)는 다음 장이 화면 밖 오른쪽에 있어 엔진이 손가락을 왼쪽 장을
// 잡는 것으로 해석해 엉뚱한 방향으로 접는다. 엔진 포인터 넘김을 끄고 스와이프를 직접 판정한다.
const ENGINE_POINTERS_SPREAD = ['mouse', 'touch', 'pen'] as const;
const ENGINE_POINTERS_HALF = [] as const;

interface BookProps {
  bookRef: RefObject<FlipBookHandle | null>;
  leaves: readonly Leaf[];
  landscape: boolean;
  renderPage: (leaf: PageLeaf) => ReactNode;
  /** 여러 장 이동의 목적지 장. 도착하기 전에 그 근처 내용을 미리 그려 둔다. */
  targetLeaf: number | null;
  onPageChange: (snapshot: BookSnapshot) => void;
  onSettled: () => void;
  onHoldStart: (direction: ChainDirection) => void;
  onHoldEnd: () => void;
}

export function Book({
  bookRef,
  leaves,
  landscape,
  renderPage,
  targetLeaf,
  onPageChange,
  onSettled,
  onHoldStart,
  onHoldEnd,
}: BookProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [page, setPage] = useState(0);
  const pageRef = useRef(0);
  const gestures = useBookGestures({
    bookRef,
    swipe: !landscape,
    onHoldStart,
    onHoldEnd,
  });

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

  const lastLeaf = leaves.length - 1;
  const closed = page === 0 ? 'front' : page >= lastLeaf ? 'back' : null;
  // 펼침면 시작 장은 0, 1, 3, ..., lastLeaf 이므로 ceil(page / 2) 가 펼침면 번호다. 표지는 번호에서 뺀다.
  const spreadCount = leaves.length / 2 - 1;
  // 넘김이 끝날 때만 page 가 바뀌므로, 두께는 다 넘어간 뒤 부드럽게 바뀐다.
  const stack = getPaperStack(leaves, page);
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

  // 넘김이 시작되면 도착할 펼침면의 두께로 바로 바꿔, 넘어가는 페이지와 함께 두께가 움직이게 한다.
  // (넘기는 중 재렌더를 피하려고 DOM 에 직접 쓴다. 넘김이 끝나면 React 가 같은 값을 다시 쓴다.)
  function applyStack(head: number) {
    const body = bodyRef.current;
    if (!body) return;
    const { left, right } = getPaperStack(leaves, head);
    body.style.setProperty('--stack-left', String(left));
    body.style.setProperty('--stack-right', String(right));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    updateHover(e);
    gestures.onPointerMove(e);
  }

  function handleChangeState({ state }: FlipbookEventMap['changeState']) {
    const moving = state === 'flipping' || state === 'user_fold';
    // 떠 있는 닫힌 책을 열면, 표지가 다 넘어갈 때까지 떠 있다가 내려온다.
    const head = pageRef.current;
    const isClosed = head === 0 || head === lastLeaf;
    const hovered = bodyRef.current?.classList.contains(
      'history__book-body--hover',
    );
    if (moving && isClosed && hovered) setBodyFlag('lifted', true);
    setBodyFlag('turning', moving);
    if (state !== 'read') return;
    // 드래그를 취소해 제자리로 돌아온 경우까지 현재 펼침면 두께로 맞춘다.
    applyStack(pageRef.current);
    setBodyFlag('lifted', false);
    setBodyFlag('closing-front', false);
    setBodyFlag('closing-back', false);
    onSettled();
  }

  // 넘김이 시작되면 도착할 펼침면 두께로 바꾸고, 표지로 닫히는 넘김이면 넘어가는 쪽 커버 판을 숨긴다.
  function handleTurnProgress({ direction }: FlipbookEventMap['turnProgress']) {
    const head = pageRef.current;
    applyStack(getAdjacentHead(head, direction, lastLeaf));
    const closing = getClosingSide(head, direction, lastLeaf);
    setBodyFlag('closing-front', closing === 'front');
    setBodyFlag('closing-back', closing === 'back');
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
        onPointerDownCapture={gestures.onPointerDown}
        onPointerMoveCapture={handlePointerMove}
        onPointerUpCapture={gestures.onPointerEnd}
        onPointerCancelCapture={gestures.onPointerEnd}
        onClickCapture={gestures.onClickCapture}
        onPointerLeave={() => setBodyFlag('hover', false)}
      >
        {pageWidth > 0 && size.height > 0 && (
          <div
            ref={bodyRef}
            className={bodyClassName}
            style={
              {
                width: pageWidth * 2,
                height: size.height,
                '--stack-left': stack.left,
                '--stack-right': stack.right,
              } as CSSProperties
            }
          >
            <div
              className='history__book-stack history__book-stack--left'
              aria-hidden='true'
            />
            <div
              className='history__book-stack history__book-stack--right'
              aria-hidden='true'
            />
            <div className='history__book-focus-ring' aria-hidden='true' />
            <HTMLFlipBook
              key={landscape ? 'landscape' : 'half'}
              ref={bookRef}
              className='history__flipbook'
              width={pageWidth}
              height={size.height}
              hardCovers
              usePortrait={false}
              respectReducedMotion={false}
              pointerInput={
                landscape ? ENGINE_POINTERS_SPREAD : ENGINE_POINTERS_HALF
              }
              flippingTime={FLIP_DURATION}
              maxShadowOpacity={0.5}
              controls='none'
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
              onChangeState={handleChangeState}
              onTurnProgress={handleTurnProgress}
            >
              {leaves.map((leaf, i) => (
                <div
                  key={getLeafKey(leaf, i)}
                  data-density={isHardLeaf(leaf) ? 'hard' : undefined}
                >
                  <div className={`history__leaf history__leaf--${leaf.kind}`}>
                    {leaf.kind === 'cover-front' && <FrontCoverInner />}
                    {leaf.kind === 'inside-front' && (
                      <UsageGuide landscape={landscape} />
                    )}
                    {leaf.kind === 'cover-back' && <BackCoverInner />}
                    {leaf.kind === 'title' && <TitlePage />}
                    {leaf.kind === 'colophon' && <ColophonPage />}
                    {leaf.kind === 'page' &&
                      shouldRenderLeaf(i, page, targetLeaf) &&
                      renderPage(leaf)}
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        )}
        {!landscape && closed && (
          <p className='history__book-guide' role='note'>
            <MdOutlineSwipeLeft aria-hidden='true' />
            <span>
              옆으로 밀거나
              <br />
              아래 버튼을 눌러 넘겨 보세요
            </span>
          </p>
        )}
      </div>
      <div className='history__book-controls'>
        <button
          type='button'
          aria-label='이전 페이지'
          disabled={page === 0}
          {...gestures.holdButton('prev')}
          onClick={() => bookRef.current?.flipPrev()}
        >
          <MdChevronLeft aria-hidden='true' />
        </button>
        <span className='history__book-pager'>
          {closed ? '표지' : Math.ceil(page / 2)} / {spreadCount}
        </span>
        <button
          type='button'
          aria-label='다음 페이지'
          disabled={page >= lastLeaf}
          {...gestures.holdButton('next')}
          onClick={() => bookRef.current?.flipNext()}
        >
          <MdChevronRight aria-hidden='true' />
        </button>
      </div>
    </>
  );
}
