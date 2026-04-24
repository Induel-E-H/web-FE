// @vitest-environment jsdom
/**
 * Map 컴포넌트 — mapRef가 null인 경우 테스트
 *
 * useEffect 내부 `if (mapRef.current) return makeMap(mapRef.current)`의
 * false 분기(mapRef.current === null)를 커버합니다.
 */
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Map from './Map';

const mockMakeMap = vi.hoisted(() => vi.fn(() => vi.fn()));
vi.mock('../model/map', () => ({ makeMap: mockMakeMap }));

const mockUseRef = vi.hoisted(() =>
  vi.fn(() => {
    const ref = {};
    Object.defineProperty(ref, 'current', {
      get: () => null,
      set: () => {
        /* React가 ref.current를 설정하려 해도 무시 */
      },
      configurable: true,
    });
    return ref;
  }),
);

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, useRef: mockUseRef };
});

describe('Map — mapRef가 null인 경우', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useRef가 null을 반환하면 makeMap이 호출되지 않는다', () => {
    render(<Map />);

    expect(mockMakeMap).not.toHaveBeenCalled();
  });
});
