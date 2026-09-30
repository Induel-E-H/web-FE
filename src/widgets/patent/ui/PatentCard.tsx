import { TbCertificate } from 'react-icons/tb';

import type { PatentValidType } from '@entities/patent';

import '../styles/PatentCard.css';

export function PatentCard({
  patent,
  onClick,
}: {
  patent: PatentValidType;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      className='patent__card'
      onMouseDown={(e) => {
        e.preventDefault();
        e.currentTarget.focus({ preventScroll: true });
      }}
      onClick={onClick}
    >
      <span className='patent__card__top'>
        <span className='patent__card__seal' aria-hidden='true'>
          <TbCertificate />
        </span>
        <time
          className='patent__card__year'
          dateTime={patent.filingDate.replace(/\. /g, '-')}
        >
          {patent.filingDate.slice(0, 4)}년 출원
        </time>
      </span>
      <span className='patent__card__title'>{patent.title}</span>
      <span className='patent__card__serial'>
        <small>등록번호</small>
        {patent.serialNumber}
      </span>
    </button>
  );
}
