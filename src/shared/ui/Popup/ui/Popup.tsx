import { type ReactNode, useRef } from 'react';

import { usePopupFocusTrap, usePopupInert } from '../model';
import { POPUP_CLASS_NAMES } from '../model';
import '../styles/Popup.css';
import { PopupHeader } from './PopupHeader';

type PopupProps = {
  ariaLabel: string;
  title?: string;
  variant?: 'default' | 'gallery';
  onClose: () => void;
  children: ReactNode;
};

export function Popup({
  ariaLabel,
  title,
  variant = 'default',
  onClose,
  children,
}: PopupProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  usePopupFocusTrap(dialogRef, closeButtonRef, onClose);
  usePopupInert(dialogRef, onClose);

  const isGallery = variant === 'gallery';
  const dialogClassName = isGallery
    ? `${POPUP_CLASS_NAMES.dialog} ${POPUP_CLASS_NAMES.dialogGallery}`
    : POPUP_CLASS_NAMES.dialog;

  return (
    <div
      className={POPUP_CLASS_NAMES.overlay}
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={ariaLabel}
        className={dialogClassName}
        onClick={(e) => e.stopPropagation()}
      >
        <PopupHeader
          title={title}
          closeButtonRef={closeButtonRef}
          onClose={onClose}
        />
        {children}
      </div>
    </div>
  );
}
