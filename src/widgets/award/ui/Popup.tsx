import { Popup } from '@shared/ui/Popup';

import { getAwardImage } from '../model/image';

export function AwardPopup({
  awardId,
  onClose,
}: {
  awardId: number;
  onClose: () => void;
}) {
  return (
    <Popup ariaLabel='당선작 상세보기' onClose={onClose}>
      <img
        src={getAwardImage(awardId)}
        alt={`당선작 ${awardId}`}
        loading='lazy'
      />
    </Popup>
  );
}
