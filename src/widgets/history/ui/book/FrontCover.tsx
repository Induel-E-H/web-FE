import { useEffect, useRef, useState } from 'react';

import { COMPANY } from '@shared/constant/company';
import { getOrdinalSuffix } from '@shared/lib/ordinal/getOrdinalSuffix';

import '../../styles/book/FrontCover.css';

const ESTABLISHED_YEAR = new Date(COMPANY.ESTABLISHED).getFullYear();

export function FrontCoverInner() {
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;

  return (
    <div className='history__front-cover-inner'>
      <hr className='history__front-cover-spine' />
      <div className='history__front-cover-text'>
        <div className='history__front-cover-title'>
          <span>INDUEL</span>
          <span>DESIGN</span>
        </div>
        <div className='history__front-cover-year'>
          <span className='history__front-cover-year-number'>{years}</span>
          <span className='history__front-cover-year-ordinal'>
            {getOrdinalSuffix(years)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BookFrontCover({ onClick }: { onClick: () => void }) {
  const [centered, setCentered] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      setCentered(true);
    });
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`history__front-cover${centered ? ' history__front-cover--centered' : ''}`}
      onClick={centered ? onClick : undefined}
    >
      <FrontCoverInner />
    </div>
  );
}
