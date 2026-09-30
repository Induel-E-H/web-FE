import { Fragment } from 'react/jsx-runtime';

import { INDEX_LIST, type IndexItem } from '@features/history';

import '../styles/Category.css';

interface Props {
  activeItem: IndexItem;
  navigateToCategory: (item: IndexItem) => void;
}

export function HistoryCategory({ activeItem, navigateToCategory }: Props) {
  return (
    <nav className='history__category' aria-label='역사 카테고리'>
      {INDEX_LIST.map((item, index) => (
        <Fragment key={item}>
          <button
            aria-current={activeItem === item ? 'true' : undefined}
            className={activeItem === item ? 'active' : ''}
            onClick={() => navigateToCategory(item)}
          >
            {item}
          </button>
          {index < INDEX_LIST.length - 1 && <span aria-hidden='true'>|</span>}
        </Fragment>
      ))}
    </nav>
  );
}
