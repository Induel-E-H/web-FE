// @vitest-environment jsdom
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
});
