import { useImperativeHandle } from 'react';
import type { ReactNode, Ref } from 'react';

import { buildLeaves } from '@features/history';
import type {
  FlipBookHandle,
  HTMLFlipBookProps,
} from '@gullabs/react-flipbook';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Book } from './Book';

const flipbook = vi.hoisted(() => ({
  props: null as HTMLFlipBookProps | null,
  engine: null as object | null,
  handle: {
    flipNext: vi.fn(),
    flipPrev: vi.fn(),
    cancelTurn: vi.fn(),
    pageFlip: vi.fn((): unknown => flipbook.engine),
  },
}));

vi.mock('@gullabs/react-flipbook', () => ({
  default: function MockFlipBook(
    props: HTMLFlipBookProps & { children?: ReactNode; ref?: Ref<unknown> },
  ) {
    flipbook.props = props;
    useImperativeHandle(props.ref, () => flipbook.handle);
    return <div data-testid='flipbook'>{props.children}</div>;
  },
}));

const STAGE = { width: 1000, height: 600 };

class MockResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe() {
    this.cb(
      [{ contentRect: STAGE } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
  disconnect() {}
}

const leaves = buildLeaves('desktop');
const lastLeaf = leaves.length - 1;

function setup(landscape = true) {
  const props = {
    bookRef: { current: null as FlipBookHandle | null },
    leaves,
    landscape,
    renderPage: vi.fn(() => <p>page</p>),
    onPageChange: vi.fn(),
    onSettled: vi.fn(),
    onHoldStart: vi.fn(),
    onHoldEnd: vi.fn(),
  };
  const utils = render(<Book {...props} />);
  const stage = utils.container.querySelector('.history__book-stage')!;
  const body = () => utils.container.querySelector('.history__book-body')!;
  return { ...utils, props, stage, body };
}

function turnTo(page: number) {
  act(() =>
    flipbook.props?.onPageChange?.({
      page,
      pageCount: leaves.length,
      orientation: 'landscape',
      visiblePages: [page],
    }),
  );
}

describe('Book', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: STAGE.width,
    } as DOMRect);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.values(flipbook.handle).forEach((fn) => fn.mockClear());
    flipbook.engine = null;
  });

  describe('렌더링', () => {
    it('모든 장을 렌더링하고 표지는 표지 콘텐츠로 채운다', () => {
      const { container, props } = setup();
      expect(container.querySelectorAll('.history__leaf')).toHaveLength(
        leaves.length,
      );
      expect(
        container.querySelector('.history__front-cover-inner'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.history__back-cover-inner'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('.history__title-page'),
      ).toBeInTheDocument();
      expect(container.querySelector('.history__colophon')).toBeInTheDocument();
      expect(props.renderPage).toHaveBeenCalledTimes(
        leaves.filter((leaf) => leaf.kind === 'page').length,
      );
    });

    it('표지 안쪽 장은 하드 페이지로 표시한다', () => {
      const { container } = setup();
      const inside = container.querySelector('.history__leaf--inside-front');
      expect(inside?.parentElement).toHaveAttribute('data-density', 'hard');
    });

    it('가로 모드는 한 페이지 폭을 무대의 절반으로, 하드커버로 설정한다', () => {
      setup(true);
      expect(flipbook.props).toMatchObject({
        width: STAGE.width / 2,
        height: STAGE.height,
        hardCovers: true,
        usePortrait: false,
        controls: 'auto',
      });
    });

    it('OS 의 애니메이션 줄이기 설정과 무관하게 넘김 애니메이션을 재생한다', () => {
      setup();
      expect(flipbook.props?.respectReducedMotion).toBe(false);
    });

    it('반쪽 보기는 한 장이 무대 전체 폭이고 오른쪽 장은 화면 밖에 둔다', () => {
      const { body } = setup(false);
      expect(flipbook.props).toMatchObject({
        width: STAGE.width,
        usePortrait: false,
        controls: 'none',
      });
      expect(body()).toHaveClass('history__book-body--half');
      expect(body()).toHaveStyle({ width: `${STAGE.width * 2}px` });
    });
  });

  describe('닫힌 책 상태', () => {
    it('처음에는 앞표지로 닫혀 있다', () => {
      const { body } = setup();
      expect(body()).toHaveClass('history__book-body--closed-front');
    });

    it('펼치면 닫힘 클래스가 사라진다', () => {
      const { body } = setup();
      turnTo(3);
      expect(body()).not.toHaveClass('history__book-body--closed-front');
      expect(body()).not.toHaveClass('history__book-body--closed-back');
    });

    it('마지막 장이면 뒤표지로 닫힌다', () => {
      const { body } = setup();
      turnTo(lastLeaf);
      expect(body()).toHaveClass('history__book-body--closed-back');
    });

    it('넘기는 중에는 turning 클래스를 붙이고 끝나면 뗀다', () => {
      const { body } = setup();
      act(() => flipbook.props?.onChangeState?.({ state: 'flipping' }));
      expect(body()).toHaveClass('history__book-body--turning');
      act(() => flipbook.props?.onChangeState?.({ state: 'read' }));
      expect(body()).not.toHaveClass('history__book-body--turning');
    });

    it('앞표지로 닫히는 넘김 동안에는 closing-front 만 붙인다', () => {
      const { body } = setup();
      turnTo(1);
      act(() =>
        flipbook.props?.onTurnProgress?.({ progress: 0.2, direction: 'prev' }),
      );
      expect(body()).toHaveClass('history__book-body--closing-front');
      expect(body()).not.toHaveClass('history__book-body--closing-back');
      act(() => flipbook.props?.onChangeState?.({ state: 'read' }));
      expect(body()).not.toHaveClass('history__book-body--closing-front');
    });

    it('뒤표지로 닫히는 넘김 동안에는 closing-back 만 붙인다', () => {
      const { body } = setup();
      turnTo(lastLeaf - 2);
      act(() =>
        flipbook.props?.onTurnProgress?.({ progress: 0.2, direction: 'next' }),
      );
      expect(body()).toHaveClass('history__book-body--closing-back');
      expect(body()).not.toHaveClass('history__book-body--closing-front');
      act(() => flipbook.props?.onChangeState?.({ state: 'read' }));
      expect(body()).not.toHaveClass('history__book-body--closing-back');
    });

    it('표지로 닫히지 않는 넘김에는 closing 클래스를 붙이지 않는다', () => {
      const { body } = setup();
      turnTo(3);
      act(() =>
        flipbook.props?.onTurnProgress?.({ progress: 0.2, direction: 'prev' }),
      );
      expect(body()).not.toHaveClass('history__book-body--closing-front');
      expect(body()).not.toHaveClass('history__book-body--closing-back');
    });

    it('모서리 접힘 미리보기(fold_corner)는 넘김으로 보지 않는다', () => {
      const { body } = setup();
      act(() => flipbook.props?.onChangeState?.({ state: 'fold_corner' }));
      expect(body()).not.toHaveClass('history__book-body--turning');
    });

    function hoverSetup(landscape = true) {
      const utils = setup(landscape);
      const el = utils.body() as HTMLElement;
      Object.defineProperty(el, 'offsetWidth', { value: 1000 });
      Object.defineProperty(el, 'offsetHeight', { value: 600 });
      return { ...utils, el };
    }

    it('마우스를 표지 영역(본체 가운데 절반)에 올리면 hover 클래스를 붙인다', () => {
      const { stage, el } = hoverSetup();
      fireEvent.pointerMove(stage, {
        clientX: 500,
        clientY: 300,
        pointerType: 'mouse',
      });
      expect(el).toHaveClass('history__book-body--hover');
      fireEvent.pointerMove(stage, {
        clientX: 100,
        clientY: 300,
        pointerType: 'mouse',
      });
      expect(el).not.toHaveClass('history__book-body--hover');
    });

    it('무대를 벗어나면 hover 클래스를 뗀다', () => {
      const { stage, el } = hoverSetup();
      fireEvent.pointerMove(stage, {
        clientX: 500,
        clientY: 300,
        pointerType: 'mouse',
      });
      fireEvent.pointerLeave(stage);
      expect(el).not.toHaveClass('history__book-body--hover');
    });

    it('터치나 반쪽 보기에서는 hover 를 쓰지 않는다', () => {
      const touch = hoverSetup();
      fireEvent.pointerMove(touch.stage, {
        clientX: 500,
        clientY: 300,
        pointerType: 'touch',
      });
      expect(touch.el).not.toHaveClass('history__book-body--hover');
      touch.unmount();

      const half = hoverSetup(false);
      fireEvent.pointerMove(half.stage, {
        clientX: 500,
        clientY: 300,
        pointerType: 'mouse',
      });
      expect(half.el).not.toHaveClass('history__book-body--hover');
    });

    it('떠 있는 닫힌 책을 열면 다 열릴 때까지 떠 있다가 내려온다', () => {
      const { stage, el } = hoverSetup();
      fireEvent.pointerMove(stage, {
        clientX: 500,
        clientY: 300,
        pointerType: 'mouse',
      });
      act(() => flipbook.props?.onChangeState?.({ state: 'flipping' }));
      expect(el).toHaveClass('history__book-body--lifted');
      act(() => flipbook.props?.onChangeState?.({ state: 'read' }));
      expect(el).not.toHaveClass('history__book-body--lifted');
    });

    it('hover 하지 않았거나 펼친 상태에서 넘길 때는 띄우지 않는다', () => {
      const { stage, el } = hoverSetup();
      act(() => flipbook.props?.onChangeState?.({ state: 'flipping' }));
      expect(el).not.toHaveClass('history__book-body--lifted');
      act(() => flipbook.props?.onChangeState?.({ state: 'read' }));

      turnTo(3);
      fireEvent.pointerMove(stage, {
        clientX: 500,
        clientY: 300,
        pointerType: 'mouse',
      });
      act(() => flipbook.props?.onChangeState?.({ state: 'flipping' }));
      expect(el).not.toHaveClass('history__book-body--lifted');
    });

    it('넘기는 중 상태 변화로 책을 다시 렌더링하지 않는다', () => {
      const { props } = setup();
      const renders = props.renderPage.mock.calls.length;
      act(() => flipbook.props?.onChangeState?.({ state: 'flipping' }));
      expect(props.renderPage).toHaveBeenCalledTimes(renders);
    });
  });

  describe('이벤트', () => {
    it('페이지가 바뀌면 onPageChange 를 호출한다', () => {
      const { props } = setup();
      turnTo(3);
      expect(props.onPageChange).toHaveBeenCalledWith(
        expect.objectContaining({ page: 3 }),
      );
    });

    it('read 상태가 되면 onSettled 를 호출한다', () => {
      const { props } = setup();
      act(() => flipbook.props?.onChangeState?.({ state: 'flipping' }));
      expect(props.onSettled).not.toHaveBeenCalled();
      act(() => flipbook.props?.onChangeState?.({ state: 'read' }));
      expect(props.onSettled).toHaveBeenCalledTimes(1);
    });

    it('liveRegionText 를 한국어로 안내한다', () => {
      setup();
      const text = flipbook.props?.liveRegionText?.(0, leaves.length, {
        pages: [3, 4],
        orientation: 'landscape',
        hardCovers: true,
      });
      expect(text).toBe('List 1페이지, List 1페이지');
      expect(
        flipbook.props?.liveRegionText?.(0, leaves.length, {
          pages: [leaves.length - 3, leaves.length - 2],
          orientation: 'landscape',
          hardCovers: true,
        }),
      ).toBe('판권면, 뒤표지 안쪽');
      expect(
        flipbook.props?.liveRegionText?.(0, leaves.length, {
          pages: [0],
          orientation: 'landscape',
          hardCovers: true,
        }),
      ).toBe('앞표지');
    });
  });

  describe('표지 안쪽 하드 페이지 동기화', () => {
    function mountWithEngine(classes: string[]) {
      const elements = classes.map((cls) => {
        const el = document.createElement('div');
        el.dataset.density = 'hard';
        el.className = cls;
        return el;
      });
      const engine = {
        isReady: () => true,
        isAnimating: () => false,
        getPageCount: () => elements.length,
        getPageElement: (i: number) => elements[i] ?? null,
        updateFromHtml: vi.fn(),
      };
      flipbook.engine = engine;
      setup();
      return { engine, elements };
    }

    it('엔진이 soft 로 읽은 hard 장이 있으면 다시 로드한다', () => {
      const { engine, elements } = mountWithEngine(['--hard', '--soft']);
      expect(engine.updateFromHtml).toHaveBeenCalledWith(elements);
    });

    it('모두 제대로 읽혔으면 다시 로드하지 않는다', () => {
      const { engine } = mountWithEngine(['--hard', '--hard']);
      expect(engine.updateFromHtml).not.toHaveBeenCalled();
    });
  });

  describe('꾹 누르기', () => {
    it('오른쪽을 누르고 있으면 next 로 연속 넘김을 시작한다', () => {
      const { stage, props } = setup();
      fireEvent.pointerDown(stage, { button: 0, clientX: 800, clientY: 100 });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(flipbook.handle.cancelTurn).toHaveBeenCalled();
      expect(props.onHoldStart).toHaveBeenCalledWith('next');
    });

    it('왼쪽을 누르고 있으면 prev 로 시작한다', () => {
      const { stage, props } = setup();
      fireEvent.pointerDown(stage, { button: 0, clientX: 100, clientY: 100 });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(props.onHoldStart).toHaveBeenCalledWith('prev');
    });

    it('시간 전에 떼면 연속 넘김이 시작되지 않는다', () => {
      const { stage, props } = setup();
      fireEvent.pointerDown(stage, { button: 0, clientX: 800, clientY: 100 });
      fireEvent.pointerUp(stage);
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(props.onHoldStart).not.toHaveBeenCalled();
      expect(props.onHoldEnd).not.toHaveBeenCalled();
    });

    it('드래그로 움직이면 연속 넘김이 취소된다', () => {
      const { stage, props } = setup();
      fireEvent.pointerDown(stage, { button: 0, clientX: 800, clientY: 100 });
      fireEvent.pointerMove(stage, { clientX: 760, clientY: 100 });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      expect(props.onHoldStart).not.toHaveBeenCalled();
    });

    it('떼면 onHoldEnd 를 호출하고 뒤따르는 click 은 막는다', () => {
      const { stage, props } = setup();
      const onClick = vi.fn();
      stage.addEventListener('click', onClick);
      fireEvent.pointerDown(stage, { button: 0, clientX: 800, clientY: 100 });
      act(() => {
        vi.advanceTimersByTime(400);
      });
      fireEvent.pointerUp(stage);
      fireEvent.click(stage.querySelector('.history__leaf')!);
      expect(props.onHoldEnd).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('세로 모드 버튼', () => {
    it('가로 모드에는 버튼이 없다', () => {
      setup(true);
      expect(
        screen.queryByRole('button', { name: '다음 페이지' }),
      ).not.toBeInTheDocument();
    });

    it('이전/다음 버튼으로 책을 넘긴다', () => {
      setup(false);
      fireEvent.click(screen.getByRole('button', { name: '다음 페이지' }));
      expect(flipbook.handle.flipNext).toHaveBeenCalled();
      turnTo(3);
      fireEvent.click(screen.getByRole('button', { name: '이전 페이지' }));
      expect(flipbook.handle.flipPrev).toHaveBeenCalled();
    });

    it('양 끝에서는 해당 방향 버튼이 비활성화된다', () => {
      setup(false);
      expect(
        screen.getByRole('button', { name: '이전 페이지' }),
      ).toBeDisabled();
      turnTo(lastLeaf);
      expect(
        screen.getByRole('button', { name: '다음 페이지' }),
      ).toBeDisabled();
    });
  });
});
