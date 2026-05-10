import { type RefObject } from 'react';

import { POPUP_CLASS_NAMES } from '../model';
import { PopupCloseButton } from './PopupCloseButton';

type PopupHeaderProps = {
  title?: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export function PopupHeader({
  title,
  closeButtonRef,
  onClose,
}: PopupHeaderProps) {
  return (
    <div className={POPUP_CLASS_NAMES.header}>
      {title && <h3 className={POPUP_CLASS_NAMES.title}>{title}</h3>}
      <PopupCloseButton ref={closeButtonRef} onClick={onClose} />
    </div>
  );
}
