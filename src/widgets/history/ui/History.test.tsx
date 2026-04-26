import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { History } from './History';

// useBreakpoint가 모듈 로드 시 window.matchMedia를 호출하므로 모듈 자체를 mock
vi.mock('@shared/lib/breakpoint/useBreakpoint', () => ({
  useBreakpoint: () => 'desktop' as const,
}));

describe('History', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('history 섹션이 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history')).toBeInTheDocument();
  });

  it('HistoryTitle이 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__title')).toBeInTheDocument();
  });

  it('HistoryCategory가 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__category')).toBeInTheDocument();
  });

  it('history__book 영역이 렌더링된다', () => {
    const { container } = render(<History />);
    expect(container.querySelector('.history__book')).toBeInTheDocument();
  });

  it('초기 상태에서 앞표지(BookFrontCover)가 렌더링된다', () => {
    const { container } = render(<History />);
    expect(
      container.querySelector('.history__front-cover'),
    ).toBeInTheDocument();
  });

  it('초기 상태에서 HistoryCategory의 List 탭이 active이다', () => {
    render(<History />);
    const listTab = screen.getByRole('button', { name: 'List' });
    expect(listTab).toHaveClass('active');
  });
});
