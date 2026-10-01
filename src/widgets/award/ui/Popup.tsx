import { AWARD_IMAGE_RATIO, AWARD_LIST, getAwardImage } from '@entities/award';
import { useAwardStore } from '@features/award';
import { Popup } from '@shared/ui/Popup';

export function AwardPopup() {
  const selectedId = useAwardStore((s) => s.selectedId);
  const setSelectedId = useAwardStore((s) => s.setSelectedId);

  if (selectedId === null) return null;

  const award = AWARD_LIST[selectedId];
  const title = award.title ?? '수상 이미지';

  return (
    <Popup
      ariaLabel={`${title} 수상 이미지`}
      mediaRatio={AWARD_IMAGE_RATIO}
      onClose={() => setSelectedId(null)}
    >
      <img src={getAwardImage(selectedId)} alt={`${title} 수상 이미지`} />
    </Popup>
  );
}
