import { IoDocumentTextOutline } from 'react-icons/io5';

import type { PatentValidType } from '@entities/patent';
import { InfoCard } from '@shared/ui/InfoCard';

import '../styles/PatentCard.css';

export function PatentCard({
  patent,
  onClick,
}: {
  patent: PatentValidType;
  onClick: () => void;
}) {
  return (
    <InfoCard
      className='patent__card'
      icon={<IoDocumentTextOutline />}
      year={{
        text: `${patent.filingDate.slice(0, 4)}년 출원`,
        dateTime: patent.filingDate.replace(/\. /g, '-'),
      }}
      title={patent.title}
      secondary={patent.serialNumber}
      onClick={onClick}
    />
  );
}
