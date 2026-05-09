// @vitest-environment jsdom
// jsdom을 사용하는 이유: happy-dom은 Node.contains()에 window를 전달하면 TypeError를 던지므로
// 키보드/wheel 이벤트 핸들러의 dialogRef.current.contains(e.target) 검증이 불가능하다.
import { useRef } from 'react';

import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePopup } from './usePopup';

function TestComponent({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  usePopup(dialogRef, onClose);
  return <div ref={dialogRef} role='dialog' tabIndex={-1} />;
}

describe('usePopup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete document.body.dataset.popupOpen;
  });

  describe('마운트 동작', () => {
    it('마운트 시 document.body.dataset.popupOpen이 "true"로 설정된다', () => {
      render(<TestComponent onClose={vi.fn()} />);
      expect(document.body.dataset.popupOpen).toBe('true');
    });
  });

  describe('언마운트 동작', () => {
    it('언마운트 시 document.body.dataset.popupOpen이 제거된다', () => {
      const { unmount } = render(<TestComponent onClose={vi.fn()} />);
      unmount();
      expect(document.body.dataset.popupOpen).toBeUndefined();
    });
  });

  describe('Escape 키 동작', () => {
    it('Escape 키 입력 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      render(<TestComponent onClose={onClose} />);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('언마운트 후 Escape 키 입력 시 onClose가 호출되지 않는다', () => {
      const onClose = vi.fn();
      const { unmount } = render(<TestComponent onClose={onClose} />);
      unmount();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('popstate 동작', () => {
    it('popstate 이벤트 발생 시 onClose가 호출된다', () => {
      const onClose = vi.fn();
      render(<TestComponent onClose={onClose} />);
      fireEvent.popState(window);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('언마운트 후 popstate 이벤트 발생 시 onClose가 호출되지 않는다', () => {
      const onClose = vi.fn();
      const { unmount } = render(<TestComponent onClose={onClose} />);
      unmount();
      fireEvent.popState(window);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('스크롤 키 차단', () => {
    it('ArrowDown이 다이얼로그 밖에서 발생하면 preventDefault가 호출된다', () => {
      render(<TestComponent onClose={vi.fn()} />);
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      // window가 아닌 document.body에서 발생시켜야 e.target이 Node가 된다
      document.body.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
    });

    it('PageUp이 다이얼로그 밖에서 발생하면 preventDefault가 호출된다', () => {
      render(<TestComponent onClose={vi.fn()} />);
      const event = new KeyboardEvent('keydown', {
        key: 'PageUp',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.body.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
    });
  });

  describe('Tab 포커스 트랩', () => {
    it('다이얼로그 내 포커스 가능 요소가 없으면 Tab → preventDefault', () => {
      render(<TestComponent onClose={vi.fn()} />);
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
    });
  });

  describe('Wheel 차단', () => {
    it('다이얼로그 밖 wheel → preventDefault 호출', () => {
      render(<TestComponent onClose={vi.fn()} />);
      const event = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      document.body.dispatchEvent(event);
      expect(preventSpy).toHaveBeenCalled();
    });
  });

  describe('focusable 요소 inert 처리', () => {
    it('마운트 시 다이얼로그 밖 버튼이 inert가 된다', () => {
      const outsideBtn = document.createElement('button');
      document.body.appendChild(outsideBtn);

      render(<TestComponent onClose={vi.fn()} />);

      expect(outsideBtn.inert).toBe(true);
      document.body.removeChild(outsideBtn);
    });

    it('언마운트 시 inert 처리된 요소의 inert가 false로 복원된다', () => {
      const outsideBtn = document.createElement('button');
      document.body.appendChild(outsideBtn);

      const { unmount } = render(<TestComponent onClose={vi.fn()} />);
      unmount();

      expect(outsideBtn.inert).toBe(false);
      document.body.removeChild(outsideBtn);
    });
  });
});
