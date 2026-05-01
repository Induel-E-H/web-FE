import { type ReactNode, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';

import '../styles/Popup.css';

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

export function Popup({
  ariaLabel,
  title,
  variant = 'default',
  onClose,
  children,
}: {
  ariaLabel: string;
  title?: string;
  variant?: 'default' | 'gallery';
  onClose: () => void;
  children: ReactNode;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, []);

  useEffect(() => {
    document.body.dataset.popupOpen = 'true';
    history.pushState(null, '');

    function getFocusable() {
      return Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ??
          [],
      ).filter((el) => el.offsetParent !== null);
    }

    function handlePopState() {
      onClose();
    }

    function handleKeyDown(e: KeyboardEvent) {
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
        const atBoundary = e.shiftKey
          ? document.activeElement === first
          : document.activeElement === last;
        if (atBoundary) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
        return;
      }

      if (
        SCROLL_KEYS.has(e.key) &&
        !dialogRef.current?.contains(e.target as Node)
      ) {
        e.preventDefault();
      }
    }

    function handleWheel(e: WheelEvent) {
      if (!dialogRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    }

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      delete document.body.dataset.popupOpen;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [onClose]);

  return (
    <div
      className='popup__overlay'
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={ariaLabel}
        className={variant === 'gallery' ? 'popup popup--gallery' : 'popup'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='popup__header'>
          {title && <h3 className='popup__title'>{title}</h3>}
          <button
            ref={closeButtonRef}
            aria-label='닫기'
            className='popup__close'
            onClick={onClose}
          >
            <IoMdClose aria-hidden='true' />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
