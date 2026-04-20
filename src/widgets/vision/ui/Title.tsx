import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/Title.css';

export function VisionTitle({
  ref,
}: {
  ref?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SectionTitle
      ref={ref}
      label='FUTURE VISION'
      headings={['미래를 향한', '세 가지 방향']}
      className='vision__title'
    />
  );
}
