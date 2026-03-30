import { IoMdClose } from 'react-icons/io';

import { getAwardImage } from '../model/image';
import '../styles/Popup.css';

export function AwardPopup({
  awardId,
  onClose,
}: {
  awardId: number;
  onClose: () => void;
}) {
  return (
    <div className='award__popup__overlay' onClick={onClose}>
      <div className='award__popup' onClick={(e) => e.stopPropagation()}>
        <div className='award__popup_header'>
          <button
            aria-label='닫기'
            className='award__popup_close'
            onClick={onClose}
          >
            <IoMdClose />
          </button>
        </div>
        <img src={getAwardImage(awardId)} alt={`당선작 ${awardId}`} />
      </div>
    </div>
  );
}
