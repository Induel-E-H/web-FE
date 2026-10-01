import { useMemo } from 'react';

import { AWARD_LIST, type AwardItem } from '@entities/award';
import { useAwardStore, YEAR_ALL } from '@features/award';
import { trackAwardCardOpen } from '@shared/lib/analytics';

import '../styles/Viewport.css';
import { AwardCard } from './AwardCard';

export function Viewport() {
  const activeYear = useAwardStore((s) => s.activeYear);
  const setSelectedId = useAwardStore((s) => s.setSelectedId);

  const yearGroups = useMemo(() => {
    const list =
      activeYear === YEAR_ALL
        ? AWARD_LIST
        : AWARD_LIST.filter((award) =>
            award.date.startsWith(String(activeYear)),
          );
    const groups = new Map<string, AwardItem[]>();
    [...list]
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((award) => {
        const year = award.date.slice(0, 4);
        groups.set(year, [...(groups.get(year) ?? []), award]);
      });
    return [...groups];
  }, [activeYear]);

  return (
    <div className='award__list' role='region' aria-label='수상 목록'>
      {yearGroups.map(([year, awards]) => (
        <div key={year} className='award__year_group'>
          <h3 className='award__year'>{year}</h3>
          <ul className='award__grid'>
            {awards.map((award) => (
              <li key={award.id}>
                <AwardCard
                  award={award}
                  onClick={() => {
                    trackAwardCardOpen(award.title);
                    setSelectedId(award.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
