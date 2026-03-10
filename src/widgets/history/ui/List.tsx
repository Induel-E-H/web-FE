import artworks from '../data/artwork.json';
import type { PageSide } from '../model/types';
import '../style/List.css';

const midpoint = Math.ceil(artworks.length / 2);
const leftItems = artworks.slice(0, midpoint);
const rightItems = artworks.slice(midpoint);

export function ListPage({ side }: { side: PageSide }) {
  const items = side === 'left' ? leftItems : rightItems;

  return (
    <div className='list__container'>
      <div
        className={`list__title${side === 'right' ? ' list__title--hidden' : ''}`}
      >
        <hr />
        <h3>List</h3>
        <hr />
      </div>
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
