import '../../styles/book/Cover.css';

export function BookCover() {
  return (
    <div className='history__book-cover'>
      <div className='history__book-cover-left'></div>
      <div className='history__book-cover-center'>
        <div className='history__book-cover-center-line'>
          <div />
          <div />
        </div>
        <div className='history__book-cover-center-spine'>
          <div className='history__book-cover-center-spine-left'></div>
          <div className='history__book-cover-center-spine-center'></div>
          <div className='history__book-cover-center-spine-right'></div>
        </div>
      </div>
      <div className='history__book-cover-right'></div>
    </div>
  );
}
