import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function usePopupFocusTrap(
  dialogRef: RefObject<HTMLDivElement | null>,
  closeButtonRef: RefObject<HTMLButtonElement | null>,
  onClose: () => void,
) {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const getFocusable = () => {
      return Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ??
          [],
      ).filter((el) => el.offsetParent !== null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const currentElement = document.activeElement;
        const isFirst = currentElement === first;
        const isLast = currentElement === last;

        if (e.shiftKey && isFirst) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && isLast) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      queueMicrotask(() => {
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus({ preventScroll: true });
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);
}
