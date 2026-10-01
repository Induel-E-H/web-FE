import { getPatentImage, PATENT_IMAGE_RATIO } from '@entities/patent';
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
    <Popup
      ariaLabel={`${patentTitle} 특허증 이미지`}
      mediaRatio={PATENT_IMAGE_RATIO}
      onClose={onClose}
    >
      <img
        src={getPatentImage(patentId)}
        alt={`${patentTitle} 특허증 이미지`}
      />
    </Popup>
  );
}
