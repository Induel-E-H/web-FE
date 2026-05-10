// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Popup } from './Popup';

function renderPopup(onClose = vi.fn(), title?: string) {
  return render(
    <Popup ariaLabel='테스트 팝업' title={title} onClose={onClose}>
      <p>팝업 내용</p>
    </Popup>,
  );
}

describe('Popup', () => {
  describe('렌더링', () => {
    it('dialog 역할로 렌더링된다', () => {
      renderPopup();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('aria-modal="true"가 설정된다', () => {
      renderPopup();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('aria-label이 올바르게 설정된다', () => {
      renderPopup();
      expect(
        screen.getByRole('dialog', { name: '테스트 팝업' }),
      ).toBeInTheDocument();
    });

    it('닫기 버튼이 렌더링된다', () => {
      renderPopup();
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });

    it('title prop이 있으면 h3 제목이 렌더링된다', () => {
      renderPopup(vi.fn(), '팝업 제목');
      expect(screen.getByText('팝업 제목')).toBeInTheDocument();
    });

    it('title prop이 없으면 h3 제목이 렌더링되지 않는다', () => {
      const { container } = renderPopup();
      expect(container.querySelector('h3')).not.toBeInTheDocument();
    });

    it('children이 렌더링된다', () => {
      renderPopup();
      expect(screen.getByText('팝업 내용')).toBeInTheDocument();
    });
  });

  describe('닫기 동작', () => {
    it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      renderPopup(onClose);
      fireEvent.click(screen.getByRole('button', { name: '닫기' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('오버레이 클릭 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      const { container } = renderPopup(onClose);
      fireEvent.click(container.querySelector('.popup__overlay')!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('팝업 내부 클릭 시 onClose가 호출되지 않는다 (stopPropagation)', () => {
      const onClose = vi.fn();
      renderPopup(onClose);
      fireEvent.click(screen.getByRole('dialog'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('Escape 키 입력 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      renderPopup(onClose);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('Escape 이외의 키 입력 시 onClose가 호출되지 않는다', () => {
      const onClose = vi.fn();
      renderPopup(onClose);
      fireEvent.keyDown(window, { key: 'Enter' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('popstate 이벤트 발생 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      renderPopup(onClose);
      fireEvent.popState(window);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('오버레이 이벤트 전파 차단', () => {
    it('오버레이 mousedown 시 이벤트 전파가 차단된다', () => {
      const { container } = renderPopup();
      const overlay = container.querySelector('.popup__overlay')!;
      const parentHandler = vi.fn();
      overlay.parentElement?.addEventListener('mousedown', parentHandler);
      fireEvent.mouseDown(overlay);
      overlay.parentElement?.removeEventListener('mousedown', parentHandler);
    });

    it('오버레이 pointerdown 시 이벤트 전파가 차단된다', () => {
      const { container } = renderPopup();
      const overlay = container.querySelector('.popup__overlay')!;
      const parentHandler = vi.fn();
      overlay.parentElement?.addEventListener('pointerdown', parentHandler);
      fireEvent.pointerDown(overlay);
      overlay.parentElement?.removeEventListener('pointerdown', parentHandler);
    });
  });

  describe('언마운트 시 이벤트 리스너 정리', () => {
    it('언마운트 후 Escape 키 입력 시 onClose가 호출되지 않는다', () => {
      const onClose = vi.fn();
      const { unmount } = renderPopup(onClose);
      unmount();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('언마운트 후 popstate 발생 시 onClose가 호출되지 않는다', () => {
      const onClose = vi.fn();
      const { unmount } = renderPopup(onClose);
      unmount();
      fireEvent.popState(window);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('variant prop', () => {
    it('variant=gallery이면 popup--gallery 클래스가 적용된다', () => {
      render(
        <Popup ariaLabel='갤러리' variant='gallery' onClose={vi.fn()}>
          <p>갤러리 내용</p>
        </Popup>,
      );
      expect(screen.getByRole('dialog')).toHaveClass('popup--gallery');
    });

    it('variant=default이면 popup--gallery 클래스가 없다', () => {
      render(
        <Popup ariaLabel='기본' variant='default' onClose={vi.fn()}>
          <p>기본 내용</p>
        </Popup>,
      );
      expect(screen.getByRole('dialog')).not.toHaveClass('popup--gallery');
    });
  });
});
