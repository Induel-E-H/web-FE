import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/MapTitle.css';

export function MapTitle() {
  return (
    <SectionTitle
      subTitle='LOCATION'
      title='찾아오시는 길'
      className='map__title'
    />
  );
}
