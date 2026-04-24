import { type ReactNode, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';

import '../styles/Popup.css';

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
    document.body.style.overflow = 'hidden';
    history.pushState(null, '');

    function handlePopState() {
      onClose();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
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
