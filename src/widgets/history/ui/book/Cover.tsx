import type { PageSide } from '@features/history';

import '../../styles/book/Cover.css';

export function BookCover({
  side,
  isHidden,
}: {
  side: PageSide;
  isHidden: boolean;
}) {
  const isLeft = side === 'left';

  return (
    <div
      className={`history__book-cover-${side}${isHidden ? ' history__book-cover--hidden' : ''}`}
    >
      <div className='history__book-cover-center'>
        <div className='history__book-cover-center-line'>
          <div />
          <div />
        </div>

        <div className='history__book-cover-center-spine'>
          {isLeft && <div className='history__book-cover-center-spine-left' />}

          <div className='history__book-cover-center-spine-center' />

          {!isLeft && (
            <div className='history__book-cover-center-spine-right' />
          )}
        </div>
      </div>
    </div>
  );
}
