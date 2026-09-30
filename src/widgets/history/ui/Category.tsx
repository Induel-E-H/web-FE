import { INDEX_LIST, type IndexItem } from '@features/history';

import '../styles/Category.css';

const LABEL: Record<IndexItem, string> = {
  List: '목차',
  Content: '본문',
  Timeline: '연혁',
  Milestones: '주요 성과',
};

interface Props {
  activeItem: IndexItem;
  navigateToCategory: (item: IndexItem) => void;
}

export function HistoryCategory({ activeItem, navigateToCategory }: Props) {
  return (
    <nav className='history__category' aria-label='역사 카테고리'>
      {INDEX_LIST.map((item) => (
        <button
          key={item}
          aria-current={activeItem === item ? 'true' : undefined}
          className={activeItem === item ? 'active' : ''}
          onClick={() => navigateToCategory(item)}
        >
          {LABEL[item]}
        </button>
      ))}
    </nav>
  );
}
