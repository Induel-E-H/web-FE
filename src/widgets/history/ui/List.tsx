import artworks from '../data/artwork.json';
import '../style/List.css';

type PageSide = 'left' | 'right';

const leftItems = artworks.slice(0, 26);
const rightItems = artworks.slice(26);

export function ListPage({ side }: { side: PageSide }) {
  const items = side === 'left' ? leftItems : rightItems;

  return (
    <div className='list__container'>
      {side == 'left' ? (
        <>
          <div className='list__title' aria-hidden='true'>
            <hr />
            <h3>List</h3>
            <hr />
          </div>
        </>
      ) : null}

      <ul className='list__ul'>
        {items.map((item) => (
          <li key={item.title}>
            <button type='button'>{item.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
