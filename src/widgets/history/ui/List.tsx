import artworks from '../asset/data/artwork.json';
import type { PageSide } from '../model/types';
import '../style/List.css';

const midpoint = Math.ceil(artworks.length / 2);
const leftItems = artworks.slice(0, midpoint);
const rightItems = artworks.slice(midpoint);

export function ListPage({
  side,
  onItemClick,
}: {
  side: PageSide;
  onItemClick?: (artworkIndex: number) => void;
}) {
  const items = side === 'left' ? leftItems : rightItems;
  const offset = side === 'left' ? 0 : midpoint;

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
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type='button'
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onItemClick?.(offset + i)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
