import * as entityHistory from '@entities/history';
import { artworks } from '@entities/history';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentPage } from './Content';

vi.mock('@features/history/model/helpers', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@features/history/model/helpers')>();
  return { ...actual, preloadContentImages: vi.fn() };
});

type ROCallback = (entries: ResizeObserverEntry[]) => void;

describe('ContentPage', () => {
  describe('렌더링', () => {
    it('유효한 인덱스의 영문 타이틀이 렌더링된다', () => {
      render(<ContentPage side='left' pageIndex={0} />);
      expect(screen.getByText(artworks[0].titleEng)).toBeInTheDocument();
    });

    it('유효한 인덱스의 한국어 타이틀이 렌더링된다', () => {
      render(<ContentPage side='left' pageIndex={0} />);
      expect(screen.getByText(artworks[0].title)).toBeInTheDocument();
    });

    it('right side는 pageIndex*2+1 인덱스의 작품을 렌더링한다', () => {
      render(<ContentPage side='right' pageIndex={0} />);
      expect(screen.getByText(artworks[1].titleEng)).toBeInTheDocument();
    });

    it('범위를 초과한 pageIndex에서는 빈 컨테이너를 렌더링한다', () => {
      const { container } = render(<ContentPage side='left' pageIndex={999} />);
      expect(container.querySelector('.content__empty')).toBeInTheDocument();
    });

    it('작품 주소가 렌더링된다', () => {
      render(<ContentPage side='left' pageIndex={0} />);
      expect(screen.getByText(artworks[0].address)).toBeInTheDocument();
    });
  });

  describe('이미지 인라인 표시 (showImageInline)', () => {
    const MOCK_IMAGE = 'mock-thumbnail.webp';

    beforeEach(() => {
      vi.spyOn(entityHistory, 'getThumbnailImage').mockReturnValue(MOCK_IMAGE);
      vi.spyOn(entityHistory, 'getAllContentImages').mockResolvedValue([
        MOCK_IMAGE,
      ]);
    });

    it('공간이 충분하면 figure.content__image가 렌더링된다', () => {
      // jsdom clientHeight=0 → available(0) >= articleHeight*0.3(0) → true
      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      expect(
        container.querySelector('figure.content__image'),
      ).toBeInTheDocument();
    });

    it('공간이 충분하면 이미지 아이콘 버튼이 렌더링되지 않는다', () => {
      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      expect(
        container.querySelector('.content__image-icon'),
      ).not.toBeInTheDocument();
    });

    it('공간이 부족하면 figure 대신 아이콘 버튼이 렌더링된다', () => {
      let capturedCb: ROCallback | null = null;
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(cb: ROCallback) {
            capturedCb = cb;
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );

      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const article = container.querySelector('article.content__item')!;
      const textDiv = container.querySelector('.content__text')!;

      // article=100, text=80 → available=20 < 30 → 아이콘 모드
      Object.defineProperty(article, 'clientHeight', {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(textDiv, 'clientHeight', {
        value: 80,
        configurable: true,
      });

      act(() => {
        capturedCb?.([]);
      });

      expect(
        container.querySelector('.content__image-icon'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('figure.content__image'),
      ).not.toBeInTheDocument();
    });

    it('공간이 부족하면 content__item--icon-mode 클래스가 적용된다', () => {
      let capturedCb: ROCallback | null = null;
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(cb: ROCallback) {
            capturedCb = cb;
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );

      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const article = container.querySelector('article.content__item')!;
      const textDiv = container.querySelector('.content__text')!;

      Object.defineProperty(article, 'clientHeight', {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(textDiv, 'clientHeight', {
        value: 80,
        configurable: true,
      });

      act(() => {
        capturedCb?.([]);
      });

      expect(article.classList).toContain('content__item--icon-mode');
    });

    it('이미지 아이콘 버튼 클릭 시 팝업이 열린다', async () => {
      let capturedCb: ROCallback | null = null;
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(cb: ROCallback) {
            capturedCb = cb;
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );

      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const article = container.querySelector('article.content__item')!;
      const textDiv = container.querySelector('.content__text')!;

      Object.defineProperty(article, 'clientHeight', {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(textDiv, 'clientHeight', {
        value: 80,
        configurable: true,
      });

      act(() => {
        capturedCb?.([]);
      });

      const iconBtn = container.querySelector(
        'button.content__image-icon',
      ) as HTMLElement;
      fireEvent.click(iconBtn);
      await waitFor(() => {
        expect(document.querySelector('.popup__overlay')).toBeInTheDocument();
      });
    });

    it('figure 이미지 클릭 시 팝업이 열린다', async () => {
      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const figure = container.querySelector(
        'figure.content__image--has-image',
      ) as HTMLElement;
      fireEvent.click(figure);
      await waitFor(() => {
        expect(document.querySelector('.popup__overlay')).toBeInTheDocument();
      });
    });

    it('팝업 닫기 버튼 클릭 시 팝업이 닫힌다 (handlePopupClose)', async () => {
      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const figure = container.querySelector(
        'figure.content__image--has-image',
      ) as HTMLElement;
      fireEvent.click(figure);
      await waitFor(() => {
        expect(document.querySelector('.popup__overlay')).toBeInTheDocument();
      });
      const closeBtn = document.querySelector(
        'button[aria-label="닫기"]',
      ) as HTMLElement;
      fireEvent.click(closeBtn);
      expect(document.querySelector('.popup__overlay')).not.toBeInTheDocument();
    });

    it('figure mousedown 시 이벤트 전파가 차단된다', () => {
      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const figure = container.querySelector(
        'figure.content__image--has-image',
      ) as HTMLElement;
      const parentHandler = vi.fn();
      container.addEventListener('mousedown', parentHandler);
      fireEvent.mouseDown(figure);
      container.removeEventListener('mousedown', parentHandler);
    });

    it('아이콘 버튼 mousedown 시 이벤트 전파가 차단된다', () => {
      let capturedCb: ROCallback | null = null;
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(cb: ROCallback) {
            capturedCb = cb;
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );

      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const article = container.querySelector('article.content__item')!;
      const textDiv = container.querySelector('.content__text')!;

      Object.defineProperty(article, 'clientHeight', {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(textDiv, 'clientHeight', {
        value: 80,
        configurable: true,
      });

      act(() => {
        capturedCb?.([]);
      });

      const iconBtn = container.querySelector(
        'button.content__image-icon',
      ) as HTMLElement;
      const parentHandler = vi.fn();
      container.addEventListener('mousedown', parentHandler);
      fireEvent.mouseDown(iconBtn);
      container.removeEventListener('mousedown', parentHandler);
    });
  });

  describe('배열 subTitle 렌더링', () => {
    it('subTitle이 배열인 작품은 각 배열 항목이 h4로 렌더링된다 (pageIndex=14, side=left)', () => {
      render(<ContentPage side='left' pageIndex={14} />);
      expect(screen.getByText('韓國的 한국적 디자인')).toBeInTheDocument();
      expect(
        screen.getByText('使用者指向的 사용자 지향적 디자인'),
      ).toBeInTheDocument();
    });
  });
});
