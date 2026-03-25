import { useCallback, useRef, useState } from 'react';

import { DEFAULT_COLUMNS } from './constant';

export function useGridLayout() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [rows, setRows] = useState(1);
  const observerRef = useRef<ResizeObserver | null>(null);

  const gridRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    observerRef.current = new ResizeObserver(() => {
      const style = getComputedStyle(node);
      const columnCount = style.gridTemplateColumns.split(' ').length;
      const rowCount = parseInt(style.getPropertyValue('--grid-rows'), 10) || 1;
      setColumns(columnCount);
      setRows(rowCount);
    });

    observerRef.current.observe(node);
  }, []);

  return { gridRef, columns, rows };
}
