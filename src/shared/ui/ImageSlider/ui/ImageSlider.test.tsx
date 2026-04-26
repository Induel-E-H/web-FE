import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ImageSlider } from './ImageSlider';

const defaultProps = {
  images: ['img1.webp', 'img2.webp', 'img3.webp'],
  currentIndex: 0,
  alt: '테스트',
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onRelease: vi.fn(),
};

function getFrame(container: HTMLElement) {
  return container.querySelector('.image-slider__frame')!;
}

describe('ImageSlider', () => {
  describe('렌더링', () => {
    it('이미지 개수만큼 img 요소가 렌더링된다', () => {
      render(<ImageSlider {...defaultProps} />);
      expect(screen.getAllByRole('img')).toHaveLength(3);
    });

    it('인디케이터에 현재 인덱스+1과 전체 개수가 표시된다', () => {
      const { container } = render(
        <ImageSlider {...defaultProps} currentIndex={1} />,
      );
      const indicator = container.querySelector('.image-slider__indicator')!;
      expect(indicator.textContent).toContain('2');
      expect(indicator.textContent).toContain('3');
    });

    it('이전/다음 버튼이 각각 렌더링된다', () => {
      render(<ImageSlider {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: '이전 이미지' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '다음 이미지' }),
      ).toBeInTheDocument();
    });
  });

  describe('버튼 네비게이션', () => {
    it('이전 버튼 mousedown 시 onPrev가 호출된다', () => {
      const onPrev = vi.fn();
      render(<ImageSlider {...defaultProps} onPrev={onPrev} />);
      fireEvent.mouseDown(screen.getByRole('button', { name: '이전 이미지' }));
      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it('다음 버튼 mousedown 시 onNext가 호출된다', () => {
      const onNext = vi.fn();
      render(<ImageSlider {...defaultProps} onNext={onNext} />);
      fireEvent.mouseDown(screen.getByRole('button', { name: '다음 이미지' }));
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('버튼 mouseup 시 onRelease가 호출된다', () => {
      const onRelease = vi.fn();
      render(<ImageSlider {...defaultProps} onRelease={onRelease} />);
      fireEvent.mouseUp(screen.getByRole('button', { name: '이전 이미지' }));
      expect(onRelease).toHaveBeenCalledTimes(1);
    });
  });

  describe('터치 스와이프', () => {
    it('threshold 이상 왼쪽 스와이프 시 onNext + onRelease가 호출된다', () => {
      const onNext = vi.fn();
      const onRelease = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onNext={onNext} onRelease={onRelease} />,
      );
      const frame = getFrame(container);
      fireEvent.touchStart(frame, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(frame, { changedTouches: [{ clientX: 100 }] });
      expect(onNext).toHaveBeenCalledTimes(1);
      expect(onRelease).toHaveBeenCalledTimes(1);
    });

    it('threshold 이상 오른쪽 스와이프 시 onPrev + onRelease가 호출된다', () => {
      const onPrev = vi.fn();
      const onRelease = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onPrev={onPrev} onRelease={onRelease} />,
      );
      const frame = getFrame(container);
      fireEvent.touchStart(frame, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(frame, { changedTouches: [{ clientX: 200 }] });
      expect(onPrev).toHaveBeenCalledTimes(1);
      expect(onRelease).toHaveBeenCalledTimes(1);
    });

    it('threshold 미만 스와이프 시 아무것도 호출되지 않는다', () => {
      const onPrev = vi.fn();
      const onNext = vi.fn();
      const onRelease = vi.fn();
      const { container } = render(
        <ImageSlider
          {...defaultProps}
          onPrev={onPrev}
          onNext={onNext}
          onRelease={onRelease}
        />,
      );
      const frame = getFrame(container);
      fireEvent.touchStart(frame, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(frame, { changedTouches: [{ clientX: 70 }] });
      expect(onPrev).not.toHaveBeenCalled();
      expect(onNext).not.toHaveBeenCalled();
      expect(onRelease).not.toHaveBeenCalled();
    });

    it('touchStart 없이 touchEnd만 발생해도 아무것도 호출되지 않는다', () => {
      const onNext = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onNext={onNext} />,
      );
      const frame = getFrame(container);
      fireEvent.touchEnd(frame, { changedTouches: [{ clientX: 0 }] });
      expect(onNext).not.toHaveBeenCalled();
    });
  });

  describe('마우스 드래그', () => {
    it('threshold 이상 왼쪽 드래그 시 onNext + onRelease가 호출된다', () => {
      const onNext = vi.fn();
      const onRelease = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onNext={onNext} onRelease={onRelease} />,
      );
      const frame = getFrame(container);
      fireEvent.mouseDown(frame, { clientX: 200 });
      fireEvent.mouseUp(frame, { clientX: 100 });
      expect(onNext).toHaveBeenCalledTimes(1);
      expect(onRelease).toHaveBeenCalledTimes(1);
    });

    it('threshold 이상 오른쪽 드래그 시 onPrev + onRelease가 호출된다', () => {
      const onPrev = vi.fn();
      const onRelease = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onPrev={onPrev} onRelease={onRelease} />,
      );
      const frame = getFrame(container);
      fireEvent.mouseDown(frame, { clientX: 100 });
      fireEvent.mouseUp(frame, { clientX: 200 });
      expect(onPrev).toHaveBeenCalledTimes(1);
      expect(onRelease).toHaveBeenCalledTimes(1);
    });

    it('threshold 미만 드래그 시 아무것도 호출되지 않는다', () => {
      const onPrev = vi.fn();
      const onNext = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onPrev={onPrev} onNext={onNext} />,
      );
      const frame = getFrame(container);
      fireEvent.mouseDown(frame, { clientX: 100 });
      fireEvent.mouseUp(frame, { clientX: 70 });
      expect(onPrev).not.toHaveBeenCalled();
      expect(onNext).not.toHaveBeenCalled();
    });

    it('mouseLeave 시 드래그 상태가 초기화된다 (이후 mouseUp이 동작하지 않음)', () => {
      const onNext = vi.fn();
      const { container } = render(
        <ImageSlider {...defaultProps} onNext={onNext} />,
      );
      const frame = getFrame(container);
      fireEvent.mouseDown(frame, { clientX: 200 });
      fireEvent.mouseLeave(frame);
      fireEvent.mouseUp(frame, { clientX: 100 });
      expect(onNext).not.toHaveBeenCalled();
    });
  });
});
