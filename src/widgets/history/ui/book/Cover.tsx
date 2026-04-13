import type { PageSide } from '@features/history';

import '../../styles/book/Cover.css';

export function BookCover({ side }: { side: PageSide }) {
  const isLeft = side === 'left';

  return (
    <div
      className={
        isLeft ? 'history__book-cover-left' : 'history__book-cover-right'
      }
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
