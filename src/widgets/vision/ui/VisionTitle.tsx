import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/VisionTitle.css';

export function VisionTitle({
  ref,
}: {
  ref?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SectionTitle
      ref={ref}
      subTitle='CONCEPT'
      title='미래를 향한'
      className='vision__title'
    />
  );
}
