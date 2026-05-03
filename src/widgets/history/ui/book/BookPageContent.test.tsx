import { artworks } from '@entities/history';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BookPageContent } from './BookPageContent';

vi.mock('@features/history/model/helpers', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@features/history/model/helpers')>();
  return { ...actual, preloadContentImages: vi.fn() };
});

describe('BookPageContent', () => {
  describe('item="List"', () => {
    it('side="left"이면 nav[aria-label="작품 목록"]이 렌더링된다', () => {
      render(
        <BookPageContent
          side='left'
          pageIndex={0}
          item='List'
          breakpoint='desktop'
          onListItemClick={vi.fn()}
        />,
      );
      expect(
        screen.getByRole('navigation', { name: '작품 목록' }),
      ).toBeInTheDocument();
    });

    it('side="right"이면 ListPage가 렌더링된다', () => {
      render(
        <BookPageContent
          side='right'
          pageIndex={0}
          item='List'
          breakpoint='desktop'
          onListItemClick={vi.fn()}
        />,
      );
      expect(
        screen.getByRole('navigation', { name: '작품 목록' }),
      ).toBeInTheDocument();
    });
  });

  describe('item="Content"', () => {
    it('side="left", pageIndex=0이면 ContentPage가 렌더링된다', () => {
      render(
        <BookPageContent
          side='left'
          pageIndex={0}
          item='Content'
          breakpoint='desktop'
          onListItemClick={vi.fn()}
        />,
      );
      expect(screen.getByText(artworks[0].titleEng)).toBeInTheDocument();
    });
  });

  describe('item="Timeline"', () => {
    it('side="left"이면 TimelinePage가 렌더링된다 (h3 "Timeline")', () => {
      render(
        <BookPageContent
          side='left'
          pageIndex={0}
          item='Timeline'
          breakpoint='desktop'
          onListItemClick={vi.fn()}
        />,
      );
      expect(
        screen.getByRole('heading', { level: 3, name: 'Timeline' }),
      ).toBeInTheDocument();
    });
  });

  describe('item="Milestones"', () => {
    it('side="left", pageIndex=0, breakpoint="desktop"이면 MilestonesPage가 렌더링된다 (h3 "Milestones")', () => {
      render(
        <BookPageContent
          side='left'
          pageIndex={0}
          item='Milestones'
          breakpoint='desktop'
          onListItemClick={vi.fn()}
        />,
      );
      expect(
        screen.getByRole('heading', { level: 3, name: 'Milestones' }),
      ).toBeInTheDocument();
    });
  });
});
