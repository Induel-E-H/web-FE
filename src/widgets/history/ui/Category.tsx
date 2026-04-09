import { Fragment } from 'react/jsx-runtime';

import { INDEX_LIST, type IndexItem } from '@features/history';

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
    <div className='history__category' role='tablist'>
      {INDEX_LIST.map((item, index) => (
        <Fragment key={item}>
          <button
            role='tab'
            aria-selected={tabActiveItem === item}
            className={tabActiveItem === item ? 'active' : ''}
            onClick={() => handleCategoryClick(item)}
          >
            {item}
          </button>
          {index < INDEX_LIST.length - 1 && <span aria-hidden='true'>|</span>}
        </Fragment>
      ))}
    </div>
  );
}
