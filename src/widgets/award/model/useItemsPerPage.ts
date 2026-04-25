import { useEffect, useState } from 'react';

import { getItemsPerPage } from './responsive';

export function useItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);

  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return itemsPerPage;
}
