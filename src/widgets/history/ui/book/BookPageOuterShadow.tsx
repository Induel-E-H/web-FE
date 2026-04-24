import { PAGE_SIDE, type PageSide } from '@features/history';

import '../../styles/book/BookPageOuterShadow.css';

export function BookPageOuterShadow({
  side,
  count,
}: {
  side: PageSide;
  count: number;
}) {
  const levels =
    side === PAGE_SIDE.LEFT
      ? Array.from({ length: count }, (_, i) => count - i)
      : Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className='history__book-page-outer-shadow'>
      {count
        ? levels.map((level) => (
            <div
              key={level}
              className={`history__book-page-outer-shadow-${level}`}
            />
          ))
        : null}
    </div>
  );
}
