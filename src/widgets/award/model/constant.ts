import { award as awards } from '../../../entities/award';

const years = [...new Set(awards.map((a) => Number(a.time.slice(0, 4))))].sort(
  (a, b) => b - a,
);

export const YEAR_LIST: (string | number)[] = ['전체', ...years];
