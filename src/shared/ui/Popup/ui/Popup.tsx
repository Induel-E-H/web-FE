import { type ReactNode, useRef } from 'react';

import { motion } from 'framer-motion';

import { POPUP_CLASS_NAMES, usePopup } from '../model';
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

  usePopup(dialogRef, onClose);

  const isGallery = variant === 'gallery';
  const dialogClassName = isGallery
    ? `${POPUP_CLASS_NAMES.dialog} ${POPUP_CLASS_NAMES.dialogGallery}`
    : POPUP_CLASS_NAMES.dialog;

  return (
    <motion.div
      className={POPUP_CLASS_NAMES.overlay}
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={ariaLabel}
        className={dialogClassName}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
      >
        <PopupHeader
          title={title}
          closeButtonRef={closeButtonRef}
          onClose={onClose}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}
