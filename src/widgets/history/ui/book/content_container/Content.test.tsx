import * as helpers from '@features/history/model/helpers';
import { artworks } from '@entities/history';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentPage } from './Content';

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
      vi.spyOn(helpers, 'getThumbnailImage').mockReturnValue(MOCK_IMAGE);
      vi.spyOn(helpers, 'getAllContentImages').mockReturnValue([MOCK_IMAGE]);
      vi.spyOn(helpers, 'preloadContentImages').mockReturnValue(undefined);
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

    it('이미지 아이콘 버튼 클릭 시 팝업이 열린다', () => {
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

      expect(document.querySelector('.popup__overlay')).toBeInTheDocument();
    });

    it('figure 이미지 클릭 시 팝업이 열린다', () => {
      const { container } = render(<ContentPage side='left' pageIndex={0} />);
      const figure = container.querySelector(
        'figure.content__image--has-image',
      ) as HTMLElement;
      fireEvent.click(figure);
      expect(document.querySelector('.popup__overlay')).toBeInTheDocument();
    });
  });
});
