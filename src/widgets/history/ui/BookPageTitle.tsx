import type { CSSProperties } from 'react';

import '../styles/BookPageTitle.css';

export function BookPageTitle({
  title,
  hidden,
  hrWidth,
}: {
  title: string;
  hidden?: boolean;
  hrWidth?: string;
}) {
  return (
    <div
      className={`book-page-title${hidden ? ' book-page-title--hidden' : ''}`}
      style={
        hrWidth ? ({ '--title-hr-width': hrWidth } as CSSProperties) : undefined
      }
    >
      <hr aria-hidden='true' />
      <h3>{title}</h3>
      <hr aria-hidden='true' />
    </div>
  );
}
