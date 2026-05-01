import { type RefObject } from 'react';
import { IoMdClose } from 'react-icons/io';

import { POPUP_CLASS_NAMES, POPUP_DEFAULTS } from '../model';

type CloseButtonProps = {
  ref: RefObject<HTMLButtonElement | null>;
  onClick: () => void;
};

export function PopupCloseButton({ ref, onClick }: CloseButtonProps) {
  return (
    <button
      ref={ref}
      aria-label={POPUP_DEFAULTS.ariaLabelClose}
      className={POPUP_CLASS_NAMES.close}
      onClick={onClick}
    >
      <IoMdClose aria-hidden='true' />
    </button>
  );
}
