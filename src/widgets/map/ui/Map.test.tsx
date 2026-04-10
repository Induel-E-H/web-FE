import { render } from '@testing-library/react';
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
