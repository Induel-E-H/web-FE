import { useEffect, useState } from 'react';

import '../../styles/book/BackCover.css';

const WORDS = ['EXHIBITION', 'ENVIRONMENTAL', 'INTERIOR'] as const;

const COVER_MOVE_DURATION = 400;

export function BackCoverInner() {
  return (
    <div className='history__back-cover-inner'>
      <hr className='history__back-cover-spine' />
      <div className='history__back-cover-content'>
        {WORDS.map((word) => (
          <span key={word} className='history__back-cover-word'>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BookBackCover({ onClick }: { onClick: () => void }) {
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

  return (
    <div
      className={`history__back-cover${centered ? ' history__back-cover--centered' : ''}`}
      onClick={handleClick}
    >
      <BackCoverInner />
    </div>
  );
}
