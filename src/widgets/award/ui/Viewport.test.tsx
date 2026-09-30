import { useAwardStore } from '@features/award';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Viewport } from './Viewport';

vi.mock('@entities/award', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/award')>();
  const mockList = [
    {
      id: 0,
      title: '수상 A',
      category: '당선작',
      date: '2008. 01. 01',
      issuer: '기관',
    },
    {
      id: 1,
      title: '수상 B',
      category: '당선작',
      date: '2014. 05. 01',
      issuer: '기관',
    },
    {
      id: 2,
      title: '수상 C',
      category: '당선작',
      date: '2008. 07. 01',
      issuer: '기관',
    },
  ];
  return { ...actual, AWARD_LIST: mockList };
});

describe('Viewport', () => {
  beforeEach(() => {
    useAwardStore.getState().reset();
  });

  afterEach(() => {
    useAwardStore.getState().reset();
  });

  describe('렌더링', () => {
    it('"수상 목록" region으로 렌더링된다', () => {
      render(<Viewport />);
      expect(
        screen.getByRole('region', { name: '수상 목록' }),
      ).toBeInTheDocument();
    });

    it('연도별로 그룹이 만들어지고 최신 연도가 먼저 온다', () => {
      render(<Viewport />);
      const years = screen
        .getAllByRole('heading', { level: 3 })
        .map((el) => el.textContent);
      expect(years).toEqual(['2014', '2008']);
    });

    it('같은 연도 안에서는 최신 날짜가 먼저 온다', () => {
      const { container } = render(<Viewport />);
      const group2008 = container.querySelectorAll('.award__year_group')[1];
      const titles = [...group2008.querySelectorAll('.award__card__title')].map(
        (el) => el.textContent,
      );
      expect(titles).toEqual(['수상 C', '수상 A']);
    });
  });

  describe('연도 필터', () => {
    it('activeYear가 지정되면 해당 연도 그룹만 렌더링된다', () => {
      useAwardStore.setState({ activeYear: 2008 });
      const { container } = render(<Viewport />);
      expect(container.querySelectorAll('.award__year_group')).toHaveLength(1);
      expect(container.querySelectorAll('button.award__card')).toHaveLength(2);
    });
  });

  describe('카드 클릭', () => {
    it('카드 클릭 시 selectedId가 해당 award.id로 설정된다', () => {
      render(<Viewport />);
      fireEvent.click(screen.getByRole('button', { name: /^수상 B/ }));
      expect(useAwardStore.getState().selectedId).toBe(1);
    });
  });
});
