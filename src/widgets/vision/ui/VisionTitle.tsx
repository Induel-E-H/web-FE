import { useIntersectionAnimation } from '@shared/lib/useIntersectionAnimation';
import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/VisionTitle.css';

export function VisionTitle() {
  const ref = useIntersectionAnimation<HTMLElement>();

  return (
    <SectionTitle
      ref={ref}
      subTitle='CONCEPT'
      title='미래를 향한'
      variant='reverse'
      className='vision__title'
    />
  );
}
