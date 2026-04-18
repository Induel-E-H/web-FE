import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/MapTitle.css';

export function MapTitle() {
  return (
    <SectionTitle
      label='LOCATION'
      headings='찾아오시는 길'
      className='map__title'
    />
  );
}
