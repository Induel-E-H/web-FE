// @vitest-environment jsdom
// jsdom을 사용하는 이유: happy-dom은 Node.contains()에 window를 전달하면 TypeError를 던지므로
// 키보드/wheel 이벤트 핸들러의 dialogRef.current.contains(e.target) 검증이 불가능하다.
import { useRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
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

    it('다이얼로그 안 wheel → preventDefault 미호출', () => {
      render(<TestComponent onClose={vi.fn()} />);
      const dialog = screen.getByRole('dialog');
      const event = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      dialog.dispatchEvent(event);
      expect(preventSpy).not.toHaveBeenCalled();
    });
  });

  describe('Tab 포커스 트랩 (포커스 가능 요소 있음)', () => {
    let originalDescriptor: PropertyDescriptor | undefined;

    function TestWithButtons({ onClose }: { onClose: () => void }) {
      const dialogRef = useRef<HTMLDivElement>(null);
      usePopup(dialogRef, onClose);
      return (
        <div ref={dialogRef} role='dialog' tabIndex={-1}>
          <button data-testid='btn-first'>첫 번째</button>
          <button data-testid='btn-last'>마지막</button>
        </div>
      );
    }

    beforeEach(() => {
      originalDescriptor = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetParent',
      );
      // jsdom에서 offsetParent는 항상 null이므로 parentNode로 override
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
        configurable: true,
        get() {
          return (this as HTMLElement).parentNode ?? null;
        },
      });
    });

    afterEach(() => {
      if (originalDescriptor) {
        Object.defineProperty(
          HTMLElement.prototype,
          'offsetParent',
          originalDescriptor,
        );
      }
    });

    it('마지막 요소에서 Tab → 첫 번째 요소로 포커스 이동', () => {
      render(<TestWithButtons onClose={vi.fn()} />);
      const first = screen.getByTestId('btn-first');
      const last = screen.getByTestId('btn-last');

      last.focus();
      expect(document.activeElement).toBe(last);

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(first);
    });

    it('첫 번째 요소에서 Shift+Tab → 마지막 요소로 포커스 이동', () => {
      render(<TestWithButtons onClose={vi.fn()} />);
      const first = screen.getByTestId('btn-first');
      const last = screen.getByTestId('btn-last');

      first.focus();
      expect(document.activeElement).toBe(first);

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(last);
    });

    it('중간 요소에서 Tab → preventDefault 없이 자연 포커스 이동', () => {
      function TestWithThreeButtons({ onClose }: { onClose: () => void }) {
        const dialogRef = useRef<HTMLDivElement>(null);
        usePopup(dialogRef, onClose);
        return (
          <div ref={dialogRef} role='dialog' tabIndex={-1}>
            <button data-testid='btn-a'>A</button>
            <button data-testid='btn-b'>B</button>
            <button data-testid='btn-c'>C</button>
          </div>
        );
      }

      render(<TestWithThreeButtons onClose={vi.fn()} />);
      const btnB = screen.getByTestId('btn-b');

      btnB.focus();
      expect(document.activeElement).toBe(btnB);

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      window.dispatchEvent(event);

      expect(preventSpy).not.toHaveBeenCalled();
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
