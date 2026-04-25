import { AWARD_LIST } from '@entities/award';

export const YEAR_ALL = '전체';

const years = [
  ...new Set(AWARD_LIST.map((a) => Number(a.date.slice(0, 4)))),
].sort((a, b) => b - a);

export const YEAR_LIST: (string | number)[] = [YEAR_ALL, ...years];
