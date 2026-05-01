import { type RefObject, useEffect } from 'react';

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

export function usePopupInert(
  dialogRef: RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    document.body.dataset.popupOpen = 'true';
    history.pushState(null, '');

    const allInteractive = document.querySelectorAll(FOCUSABLE_SELECTORS);
    allInteractive.forEach((el) => {
      if (!dialogRef.current?.contains(el)) {
        el.setAttribute('data-popup-inert', 'true');
        (el as HTMLElement).inert = true;
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        SCROLL_KEYS.has(e.key) &&
        !dialogRef.current?.contains(e.target as Node)
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!dialogRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      delete document.body.dataset.popupOpen;
      const allInert = document.querySelectorAll('[data-popup-inert="true"]');
      allInert.forEach((el) => {
        el.removeAttribute('data-popup-inert');
        (el as HTMLElement).inert = false;
      });

      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);
}
