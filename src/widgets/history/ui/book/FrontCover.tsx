import { useLayoutEffect, useRef } from 'react';

import { COMPANY } from '@shared/constant/company';
import { getOrdinalSuffix } from '@shared/lib/ordinal/getOrdinalSuffix';

import '../../styles/book/FrontCover.css';

const ESTABLISHED_YEAR = new Date(COMPANY.ESTABLISHED).getFullYear();

export function BookFrontCover({
  isFlipping,
  isClosing,
  onAnimationComplete,
  onClick,
}: {
  isFlipping: boolean;
  isClosing: boolean;
  onAnimationComplete: () => void;
  onClick: () => void;
}) {
  const coverRef = useRef<HTMLDivElement>(null);
  const years = new Date().getFullYear() - ESTABLISHED_YEAR;

  useLayoutEffect(() => {
    const el = coverRef.current;
    if (!el) return;

    if (isFlipping) {
      el.classList.remove('history__front-cover--close');
      el.classList.add('history__front-cover--flip');
    } else if (isClosing) {
      el.classList.remove('history__front-cover--flip');
      el.classList.add('history__front-cover--close');
    } else {
      el.classList.remove('history__front-cover--flip');
      el.classList.remove('history__front-cover--close');
      return;
    }

    const handler = () => onAnimationComplete();
    el.addEventListener('animationend', handler, { once: true });
    return () => el.removeEventListener('animationend', handler);
  }, [isFlipping, isClosing, onAnimationComplete]);

  const isAnimating = isFlipping || isClosing;

  return (
    <div
      ref={coverRef}
      className='history__front-cover'
      onClick={isAnimating ? undefined : onClick}
    >
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
