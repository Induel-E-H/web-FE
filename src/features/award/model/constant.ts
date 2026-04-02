import { AWARD_LIST } from '@entities/award';

const years = [
  ...new Set(AWARD_LIST.map((a) => Number(a.date.slice(0, 4)))),
].sort((a, b) => b - a);

export const YEAR_LIST: (string | number)[] = ['전체', ...years];
