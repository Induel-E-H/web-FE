import '../../styles/book/PageTitle.css';

export function BookPageTitle({
  title,
  label,
  hidden,
}: {
  title: string;
  label: string;
  hidden?: boolean;
}) {
  return (
    <div
      className={`book-page-title${hidden ? ' book-page-title--hidden' : ''}`}
    >
      <div className='book-page-title__rule'>
        <span className='book-page-title__line' aria-hidden='true' />
        <span className='book-page-title__ornament' aria-hidden='true'>
          ✦
        </span>
        <h3>{label}</h3>
        <span className='book-page-title__ornament' aria-hidden='true'>
          ✦
        </span>
        <span className='book-page-title__line' aria-hidden='true' />
      </div>
      <p className='book-page-title__en' lang='en'>
        {title}
      </p>
    </div>
  );
}
