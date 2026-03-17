import { PAGE_SIDE } from '../model/constants';
import type { PageSide } from '../model/types';
import '../styles/HistoryBook.css';

function BookPageOuterShadow({ side }: { side: PageSide }) {
  const levels = side === PAGE_SIDE.LEFT ? [3, 2, 1] : [1, 2, 3];
  return (
    <div className='history__book-page-outer-shadow'>
      {levels.map((level) => (
        <div
          key={level}
          className={`history__book-page-outer-shadow-${level}`}
        />
      ))}
    </div>
  );
}

export function BookPage({
  side,
  children,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  clickable,
  animClass,
}: {
  side: PageSide;
  children?: React.ReactNode;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  clickable?: boolean;
  animClass?: string;
}) {
  return (
    <div
      className={`history__book-page-${side}${clickable ? ` history__book-page-${side}--clickable` : ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {side === PAGE_SIDE.LEFT ? (
        <>
          <BookPageOuterShadow side={PAGE_SIDE.LEFT} />
          <div
            className={`history__book-page-flip${animClass ? ` ${animClass}` : ''}`}
          >
            <div className='history__book-page-content'>{children}</div>
            <div className='history__book-page-inner-shadow' />
          </div>
        </>
      ) : (
        <>
          <div
            className={`history__book-page-flip${animClass ? ` ${animClass}` : ''}`}
          >
            <div className='history__book-page-inner-shadow' />
            <div className='history__book-page-content'>{children}</div>
          </div>
          <BookPageOuterShadow side={PAGE_SIDE.RIGHT} />
        </>
      )}
    </div>
  );
}
