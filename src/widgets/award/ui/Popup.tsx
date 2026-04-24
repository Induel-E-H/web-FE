import { Popup } from '@shared/ui/Popup';

import { getAwardImage } from '../model/image';

export function AwardPopup({
  awardId,
  awardTitle,
  onClose,
}: {
  awardId: number;
  awardTitle: string;
  onClose: () => void;
}) {
  return (
    <Popup ariaLabel={`${awardTitle} 수상 이미지`} onClose={onClose}>
      <img src={getAwardImage(awardId)} alt={awardTitle} loading='lazy' />
    </Popup>
  );
}
