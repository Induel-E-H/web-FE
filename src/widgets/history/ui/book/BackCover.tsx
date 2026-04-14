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
  return (
    <div className='history__back-cover' onClick={onClick}>
      <BackCoverInner />
    </div>
  );
}
