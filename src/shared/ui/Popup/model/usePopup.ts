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

const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

export function usePopup(
  dialogRef: RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setTimeout(() => dialogRef.current?.focus(), 0);

    document.body.dataset.popupOpen = 'true';
    history.pushState(null, '');

    document
      .querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      .forEach((el) => {
        if (!dialogRef.current?.contains(el)) {
          el.dataset.popupInert = 'true';
          el.inert = true;
        }
      });

    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ??
          [],
      ).filter((el) => el.offsetParent !== null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (
        SCROLL_KEYS.has(e.key) &&
        !dialogRef.current?.contains(e.target as Node)
      ) {
        e.preventDefault();
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
        const current = document.activeElement;

        if (e.shiftKey && current === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!dialogRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handlePopState = () => onCloseRef.current();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('popstate', handlePopState);

    return () => {
      delete document.body.dataset.popupOpen;

      document.querySelectorAll('[data-popup-inert="true"]').forEach((el) => {
        delete (el as HTMLElement).dataset.popupInert;
        (el as HTMLElement).inert = false;
      });

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('popstate', handlePopState);

      queueMicrotask(() =>
        previousActiveElement?.focus({ preventScroll: true }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
