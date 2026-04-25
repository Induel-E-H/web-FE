import { IoDocumentTextOutline } from 'react-icons/io5';

import type { PatentValidType } from '@entities/patent';
import { InfoCard } from '@shared/ui/InfoCard';

import '../styles/PatentCard.css';

export function PatentCard({
  item,
  onClick,
}: {
  item: PatentValidType;
  onClick: () => void;
}) {
  return (
    <InfoCard
      className='patent__card'
      icon={<IoDocumentTextOutline />}
      year={{
        text: `${item.filingDate.slice(0, 4)}년 출원`,
        dateTime: item.filingDate.replace(/\. /g, '-'),
      }}
      title={item.title}
      secondary={item.serialNumber}
      onClick={onClick}
    />
  );
}
