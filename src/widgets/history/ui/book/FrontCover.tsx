import { useEffect, useState } from 'react';

import { COMPANY } from '@shared/constant/company';
import { getOrdinalSuffix } from '@shared/lib/ordinal';

import '../../styles/book/FrontCover.css';

const ESTABLISHED_YEAR = new Date(COMPANY.ESTABLISHED).getFullYear();

const COVER_MOVE_DURATION = 400;

export function FrontCoverInner() {
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;

  return (
    <div className='history__front-cover-inner' aria-hidden='true'>
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

  useEffect(() => {
    const id = requestAnimationFrame(() => setCentered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function handleClick() {
    if (!centered) return;
    setCentered(false);
    setTimeout(onClick, COVER_MOVE_DURATION);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      className={`history__front-cover${centered ? ' history__front-cover--centered' : ''}`}
      role='button'
      tabIndex={0}
      aria-label='책 열기'
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <FrontCoverInner />
    </div>
  );
}
