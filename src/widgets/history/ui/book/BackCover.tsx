import { useLayoutEffect, useRef } from 'react';

import '../../styles/book/BackCover.css';

const WORDS = ['EXHIBITION', 'ENVIRONMENTAL', 'INTERIOR'] as const;

export function BookBackCover({
  isAppearing,
  isDisappearing,
  onAnimationComplete,
  onClick,
}: {
  isAppearing: boolean;
  isDisappearing: boolean;
  onAnimationComplete: () => void;
  onClick: () => void;
}) {
  const coverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = coverRef.current;
    if (!el) return;

    if (isAppearing) {
      el.classList.remove('history__back-cover--disappear');
      el.classList.add('history__back-cover--appear');
    } else if (isDisappearing) {
      el.classList.remove('history__back-cover--appear');
      el.classList.add('history__back-cover--disappear');
    } else {
      el.classList.remove('history__back-cover--appear');
      el.classList.remove('history__back-cover--disappear');
      return;
    }

    const handler = () => onAnimationComplete();
    el.addEventListener('animationend', handler, { once: true });
    return () => el.removeEventListener('animationend', handler);
  }, [isAppearing, isDisappearing, onAnimationComplete]);

  const isAnimating = isAppearing || isDisappearing;

  return (
    <div
      ref={coverRef}
      className='history__back-cover'
      onClick={isAnimating ? undefined : onClick}
    >
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
