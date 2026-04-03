import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HeroBackground from './HeroBackground';

// Three.js 유틸리티 mock — jsdom은 WebGL을 지원하지 않음
const mockStopAnimation = vi.hoisted(() => vi.fn());
const mockDetachResize = vi.hoisted(() => vi.fn());
const mockDispose = vi.hoisted(() => vi.fn());
const mockSceneAdd = vi.hoisted(() => vi.fn());
const mockScene = vi.hoisted(() => ({ add: mockSceneAdd }));
const mockCamera = vi.hoisted(() => ({}));
const mockRenderer = vi.hoisted(() => ({ dispose: mockDispose }));
const mockGroup = vi.hoisted(() => ({}));
const mockTubes = vi.hoisted(() => [] as unknown[]);

const mockStartWaveAnimation = vi.hoisted(() => vi.fn(() => mockStopAnimation));
const mockCreateCamera = vi.hoisted(() => vi.fn(() => mockCamera));
const mockCreateLights = vi.hoisted(() => vi.fn());
const mockCreateRenderer = vi.hoisted(() => vi.fn(() => mockRenderer));
const mockCreateScene = vi.hoisted(() => vi.fn(() => mockScene));
const mockCreateWaveTubes = vi.hoisted(() =>
  vi.fn(() => ({ group: mockGroup, tubes: mockTubes })),
);
const mockAttachResizeHandler = vi.hoisted(() => vi.fn(() => mockDetachResize));

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

describe('HeroBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('canvas 렌더링', () => {
    it('canvas 엘리먼트가 렌더링된다', () => {
      const { container } = render(<HeroBackground />);

      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it('canvas에 hero__background 클래스가 적용된다', () => {
      const { container } = render(<HeroBackground />);

      expect(container.querySelector('canvas')).toHaveClass('hero__background');
    });

    it('canvas는 스크린 리더에서 숨겨진다', () => {
      const { container } = render(<HeroBackground />);

      expect(container.querySelector('canvas')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });

  describe('Three.js 초기화 파이프라인', () => {
    it('마운트 시 Three.js 초기화 함수들이 호출된다', () => {
      render(<HeroBackground />);

      expect(mockCreateScene).toHaveBeenCalledOnce();
      expect(mockCreateCamera).toHaveBeenCalledOnce();
      expect(mockCreateRenderer).toHaveBeenCalledOnce();
      expect(mockCreateLights).toHaveBeenCalledOnce();
      expect(mockCreateWaveTubes).toHaveBeenCalledOnce();
    });

    it('createRenderer에 canvas 엘리먼트가 전달된다', () => {
      const { container } = render(<HeroBackground />);

      const canvas = container.querySelector('canvas');
      expect(mockCreateRenderer).toHaveBeenCalledWith(canvas);
    });

    it('createLights에 scene이 전달된다', () => {
      render(<HeroBackground />);

      expect(mockCreateLights).toHaveBeenCalledWith(mockScene);
    });

    it('createWaveTubes에 scene이 전달된다', () => {
      render(<HeroBackground />);

      expect(mockCreateWaveTubes).toHaveBeenCalledWith(mockScene);
    });

    it('waveTubes의 group이 scene에 추가된다', () => {
      render(<HeroBackground />);

      expect(mockSceneAdd).toHaveBeenCalledWith(mockGroup);
    });

    it('startWaveAnimation에 올바른 인자가 전달된다', () => {
      render(<HeroBackground />);

      expect(mockStartWaveAnimation).toHaveBeenCalledWith(
        mockRenderer,
        mockScene,
        mockCamera,
        mockTubes,
      );
    });

    it('attachResizeHandler에 camera와 renderer가 전달된다', () => {
      render(<HeroBackground />);

      expect(mockAttachResizeHandler).toHaveBeenCalledWith(
        mockCamera,
        mockRenderer,
      );
    });
  });

  describe('클린업 (언마운트)', () => {
    it('언마운트 시 애니메이션이 정지된다', () => {
      const { unmount } = render(<HeroBackground />);

      unmount();

      expect(mockStopAnimation).toHaveBeenCalledOnce();
    });

    it('언마운트 시 리사이즈 핸들러가 해제된다', () => {
      const { unmount } = render(<HeroBackground />);

      unmount();

      expect(mockDetachResize).toHaveBeenCalledOnce();
    });

    it('언마운트 시 renderer가 해제된다', () => {
      const { unmount } = render(<HeroBackground />);

      unmount();

      expect(mockDispose).toHaveBeenCalledOnce();
    });
  });

  describe('Three.js 초기화 실패 시', () => {
    it('createScene에서 에러 발생 시 cleanup 함수가 호출되지 않는다', () => {
      mockCreateScene.mockImplementationOnce(() => {
        throw new Error('WebGL not supported');
      });

      const { unmount } = render(<HeroBackground />);
      unmount();

      expect(mockStopAnimation).not.toHaveBeenCalled();
      expect(mockDetachResize).not.toHaveBeenCalled();
      expect(mockDispose).not.toHaveBeenCalled();
    });

    it('createRenderer에서 에러 발생 시 cleanup 함수가 호출되지 않는다', () => {
      mockCreateRenderer.mockImplementationOnce(() => {
        throw new Error('Canvas context creation failed');
      });

      const { unmount } = render(<HeroBackground />);
      unmount();

      expect(mockStopAnimation).not.toHaveBeenCalled();
      expect(mockDetachResize).not.toHaveBeenCalled();
      expect(mockDispose).not.toHaveBeenCalled();
    });

    it('createWaveTubes에서 에러 발생 시 이전에 생성된 리소스도 정리되지 않는다', () => {
      mockCreateWaveTubes.mockImplementationOnce(() => {
        throw new Error('Geometry creation failed');
      });

      const { unmount } = render(<HeroBackground />);
      unmount();

      // catch 블록에서 early return하므로 cleanup 함수가 등록되지 않음
      expect(mockStopAnimation).not.toHaveBeenCalled();
      expect(mockDetachResize).not.toHaveBeenCalled();
      expect(mockDispose).not.toHaveBeenCalled();
    });

    it('초기화 실패해도 canvas는 정상 렌더링된다', () => {
      mockCreateScene.mockImplementationOnce(() => {
        throw new Error('WebGL not supported');
      });

      const { container } = render(<HeroBackground />);

      expect(container.querySelector('canvas')).toBeInTheDocument();
      expect(container.querySelector('canvas')).toHaveClass('hero__background');
    });
  });
});
