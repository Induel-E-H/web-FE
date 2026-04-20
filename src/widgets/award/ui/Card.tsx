import { FiAward } from 'react-icons/fi';

import type { AwardItem } from '@entities/award';
import { InfoCard } from '@shared/ui/InfoCard';

import '../styles/Card.css';

export function Card({
  award,
  onClick,
}: {
  award: AwardItem;
  onClick: (id: number) => void;
}) {
  return (
    <InfoCard
      className='award__card'
      icon={<FiAward />}
      year={{
        text: award.date.slice(0, 4),
        dateTime: award.date.replace(/\. /g, '-'),
      }}
      title={award.title}
      secondary={award.issuer}
      onClick={() => onClick(award.id)}
    />
  );
}
