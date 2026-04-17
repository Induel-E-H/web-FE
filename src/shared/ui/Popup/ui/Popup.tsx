import { type ReactNode, useEffect } from 'react';
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
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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
          <button aria-label='닫기' className='popup__close' onClick={onClose}>
            <IoMdClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
