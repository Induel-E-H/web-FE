import { SectionTitle } from '@shared/ui/SectionTitle';

import '../styles/PatentTitle.css';

export function PatentTitle() {
  return (
    <SectionTitle
      label='PATENTS'
      headings={['특허 취득 기록', '혁신의 증명']}
      className='patent__title'
    />
  );
}
