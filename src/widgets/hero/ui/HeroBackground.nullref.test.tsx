/**
 * HeroBackground 컴포넌트 — canvasRef가 null인 경우 테스트
 *
 * useEffect 내부 `if (!canvas) return` early return 경로를 커버합니다.
 * React의 useRef를 mock하여 { current: null }을 반환하도록 설정합니다.
 */
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HeroBackground from './HeroBackground';

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
  return {
    ...actual,
    useRef: mockUseRef,
  };
});

// Three.js 유틸리티 mock
const mockStartWaveAnimation = vi.hoisted(() => vi.fn());
const mockCreateCamera = vi.hoisted(() => vi.fn());
const mockCreateLights = vi.hoisted(() => vi.fn());
const mockCreateRenderer = vi.hoisted(() => vi.fn());
const mockCreateScene = vi.hoisted(() => vi.fn());
const mockCreateWaveTubes = vi.hoisted(() => vi.fn());
const mockAttachResizeHandler = vi.hoisted(() => vi.fn());

vi.mock('@shared/lib/three/animation/waveAnimation', () => ({
  startWaveAnimation: mockStartWaveAnimation,
}));
vi.mock('@shared/lib/three/core/createCamera', () => ({
  createCamera: mockCreateCamera,
}));
vi.mock('@shared/lib/three/core/createLights', () => ({
  createLights: mockCreateLights,
}));
vi.mock('@shared/lib/three/core/createRenderer', () => ({
  createRenderer: mockCreateRenderer,
}));
vi.mock('@shared/lib/three/core/createScene', () => ({
  createScene: mockCreateScene,
}));
vi.mock('@shared/lib/three/objects/createWaveTubes', () => ({
  createWaveTubes: mockCreateWaveTubes,
}));
vi.mock('@shared/lib/three/utils/attachResizeHandler', () => ({
  attachResizeHandler: mockAttachResizeHandler,
}));

describe('HeroBackground — canvas ref가 null인 경우', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useRef가 null을 반환하면 Three.js 초기화가 실행되지 않는다', () => {
    render(<HeroBackground />);

    expect(mockCreateScene).not.toHaveBeenCalled();
    expect(mockCreateCamera).not.toHaveBeenCalled();
    expect(mockCreateRenderer).not.toHaveBeenCalled();
    expect(mockStartWaveAnimation).not.toHaveBeenCalled();
    expect(mockAttachResizeHandler).not.toHaveBeenCalled();
  });

  it('useRef가 null을 반환해도 canvas 엘리먼트는 DOM에 존재한다', () => {
    const { container } = render(<HeroBackground />);

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
