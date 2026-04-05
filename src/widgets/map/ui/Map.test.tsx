import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Map from './Map';

const mockMakeMap = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('../model/map', () => ({
  makeMap: mockMakeMap,
}));

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('시맨틱 구조', () => {
    it('section.map 요소가 렌더링된다', () => {
      const { container } = render(<Map />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('map');
    });

    it('address.map__card_content 요소가 렌더링된다', () => {
      const { container } = render(<Map />);

      expect(
        container.querySelector('address.map__card_content'),
      ).toBeInTheDocument();
    });
  });

  describe('제목 표시', () => {
    it('h2 제목이 "찾아오시는 길"로 렌더링된다', () => {
      render(<Map />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        '찾아오시는 길',
      );
    });
  });

  describe('교통수단 항목 렌더링', () => {
    it('도보 항목 레이블이 표시된다', () => {
      render(<Map />);

      expect(screen.getByText('도보')).toBeInTheDocument();
    });

    it('버스 항목 레이블이 표시된다', () => {
      render(<Map />);

      expect(screen.getByText('버스')).toBeInTheDocument();
    });

    it('지하철 항목 레이블이 표시된다', () => {
      render(<Map />);

      expect(screen.getByText('지하철')).toBeInTheDocument();
    });

    it('도보 상세 라인이 표시된다', () => {
      render(<Map />);

      expect(
        screen.getByText('부산 남구 수영로 274-16 (우) 48498'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('프렌즈 스크린 부산 대연점 옆 건물'),
      ).toBeInTheDocument();
    });

    it('버스 상세 라인이 표시된다', () => {
      render(<Map />);

      expect(screen.getByText('대연역 정거장 (211m)')).toBeInTheDocument();
      expect(screen.getByText('경성대학교 정거장 (278m)')).toBeInTheDocument();
    });

    it('지하철 상세 라인이 표시된다', () => {
      render(<Map />);

      expect(
        screen.getByText('2호선 경성대부경대역 5번 출구 (348m)'),
      ).toBeInTheDocument();
    });
  });

  describe('useEffect — makeMap 호출', () => {
    it('마운트 시 makeMap이 호출된다', () => {
      render(<Map />);

      expect(mockMakeMap).toHaveBeenCalledOnce();
    });

    it('makeMap에 HTMLDivElement가 전달된다', () => {
      render(<Map />);

      expect(mockMakeMap).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('언마운트 시 makeMap의 cleanup 함수가 호출된다', () => {
      const mockCleanup = vi.fn();
      mockMakeMap.mockReturnValueOnce(mockCleanup);

      const { unmount } = render(<Map />);
      unmount();

      expect(mockCleanup).toHaveBeenCalledOnce();
    });
  });
});
