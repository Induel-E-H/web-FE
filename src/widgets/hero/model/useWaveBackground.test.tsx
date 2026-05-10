import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWaveBackground } from './useWaveBackground';

// Three.js 유틸리티 mock — jsdom은 WebGL을 지원하지 않음
const mockCancelAnimation = vi.hoisted(() => vi.fn());
const mockRemoveResizeListener = vi.hoisted(() => vi.fn());
const mockDispose = vi.hoisted(() => vi.fn());
const mockSceneAdd = vi.hoisted(() => vi.fn());
const mockScene = vi.hoisted(() => ({ add: mockSceneAdd }));
const mockCamera = vi.hoisted(() => ({}));
const mockRenderer = vi.hoisted(() => ({ dispose: mockDispose }));
const mockGroup = vi.hoisted(() => ({}));
const mockTubes = vi.hoisted(() => [] as unknown[]);

const mockStartWaveAnimation = vi.hoisted(() =>
  vi.fn(() => mockCancelAnimation),
);
const mockCreateCamera = vi.hoisted(() => vi.fn(() => mockCamera));
const mockCreateLights = vi.hoisted(() => vi.fn());
const mockCreateRenderer = vi.hoisted(() => vi.fn(() => mockRenderer));
const mockCreateScene = vi.hoisted(() => vi.fn(() => mockScene));
const mockCreateWaveTubes = vi.hoisted(() =>
  vi.fn(() => ({ group: mockGroup, tubes: mockTubes })),
);
const mockAttachResizeHandler = vi.hoisted(() =>
  vi.fn(() => mockRemoveResizeListener),
);

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

function WaveCanvas() {
  const ref = useWaveBackground();
  return <canvas ref={ref} />;
}

describe('useWaveBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Three.js 초기화 파이프라인', () => {
    it('마운트 시 Three.js 초기화 함수들이 호출된다', () => {
      render(<WaveCanvas />);

      expect(mockCreateScene).toHaveBeenCalledOnce();
      expect(mockCreateCamera).toHaveBeenCalledOnce();
      expect(mockCreateRenderer).toHaveBeenCalledOnce();
      expect(mockCreateLights).toHaveBeenCalledOnce();
      expect(mockCreateWaveTubes).toHaveBeenCalledOnce();
    });

    it('createRenderer에 canvas 엘리먼트가 전달된다', () => {
      const { container } = render(<WaveCanvas />);

      const canvas = container.querySelector('canvas');
      expect(mockCreateRenderer).toHaveBeenCalledWith(canvas);
    });

    it('createLights에 scene이 전달된다', () => {
      render(<WaveCanvas />);

      expect(mockCreateLights).toHaveBeenCalledWith(mockScene);
    });

    it('createWaveTubes가 인자 없이 호출된다', () => {
      render(<WaveCanvas />);

      expect(mockCreateWaveTubes).toHaveBeenCalledWith();
    });

    it('createWaveTubes의 group이 scene에 추가된다', () => {
      render(<WaveCanvas />);

      expect(mockSceneAdd).toHaveBeenCalledWith(mockGroup);
    });

    it('startWaveAnimation에 올바른 인자가 전달된다', () => {
      render(<WaveCanvas />);

      expect(mockStartWaveAnimation).toHaveBeenCalledWith(
        mockRenderer,
        mockScene,
        mockCamera,
        mockTubes,
      );
    });

    it('attachResizeHandler에 camera와 renderer가 전달된다', () => {
      render(<WaveCanvas />);

      expect(mockAttachResizeHandler).toHaveBeenCalledWith(
        mockCamera,
        mockRenderer,
      );
    });
  });

  describe('클린업 (언마운트)', () => {
    it('언마운트 시 애니메이션이 정지된다', () => {
      const { unmount } = render(<WaveCanvas />);

      unmount();

      expect(mockCancelAnimation).toHaveBeenCalledOnce();
    });

    it('언마운트 시 리사이즈 핸들러가 해제된다', () => {
      const { unmount } = render(<WaveCanvas />);

      unmount();

      expect(mockRemoveResizeListener).toHaveBeenCalledOnce();
    });

    it('언마운트 시 renderer가 해제된다', () => {
      const { unmount } = render(<WaveCanvas />);

      unmount();

      expect(mockDispose).toHaveBeenCalledOnce();
    });
  });

  describe('canvas ref 미연결 시', () => {
    it('canvas가 마운트되지 않으면 Three.js 초기화가 실행되지 않는다', () => {
      function NoCanvas() {
        useWaveBackground();
        return null;
      }
      render(<NoCanvas />);
      expect(mockCreateScene).not.toHaveBeenCalled();
    });
  });

  describe('Three.js 초기화 실패 시', () => {
    it('createScene에서 에러 발생 시 cleanup 함수가 호출되지 않는다', () => {
      mockCreateScene.mockImplementationOnce(() => {
        throw new Error('WebGL not supported');
      });

      const { unmount } = render(<WaveCanvas />);
      unmount();

      expect(mockCancelAnimation).not.toHaveBeenCalled();
      expect(mockRemoveResizeListener).not.toHaveBeenCalled();
      expect(mockDispose).not.toHaveBeenCalled();
    });

    it('createRenderer에서 에러 발생 시 cleanup 함수가 호출되지 않는다', () => {
      mockCreateRenderer.mockImplementationOnce(() => {
        throw new Error('Canvas context creation failed');
      });

      const { unmount } = render(<WaveCanvas />);
      unmount();

      expect(mockCancelAnimation).not.toHaveBeenCalled();
      expect(mockRemoveResizeListener).not.toHaveBeenCalled();
      expect(mockDispose).not.toHaveBeenCalled();
    });

    it('createWaveTubes에서 에러 발생 시 cleanup 함수가 등록되지 않는다', () => {
      mockCreateWaveTubes.mockImplementationOnce(() => {
        throw new Error('Geometry creation failed');
      });

      const { unmount } = render(<WaveCanvas />);
      unmount();

      expect(mockCancelAnimation).not.toHaveBeenCalled();
      expect(mockRemoveResizeListener).not.toHaveBeenCalled();
      expect(mockDispose).not.toHaveBeenCalled();
    });
  });
});
