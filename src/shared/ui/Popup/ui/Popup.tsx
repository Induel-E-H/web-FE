import { type ReactNode } from 'react';
import { IoMdClose } from 'react-icons/io';

import '../styles/Popup.css';

export function Popup({
  ariaLabel,
  onClose,
  children,
}: {
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className='popup__overlay' onClick={onClose}>
      <div
        role='dialog'
        aria-modal='true'
        aria-label={ariaLabel}
        className='popup'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='popup__header'>
          <button aria-label='닫기' className='popup__close' onClick={onClose}>
            <IoMdClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
