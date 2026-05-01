import { getPatentImage, PATENT_VALID_LIST } from '@entities/patent';
import { Popup } from '@shared/ui/Popup';

export function PatentPopup({
  patentId,
  patentTitle,
  onClose,
}: {
  patentId: number;
  patentTitle: string;
  onClose: () => void;
}) {
  return (
    <Popup ariaLabel={`${patentTitle} 특허증 이미지`} onClose={onClose}>
      <img
        src={getPatentImage(patentId)}
        alt={PATENT_VALID_LIST[patentId].title}
        loading='lazy'
      />
    </Popup>
  );
}
