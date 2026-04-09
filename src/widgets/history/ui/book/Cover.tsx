import '../../styles/book/Cover.css';

export function BookCover() {
  return (
    <div className='history__book-cover'>
      {/* history__book-cover-left (z:2) */}
      <div className='history__book-cover-left'></div>
      <div className='history__book-cover-center'>
        {/* history__book-cover-center-line (z:1) */}
        <div className='history__book-cover-center-line'>
          <div />
          <div />
        </div>
        {/* history__book-cover-center-spine (z:) */}
        <div className='history__book-cover-center-spine'>
          <div className='history__book-cover-center-spine-left'></div>
          <div className='history__book-cover-center-spine-center'></div>
          <div className='history__book-cover-center-spine-right'></div>
        </div>
      </div>
      {/* history__book-cover-left (z:2) */}
      <div className='history__book-cover-right'></div>
    </div>
  );
}
