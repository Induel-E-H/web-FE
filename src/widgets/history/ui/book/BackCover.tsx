import { useEffect, useRef, useState } from 'react';

import '../../styles/book/BackCover.css';

const WORDS = ['EXHIBITION', 'ENVIRONMENTAL', 'INTERIOR'] as const;

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
      className={`history__back-cover${centered ? ' history__back-cover--centered' : ''}`}
      onClick={centered ? onClick : undefined}
    >
      <BackCoverInner />
    </div>
  );
}
