import type { IndexItem, PageSide } from '@features/history/model/types';
import type { Breakpoint } from '@shared/lib/breakpoint/useBreakpoint';

import { ContentPage } from './content_container/Content';
import { ListPage } from './content_container/List';
import { MilestonesPage } from './content_container/Milestones';
import { TimelinePage } from './content_container/Timeline';

interface BookPageContentProps {
  side: PageSide;
  pageIndex: number;
  item: IndexItem;
  breakpoint: Breakpoint;
  onListItemClick: (index: number) => void;
}

export function BookPageContent({
  side,
  pageIndex,
  item,
  breakpoint,
  onListItemClick,
}: BookPageContentProps) {
  switch (item) {
    case 'List':
      return <ListPage side={side} onItemClick={onListItemClick} />;
    case 'Content':
      return <ContentPage side={side} pageIndex={pageIndex} />;
    case 'Timeline':
      return <TimelinePage side={side} />;
    case 'Milestones':
      return (
        <MilestonesPage
          side={side}
          pageIndex={pageIndex}
          breakpoint={breakpoint}
        />
      );
  }
}
