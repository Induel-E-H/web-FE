import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/PatentTitle.css';

export function PatentTitle() {
  return (
    <SectionTitle
      subTitle='PATENTS'
      title='특허 취득 기록'
      className='patent__title'
    />
  );
}
