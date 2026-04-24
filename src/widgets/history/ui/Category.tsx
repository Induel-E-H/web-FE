import { Fragment } from 'react/jsx-runtime';

import { INDEX_LIST, type IndexItem } from '@features/history';

import '../styles/Category.css';

interface Props {
  tabActiveItem: IndexItem;
  navigateToCategory: (
    item: IndexItem,
    pageIndex?: number,
    useRapidFlip?: boolean,
  ) => void;
}

export function HistoryCategory({ tabActiveItem, navigateToCategory }: Props) {
  function handleCategoryClick(item: IndexItem) {
    navigateToCategory(item, 0, true);
  }

  return (
    <nav className='history__category' aria-label='역사 카테고리'>
      {INDEX_LIST.map((item, index) => (
        <Fragment key={item}>
          <button
            aria-current={tabActiveItem === item ? 'true' : undefined}
            className={tabActiveItem === item ? 'active' : ''}
            onClick={() => handleCategoryClick(item)}
          >
            {item}
          </button>
          {index < INDEX_LIST.length - 1 && <span aria-hidden='true'>|</span>}
        </Fragment>
      ))}
    </nav>
  );
}
