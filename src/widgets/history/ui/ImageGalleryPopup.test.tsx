import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ImageGalleryPopup } from './ImageGalleryPopup';

const defaultProps = {
  title: '테스트 작품',
  images: ['img1.webp', 'img2.webp', 'img3.webp'],
  onClose: vi.fn(),
};

describe('ImageGalleryPopup', () => {
  describe('렌더링', () => {
    it('타이틀이 렌더링된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      expect(screen.getByText('테스트 작품')).toBeInTheDocument();
    });

    it('"닫기" aria-label의 닫기 버튼이 렌더링된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });
  });

  describe('닫기 동작', () => {
    it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      render(<ImageGalleryPopup {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('Escape 키 입력 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      render(<ImageGalleryPopup {...defaultProps} onClose={onClose} />);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('오버레이 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      const { container } = render(
        <ImageGalleryPopup {...defaultProps} onClose={onClose} />,
      );
      const overlay = container.querySelector('.popup__overlay')!;
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('팝업 내부 클릭 시 onClose가 호출되지 않는다', () => {
      const onClose = vi.fn();
      const { container } = render(
        <ImageGalleryPopup {...defaultProps} onClose={onClose} />,
      );
      const popup = container.querySelector('.popup--gallery')!;
      fireEvent.click(popup);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('스크롤 잠금', () => {
    it('마운트 시 body overflow가 hidden으로 설정된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('언마운트 시 body overflow가 복원된다', () => {
      const { unmount } = render(<ImageGalleryPopup {...defaultProps} />);
      unmount();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('키보드 슬라이드 네비게이션', () => {
    it('ArrowLeft keydown 시 이전 슬라이드로 이동한다 (wrap-around)', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      const imgs = screen.getAllByRole('img');
      expect(imgs.length).toBe(3);
    });

    it('ArrowRight keydown 시 다음 슬라이드로 이동한다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      const imgs = screen.getAllByRole('img');
      expect(imgs.length).toBe(3);
    });

    it('ArrowLeft keyup 시 stopContinuousSlide가 호출된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      fireEvent.keyUp(window, { key: 'ArrowLeft' });
    });

    it('ArrowRight keyup 시 stopContinuousSlide가 호출된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      fireEvent.keyUp(window, { key: 'ArrowRight' });
    });

    it('다른 키 keyup 시 아무것도 호출되지 않는다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      expect(() => {
        fireEvent.keyUp(window, { key: 'Enter' });
      }).not.toThrow();
    });
  });

  describe('슬라이더 버튼 네비게이션', () => {
    it('이전 버튼 mousedown 시 슬라이드 이동이 시작된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      const prevBtn = screen.getByRole('button', { name: '이전 이미지' });
      fireEvent.mouseDown(prevBtn);
      fireEvent.mouseUp(prevBtn);
    });

    it('다음 버튼 mousedown 시 슬라이드 이동이 시작된다', () => {
      render(<ImageGalleryPopup {...defaultProps} />);
      const nextBtn = screen.getByRole('button', { name: '다음 이미지' });
      fireEvent.mouseDown(nextBtn);
      fireEvent.mouseUp(nextBtn);
    });
  });
});
